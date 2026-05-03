import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId');

    if (!userId) {
      return NextResponse.json(
        { error: 'userId query parameter is required' },
        { status: 400 }
      );
    }

    const wishlistItems = await db.wishlist.findMany({
      where: { userId },
      include: {
        product: {
          include: {
            seller: {
              select: { id: true, name: true, avatar: true, shopName: true },
            },
            category: {
              select: { id: true, name: true, icon: true },
            },
            _count: {
              select: { reviews: true },
            },
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    });

    return NextResponse.json({ wishlist: wishlistItems });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Failed to fetch wishlist';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { userId, productId } = body;

    if (!userId || !productId) {
      return NextResponse.json(
        { error: 'userId and productId are required' },
        { status: 400 }
      );
    }

    // Check if already in wishlist
    const existing = await db.wishlist.findUnique({
      where: {
        userId_productId: { userId, productId },
      },
    });

    if (existing) {
      // Remove from wishlist
      await db.wishlist.delete({
        where: { id: existing.id },
      });

      return NextResponse.json({ message: 'Removed from wishlist', inWishlist: false });
    }

    // Add to wishlist
    const wishlistItem = await db.wishlist.create({
      data: { userId, productId },
      include: {
        product: {
          include: {
            seller: {
              select: { id: true, name: true, avatar: true, shopName: true },
            },
            category: {
              select: { id: true, name: true, icon: true },
            },
          },
        },
      },
    });

    return NextResponse.json({ wishlistItem, inWishlist: true }, { status: 201 });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Failed to update wishlist';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
