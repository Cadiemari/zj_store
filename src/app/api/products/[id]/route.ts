import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    const product = await db.product.findUnique({
      where: { id },
      include: {
        seller: {
          select: { id: true, name: true, avatar: true, shopName: true, phone: true },
        },
        category: {
          select: { id: true, name: true, icon: true },
        },
        reviews: {
          include: {
            user: {
              select: { id: true, name: true, avatar: true },
            },
          },
          orderBy: { createdAt: 'desc' },
        },
        _count: {
          select: { reviews: true, wishlist: true },
        },
      },
    });

    if (!product) {
      return NextResponse.json(
        { error: 'Product not found' },
        { status: 404 }
      );
    }

    // Increment views
    await db.product.update({
      where: { id },
      data: { views: { increment: 1 } },
    });

    // Return with incremented view count
    const updatedProduct = {
      ...product,
      views: product.views + 1,
    };

    return NextResponse.json({ product: updatedProduct });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Failed to fetch product';
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

    const product = await db.product.findUnique({ where: { id } });
    if (!product) {
      return NextResponse.json(
        { error: 'Product not found' },
        { status: 404 }
      );
    }

    const { title, description, price, priceUSD, image, images, categoryId, condition, status } = body;

    const updatedProduct = await db.product.update({
      where: { id },
      data: {
        ...(title !== undefined && { title }),
        ...(description !== undefined && { description }),
        ...(price !== undefined && { price: parseFloat(price) }),
        ...(priceUSD !== undefined && { priceUSD: parseFloat(priceUSD) }),
        ...(image !== undefined && { image }),
        ...(images !== undefined && { images }),
        ...(categoryId !== undefined && { categoryId }),
        ...(condition !== undefined && { condition }),
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

    return NextResponse.json({ product: updatedProduct });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Failed to update product';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    const product = await db.product.findUnique({ where: { id } });
    if (!product) {
      return NextResponse.json(
        { error: 'Product not found' },
        { status: 404 }
      );
    }

    // Soft delete
    const deletedProduct = await db.product.update({
      where: { id },
      data: { status: 'DELETED' },
    });

    return NextResponse.json({
      message: 'Product deleted successfully',
      product: deletedProduct,
    });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Failed to delete product';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
