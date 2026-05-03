import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const buyerId = searchParams.get('buyerId');

    if (!buyerId) {
      return NextResponse.json(
        { error: 'buyerId query parameter is required' },
        { status: 400 }
      );
    }

    const orders = await db.serviceOrder.findMany({
      where: { buyerId },
      include: {
        buyer: {
          select: { id: true, name: true, email: true },
        },
        service: {
          select: {
            id: true,
            title: true,
            image: true,
            price: true,
            serviceType: true,
            speed: true,
            connectionType: true,
            provider: true,
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    });

    return NextResponse.json({ orders });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Failed to fetch service orders';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { buyerId, serviceId, total, totalUSD, buyerNotes } = body;

    if (!buyerId || !serviceId || !total) {
      return NextResponse.json(
        { error: 'buyerId, serviceId, and total are required' },
        { status: 400 }
      );
    }

    // Verify service exists and is active
    const service = await db.service.findUnique({ where: { id: serviceId } });
    if (!service || service.status !== 'ACTIVE') {
      return NextResponse.json(
        { error: 'Service not available' },
        { status: 404 }
      );
    }

    const order = await db.serviceOrder.create({
      data: {
        buyerId,
        serviceId,
        total: parseFloat(total),
        totalUSD: totalUSD ? parseFloat(totalUSD) : null,
        buyerNotes: buyerNotes || null,
      },
      include: {
        buyer: {
          select: { id: true, name: true, email: true },
        },
        service: {
          select: {
            id: true,
            title: true,
            image: true,
            price: true,
            serviceType: true,
          },
        },
      },
    });

    // Create notification for seller
    await db.notification.create({
      data: {
        userId: service.sellerId,
        title: 'New Service Order',
        message: `You have a new service order for "${service.title}"`,
        type: 'ORDER',
      },
    });

    return NextResponse.json({ order }, { status: 201 });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Failed to create service order';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
