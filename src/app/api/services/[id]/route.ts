import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    const service = await db.service.findUnique({
      where: { id },
      include: {
        seller: {
          select: { id: true, name: true, avatar: true, shopName: true, phone: true },
        },
        category: {
          select: { id: true, name: true, icon: true },
        },
        _count: {
          select: { orders: true },
        },
      },
    });

    if (!service) {
      return NextResponse.json(
        { error: 'Service not found' },
        { status: 404 }
      );
    }

    // Increment views
    await db.service.update({
      where: { id },
      data: { views: { increment: 1 } },
    });

    const updatedService = {
      ...service,
      views: service.views + 1,
    };

    return NextResponse.json({ service: updatedService });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Failed to fetch service';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();

    const service = await db.service.findUnique({ where: { id } });
    if (!service) {
      return NextResponse.json(
        { error: 'Service not found' },
        { status: 404 }
      );
    }

    const {
      title,
      description,
      price,
      priceUSD,
      image,
      categoryId,
      serviceType,
      speed,
      connectionType,
      provider,
      contact,
      status,
    } = body;

    const updatedService = await db.service.update({
      where: { id },
      data: {
        ...(title !== undefined && { title }),
        ...(description !== undefined && { description }),
        ...(price !== undefined && { price: parseFloat(price) }),
        ...(priceUSD !== undefined && { priceUSD: parseFloat(priceUSD) }),
        ...(image !== undefined && { image }),
        ...(categoryId !== undefined && { categoryId }),
        ...(serviceType !== undefined && { serviceType }),
        ...(speed !== undefined && { speed }),
        ...(connectionType !== undefined && { connectionType }),
        ...(provider !== undefined && { provider }),
        ...(contact !== undefined && { contact }),
        ...(status !== undefined && { status }),
      },
      include: {
        seller: {
          select: { id: true, name: true, avatar: true, shopName: true },
        },
        category: {
          select: { id: true, name: true, icon: true },
        },
      },
    });

    return NextResponse.json({ service: updatedService });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Failed to update service';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    const service = await db.service.findUnique({ where: { id } });
    if (!service) {
      return NextResponse.json(
        { error: 'Service not found' },
        { status: 404 }
      );
    }

    await db.service.delete({
      where: { id },
    });

    return NextResponse.json({ message: 'Service deleted successfully' });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Failed to delete service';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
