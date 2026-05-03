import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    const user = await db.user.findUnique({ where: { id } });
    if (!user) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      );
    }

    if (user.role === 'ADMIN') {
      return NextResponse.json(
        { error: 'Cannot delete admin users' },
        { status: 403 }
      );
    }

    await db.$transaction(async (tx) => {
      // Soft delete user's products
      await tx.product.updateMany({
        where: { sellerId: id },
        data: { status: 'DELETED' },
      });

      // Delete user's orders
      await tx.order.deleteMany({
        where: { buyerId: id },
      });

      // Delete user's reviews
      await tx.review.deleteMany({
        where: { userId: id },
      });

      // Delete user's messages (sent)
      await tx.message.deleteMany({
        where: { senderId: id },
      });

      // Delete user's messages (received)
      await tx.message.updateMany({
        where: { receiverId: id },
        data: { receiverId: null },
      });

      // Delete user's wishlist
      await tx.wishlist.deleteMany({
        where: { userId: id },
      });

      // Delete user's notifications
      await tx.notification.deleteMany({
        where: { userId: id },
      });

      // Delete user's service orders
      await tx.serviceOrder.deleteMany({
        where: { buyerId: id },
      });

      // Delete user's services
      await tx.service.deleteMany({
        where: { sellerId: id },
      });

      // Finally delete the user
      await tx.user.delete({
        where: { id },
      });
    });

    return NextResponse.json({ message: 'User deleted successfully' });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Failed to delete user';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
