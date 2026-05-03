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

    const order = await db.order.findUnique({
      where: { id },
      include: {
        product: true,
        buyer: true,
      },
    });

    if (!order) {
      return NextResponse.json(
        { error: 'Order not found' },
        { status: 404 }
      );
    }

    // If cancelling, check if order was created within 1 hour
    if (status === 'CANCELLED') {
      const now = new Date();
      const createdAt = new Date(order.createdAt);
      const diffMs = now.getTime() - createdAt.getTime();
      const diffHours = diffMs / (1000 * 60 * 60);

      if (diffHours > 1) {
        return NextResponse.json(
          { error: 'Order can only be cancelled within 1 hour of creation' },
          { status: 400 }
        );
      }

      // Restore product status to ACTIVE
      await db.product.update({
        where: { id: order.productId },
        data: { status: 'ACTIVE' },
      });
    }

    const updatedOrder = await db.order.update({
      where: { id },
      data: { status },
      include: {
        buyer: {
          select: { id: true, name: true, email: true },
        },
        product: {
          select: { id: true, title: true, image: true, price: true },
        },
      },
    });

    // Create notification for buyer
    await db.notification.create({
      data: {
        userId: order.buyerId,
        title: 'Order Update',
        message: `Your order #${id.slice(-6)} has been updated to ${status.replace(/_/g, ' ')}`,
        type: 'ORDER',
      },
    });

    return NextResponse.json({ order: updatedOrder });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Failed to update order';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
