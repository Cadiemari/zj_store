import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { Prisma } from '@prisma/client';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const search = searchParams.get('search') || '';
    const categoryId = searchParams.get('categoryId');
    const serviceType = searchParams.get('serviceType');
    const connectionType = searchParams.get('connectionType');
    const provider = searchParams.get('provider');
    const sellerId = searchParams.get('sellerId');
    const sort = searchParams.get('sort') || 'newest';
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '20');

    const where: Prisma.ServiceWhereInput = {
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

    if (serviceType) {
      where.serviceType = serviceType;
    }

    if (connectionType) {
      where.connectionType = connectionType;
    }

    if (provider) {
      where.provider = provider;
    }

    if (sellerId) {
      where.sellerId = sellerId;
    }

    let orderBy: Prisma.ServiceOrderByWithRelationInput;
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

    const [services, total] = await Promise.all([
      db.service.findMany({
        where,
        include: {
          seller: {
            select: { id: true, name: true, avatar: true, shopName: true },
          },
          category: {
            select: { id: true, name: true, icon: true },
          },
          _count: {
            select: { orders: true },
          },
        },
        orderBy,
        skip: (page - 1) * limit,
        take: limit,
      }),
      db.service.count({ where }),
    ]);

    return NextResponse.json({
      services,
      total,
      page,
      totalPages: Math.ceil(total / limit),
    });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Failed to fetch services';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const {
      title,
      description,
      price,
      image,
      categoryId,
      serviceType,
      speed,
      connectionType,
      provider,
      contact,
      sellerId,
    } = body;

    if (!title || !description || price === undefined || !sellerId) {
      return NextResponse.json(
        { error: 'Title, description, price, and sellerId are required' },
        { status: 400 }
      );
    }

    const service = await db.service.create({
      data: {
        title,
        description,
        price: parseFloat(price),
        priceUSD: body.priceUSD ? parseFloat(body.priceUSD) : null,
        image: image || null,
        categoryId: categoryId || null,
        serviceType: serviceType || 'GENERAL',
        speed: speed || null,
        connectionType: connectionType || null,
        provider: provider || null,
        contact: contact || null,
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

    return NextResponse.json({ service }, { status: 201 });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Failed to create service';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
