import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    const message = await db.message.findUnique({ where: { id } });

    if (!message) {
      return NextResponse.json(
        { error: 'Message not found' },
        { status: 404 }
      );
    }

    const updatedMessage = await db.message.update({
      where: { id },
      data: { isRead: true },
    });

    return NextResponse.json({ message: updatedMessage });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Failed to mark message as read';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
