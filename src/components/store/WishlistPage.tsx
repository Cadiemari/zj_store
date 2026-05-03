'use client';

import { useState, useEffect, useCallback } from 'react';
import { useStore, type Product } from '@/store';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { Heart, ShoppingBag, Trash2, PackageOpen } from 'lucide-react';
import { ProductCard } from './ProductCard';
import { toast } from 'sonner';

export function WishlistPage() {
  const { user, wishlist, setWishlist, navigate, openAuthModal } = useStore();
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchWishlist = useCallback(async () => {
    if (!user) return;
    setLoading(true);
    try {
      const res = await fetch(`/api/wishlist?userId=${user.id}`);
      if (res.ok) {
        const data = await res.json();
        if (Array.isArray(data) && data.length > 0) {
          setProducts(data);
          const ids = data.map((p: Product) => p.id);
          setWishlist(ids);
        } else {
          // Fallback: fetch products from store wishlist IDs
          if (wishlist.length > 0) {
            const promises = wishlist.map((id) =>
              fetch(`/api/products/${id}`).then((r) => (r.ok ? r.json() : null))
            );
            const results = await Promise.all(promises);
            setProducts(results.filter(Boolean));
          } else {
            setProducts([]);
          }
        }
      } else if (wishlist.length > 0) {
        // Fallback
        const promises = wishlist.map((id) =>
          fetch(`/api/products/${id}`).then((r) => (r.ok ? r.json() : null))
        );
        const results = await Promise.all(promises);
        setProducts(results.filter(Boolean));
      }
    } catch {
      if (wishlist.length > 0) {
        const promises = wishlist.map((id) =>
          fetch(`/api/products/${id}`).then((r) => (r.ok ? r.json() : null))
        );
        const results = await Promise.all(promises);
        setProducts(results.filter(Boolean));
      } else {
        setProducts([]);
      }
    } finally {
      setLoading(false);
    }
  }, [user, wishlist, setWishlist]);

  useEffect(() => {
    if (!user) {
      openAuthModal('login');
      navigate('home');
      return;
    }
    fetchWishlist();
  }, [user, navigate, openAuthModal, fetchWishlist]);

  if (!user) return null;

  return (
    <div className="min-h-screen bg-[#06001a]">
      {/* Background */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-20 left-1/4 w-96 h-96 bg-[#8b5cf6]/10 rounded-full blur-[150px]" />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 py-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-red-500/20 to-pink-600/20 flex items-center justify-center">
              <Heart className="w-5 h-5 text-red-400" />
            </div>
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold text-white">
                My Wishlist
              </h1>
              <p className="text-sm text-[#a78bfa]/60">
                {products.length} item{products.length !== 1 ? 's' : ''} saved
              </p>
            </div>
          </div>
        </motion.div>

        {/* Content */}
        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
            {Array.from({ length: 4 }).map((_, i) => (
              <div
                key={i}
                className="bg-white/[0.04] border border-purple-500/20 rounded-2xl overflow-hidden"
              >
                <Skeleton className="aspect-square w-full bg-white/[0.06]" />
                <div className="p-4 space-y-3">
                  <Skeleton className="h-3 w-16 bg-white/[0.06] rounded" />
                  <Skeleton className="h-4 w-full bg-white/[0.06] rounded" />
                  <Skeleton className="h-4 w-2/3 bg-white/[0.06] rounded" />
                  <div className="flex justify-between pt-2">
                    <Skeleton className="h-5 w-24 bg-white/[0.06] rounded" />
                    <Skeleton className="h-4 w-10 bg-white/[0.06] rounded" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : products.length === 0 ? (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="flex flex-col items-center justify-center py-20"
          >
            <div className="w-24 h-24 rounded-full bg-white/[0.04] border border-purple-500/20 flex items-center justify-center mb-6">
              <Heart className="w-12 h-12 text-[#a78bfa]/40" />
            </div>
            <h3 className="text-xl font-semibold text-white mb-2">
              Your wishlist is empty
            </h3>
            <p className="text-sm text-[#a78bfa]/50 mb-6 text-center max-w-md">
              Save items you love by tapping the heart icon on any product. They&apos;ll appear here so you can easily find them later.
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
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5"
          >
            <AnimatePresence>
              {products.map((product, i) => (
                <motion.div
                  key={product.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.9, transition: { duration: 0.2 } }}
                  transition={{ delay: i * 0.05, duration: 0.3 }}
                  className="relative"
                >
                  <ProductCard product={product} />
                  {/* Remove button overlay */}
                  <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={(e) => {
                      e.stopPropagation();
                      setWishlist(wishlist.filter((id) => id !== product.id));
                      setProducts((prev) =>
                        prev.filter((p) => p.id !== product.id)
                      );
                      toast.success('Removed from wishlist');
                    }}
                    className="absolute top-3 right-3 z-20 w-9 h-9 rounded-full bg-red-500/20 backdrop-blur-sm flex items-center justify-center hover:bg-red-500/40 transition-colors group"
                    title="Remove from wishlist"
                  >
                    <Trash2 className="w-4 h-4 text-red-400" />
                  </motion.button>
                </motion.div>
              ))}
            </AnimatePresence>
          </motion.div>
        )}
      </div>
    </div>
  );
}
