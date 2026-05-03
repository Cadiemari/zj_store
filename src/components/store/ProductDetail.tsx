'use client';

import { useState, useEffect } from 'react';
import { useStore, formatPrice, type Product } from '@/store';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { Input } from '@/components/ui/input';
import {
  ArrowLeft,
  Eye,
  ShoppingBag,
  Heart,
  ShoppingCart,
  ShieldCheck,
  Truck,
  RefreshCw,
  Minus,
  Plus,
  Star,
  Zap,
} from 'lucide-react';
import { toast } from 'sonner';

export function ProductDetail() {
  const {
    selectedProductId,
    navigate,
    currency,
    user,
    addToCart,
    removeFromCart,
    wishlist,
    toggleWishlist,
    openAuthModal,
    clearCart,
  } = useStore();

  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);
  const [buying, setBuying] = useState(false);

  useEffect(() => {
    if (!selectedProductId) {
      navigate('products');
      return;
    }
    setLoading(true);
    setQuantity(1);
    fetch(`/api/products/${selectedProductId}`)
      .then((res) => res.json())
      .then((data) => {
        setProduct(data);
      })
      .catch(() => {
        toast.error('Failed to load product');
        navigate('products');
      })
      .finally(() => setLoading(false));
  }, [selectedProductId, navigate]);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#06001a]">
        <div className="relative z-10 max-w-6xl mx-auto px-4 sm:px-6 py-8">
          <Skeleton className="h-8 w-24 bg-white/[0.06] rounded mb-8" />
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
            <Skeleton className="aspect-square w-full rounded-2xl bg-white/[0.04]" />
            <div className="space-y-4">
              <Skeleton className="h-8 w-3/4 bg-white/[0.06] rounded" />
              <Skeleton className="h-6 w-1/4 bg-white/[0.06] rounded" />
              <Skeleton className="h-20 w-full bg-white/[0.06] rounded" />
              <Skeleton className="h-10 w-40 bg-white/[0.06] rounded" />
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!product) return null;

  const isWishlisted = wishlist.includes(product.id);
  const displayPrice =
    currency === 'USD' && product.priceUSD ? product.priceUSD : product.price;

  const conditionColors: Record<string, string> = {
    NEW: 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30',
    LIKE_NEW: 'bg-blue-500/20 text-blue-400 border-blue-500/30',
    GOOD: 'bg-amber-500/20 text-amber-400 border-amber-500/30',
    FAIR: 'bg-orange-500/20 text-orange-400 border-orange-500/30',
    POOR: 'bg-red-500/20 text-red-400 border-red-500/30',
  };

  const handleBuyNow = async () => {
    if (!user) {
      openAuthModal('login');
      toast.error('Please sign in to purchase');
      return;
    }
    setBuying(true);
    try {
      const total = displayPrice * quantity;
      const res = await fetch('/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          productId: product.id,
          quantity,
          total,
          totalUSD: currency === 'USD' ? total : total * 0.0036,
        }),
      });
      if (res.ok) {
        removeFromCart(product.id);
        toast.success('Order placed successfully!', {
          description: `${product.title} x${quantity}`,
        });
        navigate('orders');
      } else {
        const data = await res.json();
        toast.error(data.error || 'Failed to place order');
      }
    } catch {
      toast.error('Something went wrong');
    } finally {
      setBuying(false);
    }
  };

  const handleAddToCart = () => {
    if (!user) {
      openAuthModal('login');
      toast.error('Please sign in to add to cart');
      return;
    }
    addToCart(product, quantity);
    toast.success(`${product.title} added to cart`);
  };

  const handleToggleWishlist = () => {
    if (!user) {
      openAuthModal('login');
      toast.error('Please sign in to add to wishlist');
      return;
    }
    toggleWishlist(product.id);
    toast.success(isWishlisted ? 'Removed from wishlist' : 'Added to wishlist');
  };

  return (
    <div className="min-h-screen bg-[#06001a]">
      {/* Background Effects */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-20 left-1/4 w-96 h-96 bg-[#8b5cf6]/10 rounded-full blur-[150px]" />
        <div className="absolute bottom-20 right-1/4 w-80 h-80 bg-[#7c3aed]/8 rounded-full blur-[130px]" />
      </div>

      <div className="relative z-10 max-w-6xl mx-auto px-4 sm:px-6 py-8">
        {/* Back Button */}
        <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}>
          <Button
            variant="ghost"
            onClick={() => navigate('products')}
            className="text-[#c4b5fd] hover:text-white hover:bg-white/[0.04] mb-6"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Products
          </Button>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
          {/* Product Image */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1 }}
          >
            <div className="relative aspect-square rounded-2xl overflow-hidden bg-white/[0.04] border border-purple-500/20 group">
              {product.image ? (
                <img
                  src={product.image}
                  alt={product.title}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-purple-500/10 to-purple-900/10">
                  <span className="text-6xl">📦</span>
                </div>
              )}

              {/* Badges overlay */}
              <div className="absolute top-4 left-4 flex flex-col gap-2">
                {product.condition && (
                  <Badge
                    className={`text-xs font-semibold border ${
                      conditionColors[product.condition] ||
                      'bg-purple-500/20 text-purple-400 border-purple-500/30'
                    }`}
                  >
                    {product.condition}
                  </Badge>
                )}
                <Badge className="bg-white/10 text-white text-xs backdrop-blur-sm border border-white/10 gap-1">
                  <Eye className="w-3 h-3" /> {product.views} views
                </Badge>
                {product._count?.orders && product._count.orders > 0 && (
                  <Badge className="bg-white/10 text-white text-xs backdrop-blur-sm border border-white/10 gap-1">
                    <ShoppingBag className="w-3 h-3" /> {product._count.orders} sold
                  </Badge>
                )}
              </div>

              {/* Wishlist button */}
              <button
                onClick={handleToggleWishlist}
                className="absolute top-4 right-4 w-10 h-10 rounded-full bg-black/40 backdrop-blur-sm flex items-center justify-center hover:bg-black/60 transition-colors"
              >
                <Heart
                  className={`w-5 h-5 ${isWishlisted ? 'fill-red-500 text-red-500' : 'text-white'}`}
                />
              </button>
            </div>
          </motion.div>

          {/* Product Info */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            className="space-y-6"
          >
            {/* Category */}
            {product.category && (
              <p className="text-xs font-medium text-[#a78bfa]/60 uppercase tracking-wider">
                {product.category.name}
              </p>
            )}

            {/* Title */}
            <h1 className="text-2xl sm:text-3xl font-bold text-white leading-tight">
              {product.title}
            </h1>

            {/* Price */}
            <div className="flex items-baseline gap-3">
              <span className="text-3xl font-bold gradient-text">
                {formatPrice(displayPrice, currency)}
              </span>
            </div>

            {/* Description */}
            <div className="bg-white/[0.04] border border-purple-500/20 rounded-xl p-4">
              <p className="text-sm text-[#c4b5fd] leading-relaxed whitespace-pre-line">
                {product.description}
              </p>
            </div>

            {/* Seller Card */}
            {product.seller && (
              <div className="flex items-center gap-3 bg-white/[0.04] border border-purple-500/20 rounded-xl p-4">
                <div className="w-11 h-11 rounded-full bg-gradient-to-br from-[#a78bfa] to-[#7c3aed] flex items-center justify-center text-white font-bold text-sm">
                  {product.seller.name?.charAt(0).toUpperCase()}
                </div>
                <div>
                  <p className="text-sm font-semibold text-white">
                    {product.seller.name}
                  </p>
                  <p className="text-xs text-[#a78bfa]/50 flex items-center gap-1">
                    <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
                    Trusted Seller
                  </p>
                </div>
              </div>
            )}

            {/* Quantity Selector */}
            <div className="flex items-center gap-4">
              <span className="text-sm text-[#c4b5fd]">Quantity:</span>
              <div className="flex items-center gap-0 bg-white/[0.04] border border-purple-500/20 rounded-xl overflow-hidden">
                <button
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="w-10 h-10 flex items-center justify-center text-[#c4b5fd] hover:bg-white/[0.06] transition-colors"
                >
                  <Minus className="w-4 h-4" />
                </button>
                <span className="w-12 text-center text-white font-semibold text-sm">
                  {quantity}
                </span>
                <button
                  onClick={() => setQuantity(quantity + 1)}
                  className="w-10 h-10 flex items-center justify-center text-[#c4b5fd] hover:bg-white/[0.06] transition-colors"
                >
                  <Plus className="w-4 h-4" />
                </button>
              </div>
              <span className="text-xs text-[#a78bfa]/40">
                Total: {formatPrice(displayPrice * quantity, currency)}
              </span>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-3 pt-2">
              <Button
                onClick={handleBuyNow}
                disabled={buying}
                size="lg"
                className="flex-1 bg-gradient-to-r from-[#a78bfa] to-[#7c3aed] hover:from-[#8b5cf6] hover:to-[#6d28d9] text-white font-semibold shadow-[0_0_25px_rgba(139,92,246,0.35)] hover:shadow-[0_0_40px_rgba(139,92,246,0.5)] transition-all"
              >
                <Zap className="w-4 h-4 mr-2" />
                {buying ? 'Processing...' : 'Buy Now'}
              </Button>
              <Button
                onClick={handleAddToCart}
                size="lg"
                variant="outline"
                className="flex-1 border-purple-500/30 text-white hover:bg-purple-500/10 hover:border-purple-500/50 font-semibold transition-all"
              >
                <ShoppingCart className="w-4 h-4 mr-2" />
                Add to Cart
              </Button>
            </div>

            {/* Trust Badges */}
            <div className="grid grid-cols-3 gap-3 pt-4">
              {[
                { icon: ShieldCheck, label: 'Secure Payment' },
                { icon: Truck, label: 'Fast Delivery' },
                { icon: RefreshCw, label: 'Easy Returns' },
              ].map((badge) => (
                <div
                  key={badge.label}
                  className="flex flex-col items-center gap-1.5 bg-white/[0.04] border border-purple-500/20 rounded-xl p-3"
                >
                  <badge.icon className="w-5 h-5 text-[#a78bfa]" />
                  <span className="text-[10px] text-[#a78bfa]/60 text-center font-medium">
                    {badge.label}
                  </span>
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
