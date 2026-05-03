'use client';

import { useState, useRef } from 'react';
import { useStore, formatPrice, type Product } from '@/store';
import { motion } from 'framer-motion';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Heart, ShoppingCart, Eye } from 'lucide-react';
import { toast } from 'sonner';

interface ProductCardProps {
  product: Product;
}

export function ProductCard({ product }: ProductCardProps) {
  const { wishlist, toggleWishlist, addToCart, currency, navigate, openAuthModal, user } = useStore();
  const cardRef = useRef<HTMLDivElement>(null);
  const [rotateX, setRotateX] = useState(0);
  const [rotateY, setRotateY] = useState(0);
  const [isHovering, setIsHovering] = useState(false);

  const isWishlisted = wishlist.includes(product.id);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;
    const rotateXVal = ((y - centerY) / centerY) * -8;
    const rotateYVal = ((x - centerX) / centerX) * 8;
    setRotateX(rotateXVal);
    setRotateY(rotateYVal);
  };

  const handleMouseLeave = () => {
    setRotateX(0);
    setRotateY(0);
    setIsHovering(false);
  };

  const handleAddToCart = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!user) {
      openAuthModal('login');
      toast.error('Please sign in to add items to cart');
      return;
    }
    addToCart(product);
    toast.success(`${product.title} added to cart`, {
      description: formatPrice(product.price, currency),
    });
  };

  const handleToggleWishlist = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!user) {
      openAuthModal('login');
      toast.error('Please sign in to add to wishlist');
      return;
    }
    toggleWishlist(product.id);
    toast.success(isWishlisted ? 'Removed from wishlist' : 'Added to wishlist');
  };

  const handleCardClick = () => {
    navigate('product-detail', product.id);
  };

  const conditionColors: Record<string, string> = {
    NEW: 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30',
    LIKE_NEW: 'bg-blue-500/20 text-blue-400 border-blue-500/30',
    GOOD: 'bg-amber-500/20 text-amber-400 border-amber-500/30',
    FAIR: 'bg-orange-500/20 text-orange-400 border-orange-500/30',
    POOR: 'bg-red-500/20 text-red-400 border-red-500/30',
  };

  const displayPrice = currency === 'USD' && product.priceUSD ? product.priceUSD : product.price;

  return (
    <div
      ref={cardRef}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setIsHovering(true)}
      onMouseLeave={handleMouseLeave}
      onClick={handleCardClick}
      className="group cursor-pointer"
      style={{ perspective: '1000px' }}
    >
      <motion.div
        animate={{
          rotateX,
          rotateY,
        }}
        transition={{ type: 'spring', stiffness: 300, damping: 30 }}
        className="relative bg-white/[0.04] border border-purple-500/20 rounded-2xl overflow-hidden hover:border-purple-500/40 hover:shadow-[0_0_30px_rgba(167,139,250,0.15)] transition-all duration-300"
        style={{ transformStyle: 'preserve-3d' }}
      >
        {/* Image Container */}
        <div className="relative aspect-square overflow-hidden bg-white/[0.02]">
          {product.image ? (
            <motion.img
              src={product.image}
              alt={product.title}
              className="w-full h-full object-cover"
              animate={{ scale: isHovering ? 1.1 : 1 }}
              transition={{ duration: 0.4, ease: 'easeOut' }}
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-purple-500/10 to-purple-900/10">
              <span className="text-4xl">📦</span>
            </div>
          )}

          {/* Condition Badge */}
          {product.condition && (
            <Badge
              className={`absolute top-3 left-3 text-[10px] font-semibold border ${
                conditionColors[product.condition] || 'bg-purple-500/20 text-purple-400 border-purple-500/30'
              }`}
            >
              {product.condition}
            </Badge>
          )}

          {/* Wishlist Heart */}
          <motion.button
            whileTap={{ scale: 0.85 }}
            onClick={handleToggleWishlist}
            className="absolute top-3 right-3 w-9 h-9 rounded-full bg-black/40 backdrop-blur-sm flex items-center justify-center hover:bg-black/60 transition-colors"
          >
            <Heart
              className={`w-4 h-4 transition-colors ${
                isWishlisted ? 'fill-red-500 text-red-500' : 'text-white'
              }`}
            />
          </motion.button>

          {/* Quick Add to Cart - appears on hover */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: isHovering ? 1 : 0, y: isHovering ? 0 : 10 }}
            transition={{ duration: 0.2 }}
            className="absolute bottom-3 left-3 right-3"
          >
            <Button
              onClick={handleAddToCart}
              size="sm"
              className="w-full bg-gradient-to-r from-[#a78bfa] to-[#7c3aed] hover:from-[#8b5cf6] hover:to-[#6d28d9] text-white text-xs font-semibold shadow-[0_0_20px_rgba(139,92,246,0.35)]"
            >
              <ShoppingCart className="w-3.5 h-3.5 mr-1.5" />
              Add to Cart
            </Button>
          </motion.div>
        </div>

        {/* Content */}
        <div className="p-4 space-y-2">
          {/* Category */}
          {product.category && (
            <p className="text-[10px] font-medium text-[#a78bfa]/60 uppercase tracking-wider">
              {product.category.name}
            </p>
          )}

          {/* Title */}
          <h3 className="text-sm font-semibold text-white line-clamp-2 group-hover:text-[#c4b5fd] transition-colors">
            {product.title}
          </h3>

          {/* Seller */}
          {product.seller && (
            <p className="text-xs text-[#a78bfa]/50 flex items-center gap-1">
              <span className="w-4 h-4 rounded-full bg-gradient-to-br from-[#a78bfa] to-[#7c3aed] flex items-center justify-center text-[8px] text-white font-bold">
                {product.seller.name?.charAt(0).toUpperCase()}
              </span>
              {product.seller.name}
            </p>
          )}

          {/* Price & Views */}
          <div className="flex items-center justify-between pt-1">
            <p className="text-base font-bold gradient-text">
              {formatPrice(displayPrice, currency)}
            </p>
            <div className="flex items-center gap-1 text-[#a78bfa]/40">
              <Eye className="w-3 h-3" />
              <span className="text-[11px]">{product.views}</span>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
