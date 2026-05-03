import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';

export async function GET(request: NextRequest) {
  try {
    const users = await db.user.findMany({
      include: {
        _count: {
          select: {
            products: true,
            services: true,
            orders: true,
            reviews: true,
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    });

    const usersWithoutPassword = users.map(({ password: _, ...user }) => user);

    return NextResponse.json({ users: usersWithoutPassword });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Failed to fetch users';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
