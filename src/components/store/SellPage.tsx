'use client';

import { useState, useEffect } from 'react';
import { useStore } from '@/store';
import { motion } from 'framer-motion';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Skeleton } from '@/components/ui/skeleton';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  ArrowLeft,
  Upload,
  ImageIcon,
  X,
  Loader2,
  Sparkles,
} from 'lucide-react';
import { toast } from 'sonner';

const CONDITIONS = ['NEW', 'LIKE_NEW', 'GOOD', 'FAIR', 'POOR'] as const;

const conditionLabels: Record<string, string> = {
  NEW: 'New',
  LIKE_NEW: 'Like New',
  GOOD: 'Good',
  FAIR: 'Fair',
  POOR: 'Poor',
};

export function SellPage() {
  const { navigate, user, openAuthModal } = useStore();

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState('');
  const [image, setImage] = useState('');
  const [category, setCategory] = useState('');
  const [condition, setCondition] = useState('');
  const [categories, setCategories] = useState<{ id: string; name: string }[]>([]);
  const [loadingCategories, setLoadingCategories] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [imagePreview, setImagePreview] = useState(false);

  useEffect(() => {
    if (!user) {
      openAuthModal('login');
      navigate('home');
      return;
    }
    fetch('/api/categories?type=PRODUCT')
      .then((res) => res.json())
      .then((data) => setCategories(data))
      .catch(() => {})
      .finally(() => setLoadingCategories(false));
  }, [user, openAuthModal, navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!title.trim()) {
      toast.error('Please enter a product title');
      return;
    }
    if (!description.trim()) {
      toast.error('Please enter a description');
      return;
    }
    if (!price || Number(price) <= 0) {
      toast.error('Please enter a valid price');
      return;
    }
    if (!category) {
      toast.error('Please select a category');
      return;
    }
    if (!condition) {
      toast.error('Please select the product condition');
      return;
    }

    setSubmitting(true);
    try {
      const res = await fetch('/api/products', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: title.trim(),
          description: description.trim(),
          price: Number(price),
          image: image.trim() || null,
          categoryId: category,
          condition,
        }),
      });

      if (res.ok) {
        toast.success('Product listed successfully! 🎉');
        navigate('products');
      } else {
        const data = await res.json();
        toast.error(data.error || 'Failed to list product');
      }
    } catch {
      toast.error('Something went wrong');
    } finally {
      setSubmitting(false);
    }
  };

  if (!user) return null;

  return (
    <div className="min-h-screen bg-[#06001a]">
      {/* Background */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-20 left-1/3 w-96 h-96 bg-[#8b5cf6]/10 rounded-full blur-[150px]" />
      </div>

      <div className="relative z-10 max-w-2xl mx-auto px-4 sm:px-6 py-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <Button
            variant="ghost"
            onClick={() => navigate('products')}
            className="text-[#c4b5fd] hover:text-white hover:bg-white/[0.04] mb-4"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back
          </Button>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#a78bfa] to-[#7c3aed] flex items-center justify-center">
              <Sparkles className="w-5 h-5 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-white">Sell a Product</h1>
              <p className="text-sm text-[#a78bfa]/60">
                List your product for sale
              </p>
            </div>
          </div>
        </motion.div>

        {/* Form */}
        <motion.form
          onSubmit={handleSubmit}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="space-y-6"
        >
          {/* Image URL */}
          <div className="space-y-2">
            <Label className="text-sm text-[#c4b5fd]">Product Image URL</Label>
            <div className="relative">
              <Input
                placeholder="https://example.com/image.jpg"
                value={image}
                onChange={(e) => {
                  setImage(e.target.value);
                  setImagePreview(false);
                }}
                className="bg-white/[0.04] border-purple-500/20 text-white placeholder:text-white/30 rounded-xl focus:border-purple-500/50 pr-20"
              />
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={() => setImagePreview(!imagePreview)}
                disabled={!image.trim()}
                className="absolute right-1 top-1/2 -translate-y-1/2 text-[#a78bfa] hover:text-white text-xs"
              >
                <ImageIcon className="w-3.5 h-3.5 mr-1" />
                Preview
              </Button>
            </div>
            {imagePreview && image.trim() && (
              <div className="relative rounded-xl overflow-hidden border border-purple-500/20 bg-white/[0.04]">
                <img
                  src={image}
                  alt="Preview"
                  className="w-full max-h-64 object-cover"
                  onError={(e) => {
                    (e.target as HTMLImageElement).style.display = 'none';
                  }}
                />
              </div>
            )}
          </div>

          {/* Title */}
          <div className="space-y-2">
            <Label className="text-sm text-[#c4b5fd]">
              Product Title <span className="text-red-400">*</span>
            </Label>
            <Input
              placeholder="e.g. iPhone 14 Pro Max 256GB"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="bg-white/[0.04] border-purple-500/20 text-white placeholder:text-white/30 rounded-xl focus:border-purple-500/50"
            />
          </div>

          {/* Description */}
          <div className="space-y-2">
            <Label className="text-sm text-[#c4b5fd]">
              Description <span className="text-red-400">*</span>
            </Label>
            <Textarea
              placeholder="Describe your product in detail..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={4}
              className="bg-white/[0.04] border-purple-500/20 text-white placeholder:text-white/30 rounded-xl focus:border-purple-500/50 resize-none"
            />
          </div>

          {/* Price */}
          <div className="space-y-2">
            <Label className="text-sm text-[#c4b5fd]">
              Price (PKR) <span className="text-red-400">*</span>
            </Label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-[#a78bfa]/60 text-sm">
                Rs.
              </span>
              <Input
                type="number"
                placeholder="0"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                className="bg-white/[0.04] border-purple-500/20 text-white placeholder:text-white/30 rounded-xl focus:border-purple-500/50 pl-12"
              />
            </div>
          </div>

          {/* Category */}
          <div className="space-y-2">
            <Label className="text-sm text-[#c4b5fd]">
              Category <span className="text-red-400">*</span>
            </Label>
            {loadingCategories ? (
              <Skeleton className="h-10 w-full bg-white/[0.06] rounded-xl" />
            ) : (
              <Select value={category} onValueChange={setCategory}>
                <SelectTrigger className="bg-white/[0.04] border-purple-500/20 text-white rounded-xl">
                  <SelectValue placeholder="Select a category" />
                </SelectTrigger>
                <SelectContent className="bg-[#120033] border-purple-500/20">
                  {categories.map((cat) => (
                    <SelectItem key={cat.id} value={cat.id}>
                      {cat.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            )}
          </div>

          {/* Condition */}
          <div className="space-y-2">
            <Label className="text-sm text-[#c4b5fd]">
              Condition <span className="text-red-400">*</span>
            </Label>
            <div className="flex flex-wrap gap-2">
              {CONDITIONS.map((cond) => (
                <button
                  key={cond}
                  type="button"
                  onClick={() => setCondition(cond)}
                  className={`px-4 py-2 rounded-xl text-xs font-medium transition-all border ${
                    condition === cond
                      ? 'bg-gradient-to-r from-[#a78bfa] to-[#7c3aed] text-white border-transparent shadow-[0_0_15px_rgba(139,92,246,0.3)]'
                      : 'bg-white/[0.04] border-purple-500/20 text-[#c4b5fd] hover:bg-white/[0.08] hover:border-purple-500/40'
                  }`}
                >
                  {conditionLabels[cond]}
                </button>
              ))}
            </div>
          </div>

          {/* Submit */}
          <Button
            type="submit"
            disabled={submitting}
            size="lg"
            className="w-full bg-gradient-to-r from-[#a78bfa] to-[#7c3aed] hover:from-[#8b5cf6] hover:to-[#6d28d9] text-white font-semibold shadow-[0_0_25px_rgba(139,92,246,0.35)] hover:shadow-[0_0_40px_rgba(139,92,246,0.5)] transition-all"
          >
            {submitting ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Listing...
              </>
            ) : (
              <>
                <Upload className="w-4 h-4 mr-2" />
                List Product
              </>
            )}
          </Button>
        </motion.form>
      </div>
    </div>
  );
}
