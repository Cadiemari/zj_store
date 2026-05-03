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

    const orders = await db.order.findMany({
      where: { buyerId },
      include: {
        buyer: {
          select: { id: true, name: true, email: true },
        },
        product: {
          select: { id: true, title: true, image: true, price: true },
        },
      },
      orderBy: { createdAt: 'desc' },
    });

    return NextResponse.json({ orders });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Failed to fetch orders';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { buyerId, productId, quantity, total, totalUSD } = body;

    if (!buyerId || !productId || !total) {
      return NextResponse.json(
        { error: 'buyerId, productId, and total are required' },
        { status: 400 }
      );
    }

    // Verify product exists and is active
    const product = await db.product.findUnique({ where: { id: productId } });
    if (!product || product.status !== 'ACTIVE') {
      return NextResponse.json(
        { error: 'Product not available' },
        { status: 404 }
      );
    }

    const order = await db.order.create({
      data: {
        buyerId,
        productId,
        quantity: quantity || 1,
        total: parseFloat(total),
        totalUSD: totalUSD ? parseFloat(totalUSD) : null,
      },
      include: {
        buyer: {
          select: { id: true, name: true, email: true },
        },
        product: {
          select: { id: true, title: true, image: true, price: true },
        },
      },
    });

    // Update product status to SOLD
    await db.product.update({
      where: { id: productId },
      data: { status: 'SOLD' },
    });

    // Create notification for seller
    await db.notification.create({
      data: {
        userId: product.sellerId,
        title: 'New Order',
        message: `You have a new order for "${product.title}"`,
        type: 'ORDER',
      },
    });

    return NextResponse.json({ order }, { status: 201 });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Failed to create order';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
