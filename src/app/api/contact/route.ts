import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { senderId, senderName, senderEmail, subject, content } = body;

    if (!senderName || !senderEmail || !subject || !content) {
      return NextResponse.json(
        { error: 'senderName, senderEmail, subject, and content are required' },
        { status: 400 }
      );
    }

    // Find an admin user to send the message to
    const admin = await db.user.findFirst({ where: { role: 'ADMIN' } });

    // Create a system user placeholder if senderId is null (non-logged-in user)
    // We need a valid senderId, so for non-logged-in users we store the contact
    // info in senderName and senderEmail fields
    // For non-logged-in users, senderId can be null - but the schema requires it
    // So we'll use the senderEmail as a reference, but we need to handle this
    // The Message model requires senderId, so for contact form we need a workaround

    // If senderId is provided (logged-in user), use it
    // If not, we'll create a temporary approach - use senderId from a system/guest account
    // or store in a way the schema allows
    let actualSenderId = senderId;

    if (!actualSenderId) {
      // For non-logged-in users, find or use an existing guest placeholder
      // We'll check if there's already a user with this email
      const existingUser = await db.user.findUnique({ where: { email: senderEmail } });
      if (existingUser) {
        actualSenderId = existingUser.id;
      } else {
        // Create a minimal guest user record
        const guestUser = await db.user.create({
          data: {
            email: senderEmail,
            name: senderName,
            password: await (await import('@/lib/auth')).hashPassword(
              Math.random().toString(36).slice(2) + Date.now().toString(36)
            ),
          },
        });
        actualSenderId = guestUser.id;
      }
    }

    const message = await db.message.create({
      data: {
        senderId: actualSenderId,
        receiverId: admin?.id || null,
        senderName,
        senderEmail,
        subject,
        content,
      },
      include: {
        sender: {
          select: { id: true, name: true, email: true, avatar: true },
        },
        receiver: {
          select: { id: true, name: true, email: true, avatar: true },
        },
      },
    });

    // Notify admin
    if (admin) {
      await db.notification.create({
        data: {
          userId: admin.id,
          title: 'New Contact Message',
          message: `${senderName} sent a message: "${subject}"`,
          type: 'MESSAGE',
        },
      });
    }

    return NextResponse.json(
      { message: 'Contact message sent successfully', data: message },
      { status: 201 }
    );
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : 'Failed to send contact message';
    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
}
