import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId');

    let where: Record<string, unknown> = {};

    if (userId) {
      where = {
        OR: [
          { senderId: userId },
          { receiverId: userId },
        ],
      };
    }

    const messages = await db.message.findMany({
      where,
      include: {
        sender: {
          select: { id: true, name: true, email: true, avatar: true },
        },
        receiver: {
          select: { id: true, name: true, email: true, avatar: true },
        },
        replies: {
          include: {
            sender: {
              select: { id: true, name: true, email: true, avatar: true },
            },
            receiver: {
              select: { id: true, name: true, email: true, avatar: true },
            },
          },
          orderBy: { createdAt: 'asc' },
        },
      },
      orderBy: { createdAt: 'desc' },
    });

    return NextResponse.json({ messages });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Failed to fetch messages';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { senderId, receiverId, senderName, senderEmail, subject, content, parentId } = body;

    if (!senderId || !subject || !content) {
      return NextResponse.json(
        { error: 'senderId, subject, and content are required' },
        { status: 400 }
      );
    }

    const message = await db.message.create({
      data: {
        senderId,
        receiverId: receiverId || null,
        senderName: senderName || '',
        senderEmail: senderEmail || '',
        subject,
        content,
        parentId: parentId || null,
      },
      include: {
        sender: {
          select: { id: true, name: true, email: true, avatar: true },
        },
        receiver: {
          select: { id: true, name: true, email: true, avatar: true },
        },
        replies: true,
      },
    });

    // Create notification for receiver if set
    if (receiverId) {
      await db.notification.create({
        data: {
          userId: receiverId,
          title: 'New Message',
          message: `You have a new message: "${subject}"`,
          type: 'MESSAGE',
        },
      });
    }

    return NextResponse.json({ message }, { status: 201 });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Failed to create message';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
