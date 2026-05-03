'use client';

import { useState } from 'react';
import { useStore, formatPrice } from '@/store';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import {
  ShoppingCart,
  Minus,
  Plus,
  Trash2,
  ShoppingBag,
  Truck,
  ArrowRight,
  Loader2,
  PackageOpen,
  ShieldCheck,
} from 'lucide-react';
import { toast } from 'sonner';

export function CartPage() {
  const {
    cart,
    removeFromCart,
    updateCartQuantity,
    clearCart,
    currency,
    navigate,
    user,
    openAuthModal,
  } = useStore();

  const [checkingOut, setCheckingOut] = useState(false);

  const displayPrice = (price: number) => {
    if (currency === 'USD') return price * 0.0036;
    return price;
  };

  const subtotal = cart.reduce(
    (sum, item) => sum + displayPrice(item.product.price) * item.quantity,
    0
  );
  const shipping = 0;
  const total = subtotal + shipping;

  const handleCheckout = async () => {
    if (!user) {
      openAuthModal('login');
      toast.error('Please sign in to checkout');
      return;
    }
    if (cart.length === 0) {
      toast.error('Your cart is empty');
      return;
    }

    setCheckingOut(true);
    let successCount = 0;
    let failCount = 0;

    for (const item of cart) {
      try {
        const itemTotal = displayPrice(item.product.price) * item.quantity;
        const res = await fetch('/api/orders', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            productId: item.product.id,
            quantity: item.quantity,
            total: itemTotal,
            totalUSD: currency === 'USD' ? itemTotal : itemTotal * 0.0036,
          }),
        });
        if (res.ok) {
          successCount++;
        } else {
          failCount++;
        }
      } catch {
        failCount++;
      }
    }

    if (successCount > 0) {
      clearCart();
      toast.success(`Order placed for ${successCount} item(s)! 🎉`, {
        description: failCount > 0
          ? `${failCount} item(s) failed. Please try again.`
          : 'Check your orders for details.',
      });
      navigate('orders');
    } else {
      toast.error('Failed to place orders. Please try again.');
    }
    setCheckingOut(false);
  };

  return (
    <div className="min-h-screen bg-[#06001a]">
      {/* Background */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-20 right-1/4 w-96 h-96 bg-[#8b5cf6]/8 rounded-full blur-[150px]" />
      </div>

      <div className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 py-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#a78bfa] to-[#7c3aed] flex items-center justify-center">
              <ShoppingCart className="w-5 h-5 text-white" />
            </div>
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold text-white">
                Shopping Cart
              </h1>
              <p className="text-sm text-[#a78bfa]/60">
                {cart.length} item{cart.length !== 1 ? 's' : ''} in your cart
              </p>
            </div>
          </div>
        </motion.div>

        {cart.length === 0 ? (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="flex flex-col items-center justify-center py-20"
          >
            <div className="w-24 h-24 rounded-full bg-white/[0.04] border border-purple-500/20 flex items-center justify-center mb-6">
              <PackageOpen className="w-12 h-12 text-[#a78bfa]/40" />
            </div>
            <h3 className="text-xl font-semibold text-white mb-2">
              Your cart is empty
            </h3>
            <p className="text-sm text-[#a78bfa]/50 mb-6 text-center max-w-md">
              Looks like you haven&apos;t added anything to your cart yet. Start shopping to fill it up!
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
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Cart Items */}
            <div className="lg:col-span-2 space-y-4">
              <AnimatePresence>
                {cart.map((item, i) => (
                  <motion.div
                    key={item.product.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, x: -100, transition: { duration: 0.2 } }}
                    transition={{ delay: i * 0.05 }}
                    className="bg-white/[0.04] border border-purple-500/20 rounded-2xl p-4 flex gap-4"
                  >
                    {/* Image */}
                    <div
                      className="w-20 h-20 sm:w-24 sm:h-24 rounded-xl overflow-hidden bg-white/[0.04] flex-shrink-0 cursor-pointer"
                      onClick={() =>
                        navigate('product-detail', item.product.id)
                      }
                    >
                      {item.product.image ? (
                        <img
                          src={item.product.image}
                          alt={item.product.title}
                          className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
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
                            className="text-sm font-semibold text-white line-clamp-2 cursor-pointer hover:text-[#c4b5fd] transition-colors"
                            onClick={() =>
                              navigate('product-detail', item.product.id)
                            }
                          >
                            {item.product.title}
                          </h3>
                          {item.product.seller && (
                            <p className="text-xs text-[#a78bfa]/50 mt-0.5">
                              by {item.product.seller.name}
                            </p>
                          )}
                        </div>
                        <button
                          onClick={() => removeFromCart(item.product.id)}
                          className="text-red-400/60 hover:text-red-400 transition-colors p-1 flex-shrink-0"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>

                      <div className="flex items-center justify-between mt-3">
                        {/* Quantity Controls */}
                        <div className="flex items-center gap-0 bg-white/[0.04] border border-purple-500/20 rounded-lg overflow-hidden">
                          <button
                            onClick={() =>
                              updateCartQuantity(
                                item.product.id,
                                item.quantity - 1
                              )
                            }
                            className="w-8 h-8 flex items-center justify-center text-[#c4b5fd] hover:bg-white/[0.06] transition-colors"
                          >
                            <Minus className="w-3 h-3" />
                          </button>
                          <span className="w-10 text-center text-white font-semibold text-xs">
                            {item.quantity}
                          </span>
                          <button
                            onClick={() =>
                              updateCartQuantity(
                                item.product.id,
                                item.quantity + 1
                              )
                            }
                            className="w-8 h-8 flex items-center justify-center text-[#c4b5fd] hover:bg-white/[0.06] transition-colors"
                          >
                            <Plus className="w-3 h-3" />
                          </button>
                        </div>

                        {/* Price */}
                        <p className="text-sm font-bold gradient-text">
                          {formatPrice(
                            displayPrice(item.product.price) * item.quantity,
                            currency
                          )}
                        </p>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>

            {/* Order Summary */}
            <div className="lg:col-span-1">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="bg-white/[0.04] border border-purple-500/20 rounded-2xl p-6 sticky top-24"
              >
                <h3 className="text-lg font-semibold text-white mb-5">
                  Order Summary
                </h3>

                <div className="space-y-3 mb-5">
                  <div className="flex justify-between text-sm">
                    <span className="text-[#a78bfa]/60">Subtotal</span>
                    <span className="text-white font-medium">
                      {formatPrice(subtotal, currency)}
                    </span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-[#a78bfa]/60">Shipping</span>
                    <span className="text-emerald-400 font-medium flex items-center gap-1">
                      <Truck className="w-3 h-3" /> FREE
                    </span>
                  </div>
                  <div className="border-t border-purple-500/15 pt-3 flex justify-between">
                    <span className="text-white font-semibold">Total</span>
                    <span className="text-lg font-bold gradient-text">
                      {formatPrice(total, currency)}
                    </span>
                  </div>
                </div>

                {/* Trust Badge */}
                <div className="flex items-center gap-2 bg-emerald-500/10 border border-emerald-500/20 rounded-xl p-3 mb-5">
                  <ShieldCheck className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                  <span className="text-xs text-emerald-400/80">
                    Secure checkout · 100% buyer protection
                  </span>
                </div>

                <Button
                  onClick={handleCheckout}
                  disabled={checkingOut}
                  size="lg"
                  className="w-full bg-gradient-to-r from-[#a78bfa] to-[#7c3aed] hover:from-[#8b5cf6] hover:to-[#6d28d9] text-white font-semibold shadow-[0_0_25px_rgba(139,92,246,0.35)] hover:shadow-[0_0_40px_rgba(139,92,246,0.5)] transition-all"
                >
                  {checkingOut ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Processing...
                    </>
                  ) : (
                    <>
                      Checkout
                      <ArrowRight className="w-4 h-4 ml-2" />
                    </>
                  )}
                </Button>
              </motion.div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
