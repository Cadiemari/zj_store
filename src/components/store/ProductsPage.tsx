'use client';

import { useState, useEffect, useCallback } from 'react';
import { useStore, type Product } from '@/store';
import { motion } from 'framer-motion';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Search,
  SlidersHorizontal,
  X,
  PackageOpen,
  ArrowUpDown,
} from 'lucide-react';
import { ProductCard } from './ProductCard';

export function ProductsPage() {
  const { searchQuery, navigate, currency } = useStore();

  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [localSearch, setLocalSearch] = useState(searchQuery);
  const [category, setCategory] = useState<string>('all');
  const [condition, setCondition] = useState<string>('all');
  const [sort, setSort] = useState<string>('newest');
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 99999999]);
  const [categories, setCategories] = useState<{ id: string; name: string }[]>([]);
  const [activeFilters, setActiveFilters] = useState<string[]>([]);

  const fetchCategories = async () => {
    try {
      const res = await fetch('/api/categories?type=PRODUCT');
      if (res.ok) {
        const data = await res.json();
        setCategories(data);
      }
    } catch {
      // silent fail
    }
  };

  const fetchProducts = useCallback(async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (localSearch) params.set('search', localSearch);
      if (category !== 'all') params.set('categoryId', category);
      if (condition !== 'all') params.set('condition', condition);
      if (sort) params.set('sort', sort);
      params.set('minPrice', priceRange[0].toString());
      params.set('maxPrice', priceRange[1].toString());
      params.set('limit', '50');

      const res = await fetch(`/api/products?${params.toString()}`);
      if (res.ok) {
        const data = await res.json();
        setProducts(Array.isArray(data) ? data : data.products || []);
      }
    } catch {
      setProducts([]);
    } finally {
      setLoading(false);
    }
  }, [localSearch, category, condition, sort, priceRange]);

  useEffect(() => {
    fetchCategories();
  }, []);

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  // Build active filter tags
  useEffect(() => {
    const tags: string[] = [];
    if (localSearch) tags.push(`Search: "${localSearch}"`);
    if (category !== 'all') {
      const cat = categories.find((c) => c.id === category);
      if (cat) tags.push(`Category: ${cat.name}`);
    }
    if (condition !== 'all') tags.push(`Condition: ${condition}`);
    if (sort !== 'newest') tags.push(`Sort: ${sort}`);
    if (priceRange[0] > 0 || priceRange[1] < 99999999)
      tags.push(`Price: ${priceRange[0]} - ${priceRange[1]}`);
    setActiveFilters(tags);
  }, [localSearch, category, condition, sort, priceRange, categories]);

  const removeFilter = (tag: string) => {
    if (tag.startsWith('Search:')) setLocalSearch('');
    else if (tag.startsWith('Category:')) setCategory('all');
    else if (tag.startsWith('Condition:')) setCondition('all');
    else if (tag.startsWith('Sort:')) setSort('newest');
    else if (tag.startsWith('Price:')) setPriceRange([0, 99999999]);
  };

  const clearAllFilters = () => {
    setLocalSearch('');
    setCategory('all');
    setCondition('all');
    setSort('newest');
    setPriceRange([0, 99999999]);
  };

  return (
    <div className="min-h-screen bg-[#06001a]">
      {/* Background Effects */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-[#8b5cf6]/10 rounded-full blur-[150px]" />
        <div className="absolute bottom-0 right-1/4 w-80 h-80 bg-[#7c3aed]/8 rounded-full blur-[130px]" />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 py-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <h1 className="text-3xl sm:text-4xl font-bold text-white mb-2">
            Products
          </h1>
          <p className="text-[#a78bfa]/60">
            Discover amazing products from trusted sellers
          </p>
        </motion.div>

        {/* Search Bar */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="mb-6"
        >
          <div className="flex items-center gap-3">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#a78bfa]/50" />
              <Input
                placeholder="Search products..."
                value={localSearch}
                onChange={(e) => setLocalSearch(e.target.value)}
                className="bg-white/[0.04] border-purple-500/20 text-white placeholder:text-white/30 pl-10 pr-4 rounded-xl focus:border-purple-500/50 focus:ring-purple-500/20 h-11"
              />
            </div>
            <div className="flex items-center gap-2">
              <Select value={condition} onValueChange={setCondition}>
                <SelectTrigger className="w-[140px] bg-white/[0.04] border-purple-500/20 text-[#c4b5fd] h-11 rounded-xl">
                  <SlidersHorizontal className="w-4 h-4 mr-1.5" />
                  <SelectValue placeholder="Condition" />
                </SelectTrigger>
                <SelectContent className="bg-[#120033] border-purple-500/20">
                  <SelectItem value="all">All Conditions</SelectItem>
                  <SelectItem value="NEW">New</SelectItem>
                  <SelectItem value="LIKE_NEW">Like New</SelectItem>
                  <SelectItem value="GOOD">Good</SelectItem>
                  <SelectItem value="FAIR">Fair</SelectItem>
                  <SelectItem value="POOR">Poor</SelectItem>
                </SelectContent>
              </Select>
              <Select value={sort} onValueChange={setSort}>
                <SelectTrigger className="w-[150px] bg-white/[0.04] border-purple-500/20 text-[#c4b5fd] h-11 rounded-xl">
                  <ArrowUpDown className="w-4 h-4 mr-1.5" />
                  <SelectValue placeholder="Sort by" />
                </SelectTrigger>
                <SelectContent className="bg-[#120033] border-purple-500/20">
                  <SelectItem value="newest">Newest First</SelectItem>
                  <SelectItem value="oldest">Oldest First</SelectItem>
                  <SelectItem value="price_low">Price: Low to High</SelectItem>
                  <SelectItem value="price_high">Price: High to Low</SelectItem>
                  <SelectItem value="popular">Most Popular</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </motion.div>

        {/* Category Filter Chips */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15 }}
          className="mb-6 flex flex-wrap gap-2"
        >
          <button
            onClick={() => setCategory('all')}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
              category === 'all'
                ? 'bg-gradient-to-r from-[#a78bfa] to-[#7c3aed] text-white shadow-[0_0_15px_rgba(139,92,246,0.3)]'
                : 'bg-white/[0.04] border border-purple-500/20 text-[#c4b5fd] hover:bg-white/[0.08] hover:border-purple-500/40'
            }`}
          >
            All
          </button>
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setCategory(cat.id)}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                category === cat.id
                  ? 'bg-gradient-to-r from-[#a78bfa] to-[#7c3aed] text-white shadow-[0_0_15px_rgba(139,92,246,0.3)]'
                  : 'bg-white/[0.04] border border-purple-500/20 text-[#c4b5fd] hover:bg-white/[0.08] hover:border-purple-500/40'
              }`}
            >
              {cat.name}
            </button>
          ))}
        </motion.div>

        {/* Active Filter Tags */}
        {activeFilters.length > 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="mb-6 flex flex-wrap items-center gap-2"
          >
            <span className="text-xs text-[#a78bfa]/50 mr-1">Active filters:</span>
            {activeFilters.map((tag) => (
              <Badge
                key={tag}
                variant="outline"
                className="bg-purple-500/10 border-purple-500/30 text-[#c4b5fd] text-xs cursor-pointer hover:bg-purple-500/20 transition-colors gap-1"
                onClick={() => removeFilter(tag)}
              >
                {tag}
                <X className="w-3 h-3" />
              </Badge>
            ))}
            <button
              onClick={clearAllFilters}
              className="text-xs text-red-400 hover:text-red-300 transition-colors ml-2"
            >
              Clear all
            </button>
          </motion.div>
        )}

        {/* Price Range */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="mb-8 flex items-center gap-3"
        >
          <span className="text-xs text-[#a78bfa]/50">Price Range:</span>
          <Input
            type="number"
            placeholder="Min"
            value={priceRange[0] === 0 ? '' : priceRange[0]}
            onChange={(e) =>
              setPriceRange([Number(e.target.value) || 0, priceRange[1]])
            }
            className="w-24 bg-white/[0.04] border-purple-500/20 text-white text-xs h-8 rounded-lg"
          />
          <span className="text-[#a78bfa]/30">—</span>
          <Input
            type="number"
            placeholder="Max"
            value={priceRange[1] === 99999999 ? '' : priceRange[1]}
            onChange={(e) =>
              setPriceRange([priceRange[0], Number(e.target.value) || 99999999])
            }
            className="w-24 bg-white/[0.04] border-purple-500/20 text-white text-xs h-8 rounded-lg"
          />
        </motion.div>

        {/* Products Grid / Loading / Empty */}
        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
            {Array.from({ length: 8 }).map((_, i) => (
              <div
                key={i}
                className="bg-white/[0.04] border border-purple-500/20 rounded-2xl overflow-hidden"
              >
                <Skeleton className="aspect-square w-full bg-white/[0.06]" />
                <div className="p-4 space-y-3">
                  <Skeleton className="h-3 w-16 bg-white/[0.06] rounded" />
                  <Skeleton className="h-4 w-full bg-white/[0.06] rounded" />
                  <Skeleton className="h-4 w-2/3 bg-white/[0.06] rounded" />
                  <Skeleton className="h-3 w-20 bg-white/[0.06] rounded" />
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
            <div className="w-20 h-20 rounded-full bg-white/[0.04] border border-purple-500/20 flex items-center justify-center mb-6">
              <PackageOpen className="w-10 h-10 text-[#a78bfa]/40" />
            </div>
            <h3 className="text-xl font-semibold text-white mb-2">
              No products found
            </h3>
            <p className="text-sm text-[#a78bfa]/50 mb-6 text-center max-w-md">
              We couldn&apos;t find any products matching your filters. Try adjusting your search or filters.
            </p>
            <Button
              onClick={clearAllFilters}
              className="bg-gradient-to-r from-[#a78bfa] to-[#7c3aed] hover:from-[#8b5cf6] hover:to-[#6d28d9] text-white font-semibold"
            >
              Clear Filters
            </Button>
          </motion.div>
        ) : (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5"
          >
            {products.map((product, i) => (
              <motion.div
                key={product.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.05, duration: 0.3 }}
              >
                <ProductCard product={product} />
              </motion.div>
            ))}
          </motion.div>
        )}

        {/* Results count */}
        {!loading && products.length > 0 && (
          <div className="mt-8 text-center">
            <p className="text-xs text-[#a78bfa]/40">
              Showing {products.length} product{products.length !== 1 ? 's' : ''}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
