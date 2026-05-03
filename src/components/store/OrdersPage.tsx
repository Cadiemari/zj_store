'use client';

import { useState, useEffect, useCallback } from 'react';
import { useStore, formatPrice, type OrderItem } from '@/store';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { Package, Calendar, ShoppingBag, X, Loader2 } from 'lucide-react';
import { toast } from 'sonner';

const STATUS_STYLES: Record<string, { bg: string; text: string; label: string }> = {
  PENDING: { bg: 'bg-yellow-500/15', text: 'text-yellow-400', label: 'Pending' },
  PROCESSING: { bg: 'bg-blue-500/15', text: 'text-blue-400', label: 'Processing' },
  OUT_FOR_DELIVERY: { bg: 'bg-purple-500/15', text: 'text-purple-400', label: 'Out for Delivery' },
  DELIVERED: { bg: 'bg-emerald-500/15', text: 'text-emerald-400', label: 'Delivered' },
  CANCELLED: { bg: 'bg-red-500/15', text: 'text-red-400', label: 'Cancelled' },
};

function formatDate(dateStr: string): string {
  const date = new Date(dateStr);
  return date.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  }) + ' at ' + date.toLocaleTimeString('en-US', {
    hour: 'numeric',
    minute: '2-digit',
    hour12: true,
  });
}

export function OrdersPage() {
  const { user, navigate, currency, openAuthModal } = useStore();
  const [orders, setOrders] = useState<OrderItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [cancelling, setCancelling] = useState<string | null>(null);

  const fetchOrders = useCallback(async () => {
    if (!user) return;
    setLoading(true);
    try {
      const res = await fetch(`/api/orders?userId=${user.id}`);
      if (res.ok) {
        const data = await res.json();
        setOrders(Array.isArray(data) ? data : []);
      }
    } catch {
      setOrders([]);
    } finally {
      setLoading(false);
    }
  }, [user]);

  useEffect(() => {
    if (!user) {
      openAuthModal('login');
      navigate('home');
      return;
    }
    fetchOrders();
  }, [user, navigate, openAuthModal, fetchOrders]);

  const canCancel = (order: OrderItem) => {
    if (order.status !== 'PENDING') return false;
    return Date.now() - new Date(order.createdAt).getTime() < 3600000;
  };

  const handleCancel = async (order: OrderItem) => {
    setCancelling(order.id);
    try {
      const res = await fetch(`/api/orders/${order.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: 'CANCELLED' }),
      });
      if (res.ok) {
        toast.success('Order cancelled');
        fetchOrders();
      } else {
        toast.error('Failed to cancel order');
      }
    } catch {
      toast.error('Something went wrong');
    } finally {
      setCancelling(null);
    }
  };

  if (!user) return null;

  return (
    <div className="min-h-screen bg-[#06001a]">
      {/* Background */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-20 left-1/4 w-96 h-96 bg-[#8b5cf6]/8 rounded-full blur-[150px]" />
      </div>

      <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 py-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#a78bfa] to-[#7c3aed] flex items-center justify-center">
              <Package className="w-5 h-5 text-white" />
            </div>
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold text-white">
                My Orders
              </h1>
              <p className="text-sm text-[#a78bfa]/60">
                Track and manage your orders
              </p>
            </div>
          </div>
        </motion.div>

        {/* Orders */}
        {loading ? (
          <div className="space-y-4">
            {Array.from({ length: 4 }).map((_, i) => (
              <div
                key={i}
                className="bg-white/[0.04] border border-purple-500/20 rounded-2xl p-5"
              >
                <div className="flex gap-4">
                  <Skeleton className="w-20 h-20 rounded-xl bg-white/[0.06] flex-shrink-0" />
                  <div className="flex-1 space-y-2">
                    <Skeleton className="h-4 w-3/4 bg-white/[0.06] rounded" />
                    <Skeleton className="h-3 w-1/2 bg-white/[0.06] rounded" />
                    <Skeleton className="h-3 w-1/3 bg-white/[0.06] rounded" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : orders.length === 0 ? (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="flex flex-col items-center justify-center py-20"
          >
            <div className="w-24 h-24 rounded-full bg-white/[0.04] border border-purple-500/20 flex items-center justify-center mb-6">
              <ShoppingBag className="w-12 h-12 text-[#a78bfa]/40" />
            </div>
            <h3 className="text-xl font-semibold text-white mb-2">
              No orders yet
            </h3>
            <p className="text-sm text-[#a78bfa]/50 mb-6 text-center max-w-md">
              You haven&apos;t placed any orders yet. Start shopping to see your orders here!
            </p>
            <Button
              onClick={() => navigate('products')}
              className="bg-gradient-to-r from-[#a78bfa] to-[#7c3aed] hover:from-[#8b5cf6] hover:to-[#6d28d9] text-white font-semibold"
            >
              <ShoppingBag className="w-4 h-4 mr-2" />
              Browse Products
            </Button>
          </motion.div>
        ) : (
          <div className="space-y-4">
            {orders.map((order, i) => {
              const status = STATUS_STYLES[order.status] || STATUS_STYLES.PENDING;
              const displayTotal =
                currency === 'USD' && order.totalUSD
                  ? order.totalUSD
                  : order.total;

              return (
                <motion.div
                  key={order.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.05 }}
                  className="bg-white/[0.04] border border-purple-500/20 rounded-2xl p-5 hover:border-purple-500/30 transition-colors"
                >
                  <div className="flex gap-4">
                    {/* Product Image */}
                    <div
                      className="w-20 h-20 rounded-xl overflow-hidden bg-white/[0.04] flex-shrink-0"
                      onClick={() =>
                        order.product &&
                        navigate('product-detail', order.productId)
                      }
                    >
                      {order.product?.image ? (
                        <img
                          src={order.product.image}
                          alt={order.product?.title}
                          className="w-full h-full object-cover cursor-pointer hover:scale-105 transition-transform duration-300"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-purple-500/10 to-purple-900/10">
                          <span className="text-2xl">📦</span>
                        </div>
                      )}
                    </div>

                    {/* Details */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-2">
                        <div className="min-w-0">
                          <h3
                            className="text-sm font-semibold text-white truncate cursor-pointer hover:text-[#c4b5fd] transition-colors"
                            onClick={() =>
                              navigate('product-detail', order.productId)
                            }
                          >
                            {order.product?.title || 'Product'}
                          </h3>
                          <p className="text-xs text-[#a78bfa]/50 mt-0.5">
                            Qty: {order.quantity}
                          </p>
                        </div>
                        <Badge
                          className={`${status.bg} ${status.text} text-[10px] font-semibold border-0 flex-shrink-0`}
                        >
                          {status.label}
                        </Badge>
                      </div>

                      <div className="flex items-center justify-between mt-3">
                        <div className="flex items-center gap-1.5 text-xs text-[#a78bfa]/40">
                          <Calendar className="w-3 h-3" />
                          {formatDate(order.createdAt)}
                        </div>
                        <p className="text-sm font-bold gradient-text">
                          {formatPrice(displayTotal, currency)}
                        </p>
                      </div>

                      {/* Cancel Button */}
                      {canCancel(order) && (
                        <div className="mt-3 flex items-center justify-between">
                          <span className="text-[10px] text-amber-400/60">
                            Cancel within 1 hour of ordering
                          </span>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleCancel(order)}
                            disabled={cancelling === order.id}
                            className="text-red-400 hover:text-red-300 hover:bg-red-500/10 text-xs h-7 px-3"
                          >
                            {cancelling === order.id ? (
                              <Loader2 className="w-3 h-3 mr-1 animate-spin" />
                            ) : (
                              <X className="w-3 h-3 mr-1" />
                            )}
                            Cancel Order
                          </Button>
                        </div>
                      )}
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
