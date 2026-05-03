import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';

const VALID_STATUSES = ['PROCESSING', 'OUT_FOR_DELIVERY', 'DELIVERED', 'CANCELLED'];

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();
    const { status } = body;

    if (!status || !VALID_STATUSES.includes(status)) {
      return NextResponse.json(
        { error: `Invalid status. Must be one of: ${VALID_STATUSES.join(', ')}` },
        { status: 400 }
      );
    }

    const order = await db.serviceOrder.findUnique({
      where: { id },
      include: {
        service: true,
        buyer: true,
      },
    });

    if (!order) {
      return NextResponse.json(
        { error: 'Service order not found' },
        { status: 404 }
      );
    }

    const updatedOrder = await db.serviceOrder.update({
      where: { id },
      data: { status },
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

    // Create notification for buyer
    await db.notification.create({
      data: {
        userId: order.buyerId,
        title: 'Service Order Update',
        message: `Your service order #${id.slice(-6)} for "${order.service.title}" has been updated to ${status.replace(/_/g, ' ')}`,
        type: 'ORDER',
      },
    });

    return NextResponse.json({ order: updatedOrder });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Failed to update service order';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
