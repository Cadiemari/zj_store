import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { Prisma } from '@prisma/client';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const search = searchParams.get('search') || '';
    const categoryId = searchParams.get('categoryId');
    const sort = searchParams.get('sort') || 'newest';
    const condition = searchParams.get('condition');
    const minPrice = searchParams.get('minPrice');
    const maxPrice = searchParams.get('maxPrice');
    const sellerId = searchParams.get('sellerId');
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '20');

    const where: Prisma.ProductWhereInput = {
      status: 'ACTIVE',
    };

    if (search) {
      where.OR = [
        { title: { contains: search } },
        { description: { contains: search } },
      ];
    }

    if (categoryId) {
      where.categoryId = categoryId;
    }

    if (condition) {
      where.condition = condition;
    }

    if (minPrice || maxPrice) {
      where.price = {
        ...(minPrice ? { gte: parseFloat(minPrice) } : {}),
        ...(maxPrice ? { lte: parseFloat(maxPrice) } : {}),
      };
    }

    if (sellerId) {
      where.sellerId = sellerId;
    }

    let orderBy: Prisma.ProductOrderByWithRelationInput;
    switch (sort) {
      case 'price_asc':
        orderBy = { price: 'asc' };
        break;
      case 'price_desc':
        orderBy = { price: 'desc' };
        break;
      case 'views':
        orderBy = { views: 'desc' };
        break;
      case 'oldest':
        orderBy = { createdAt: 'asc' };
        break;
      default:
        orderBy = { createdAt: 'desc' };
    }

    const [products, total] = await Promise.all([
      db.product.findMany({
        where,
        include: {
          seller: {
            select: { id: true, name: true, avatar: true, shopName: true },
          },
          category: {
            select: { id: true, name: true, icon: true },
          },
          _count: {
            select: { reviews: true, wishlist: true },
          },
        },
        orderBy,
        skip: (page - 1) * limit,
        take: limit,
      }),
      db.product.count({ where }),
    ]);

    return NextResponse.json({
      products,
      total,
      page,
      totalPages: Math.ceil(total / limit),
    });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Failed to fetch products';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { title, description, price, image, images, categoryId, condition, sellerId } = body;

    if (!title || !description || price === undefined || !sellerId) {
      return NextResponse.json(
        { error: 'Title, description, price, and sellerId are required' },
        { status: 400 }
      );
    }

    const product = await db.product.create({
      data: {
        title,
        description,
        price: parseFloat(price),
        image: image || null,
        images: images || '[]',
        categoryId: categoryId || null,
        condition: condition || 'NEW',
        sellerId,
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

    return NextResponse.json({ product }, { status: 201 });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Failed to create product';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
