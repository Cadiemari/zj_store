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
  Loader2,
  Briefcase,
  Wifi,
} from 'lucide-react';
import { toast } from 'sonner';

const CONNECTION_TYPES = ['Fiber', 'Broadband', 'Mobile'] as const;

export function SellServicePage() {
  const { navigate, user, openAuthModal } = useStore();

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState('');
  const [image, setImage] = useState('');
  const [serviceType, setServiceType] = useState<string>('');
  const [speed, setSpeed] = useState('');
  const [connectionType, setConnectionType] = useState('');
  const [provider, setProvider] = useState('');
  const [contact, setContact] = useState('');
  const [category, setCategory] = useState('');
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
    fetch('/api/categories?type=SERVICE')
      .then((res) => res.json())
      .then((data) => setCategories(data))
      .catch(() => {})
      .finally(() => setLoadingCategories(false));
  }, [user, openAuthModal, navigate]);

  const isInternetPackage = serviceType === 'INTERNET_PACKAGE';

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!title.trim()) {
      toast.error('Please enter a service title');
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
    if (!serviceType) {
      toast.error('Please select a service type');
      return;
    }
    if (!category) {
      toast.error('Please select a category');
      return;
    }

    setSubmitting(true);
    try {
      const body: Record<string, unknown> = {
        title: title.trim(),
        description: description.trim(),
        price: Number(price),
        image: image.trim() || null,
        serviceType,
        categoryId: category,
      };

      if (isInternetPackage) {
        if (speed.trim()) body.speed = speed.trim();
        if (connectionType) body.connectionType = connectionType;
        if (provider.trim()) body.provider = provider.trim();
        if (contact.trim()) body.contact = contact.trim();
      }

      const res = await fetch('/api/services', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      });

      if (res.ok) {
        toast.success('Service listed successfully! 🎉');
        navigate('services');
      } else {
        const data = await res.json();
        toast.error(data.error || 'Failed to list service');
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
        <div className="absolute top-20 right-1/4 w-96 h-96 bg-[#8b5cf6]/10 rounded-full blur-[150px]" />
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
            onClick={() => navigate('services')}
            className="text-[#c4b5fd] hover:text-white hover:bg-white/[0.04] mb-4"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back
          </Button>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#a78bfa] to-[#7c3aed] flex items-center justify-center">
              <Briefcase className="w-5 h-5 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-white">Sell a Service</h1>
              <p className="text-sm text-[#a78bfa]/60">
                List your service for others to discover
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
            <Label className="text-sm text-[#c4b5fd]">Service Image URL</Label>
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
              Service Title <span className="text-red-400">*</span>
            </Label>
            <Input
              placeholder="e.g. Web Development Service"
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
              placeholder="Describe your service in detail..."
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

          {/* Service Type */}
          <div className="space-y-2">
            <Label className="text-sm text-[#c4b5fd]">
              Service Type <span className="text-red-400">*</span>
            </Label>
            <div className="flex gap-3">
              <button
                type="button"
                onClick={() => setServiceType('GENERAL')}
                className={`flex-1 flex items-center justify-center gap-2 px-4 py-3 rounded-xl text-sm font-medium transition-all border ${
                  serviceType === 'GENERAL'
                    ? 'bg-gradient-to-r from-[#a78bfa] to-[#7c3aed] text-white border-transparent shadow-[0_0_15px_rgba(139,92,246,0.3)]'
                    : 'bg-white/[0.04] border-purple-500/20 text-[#c4b5fd] hover:bg-white/[0.08]'
                }`}
              >
                <Briefcase className="w-4 h-4" />
                General Service
              </button>
              <button
                type="button"
                onClick={() => setServiceType('INTERNET_PACKAGE')}
                className={`flex-1 flex items-center justify-center gap-2 px-4 py-3 rounded-xl text-sm font-medium transition-all border ${
                  serviceType === 'INTERNET_PACKAGE'
                    ? 'bg-gradient-to-r from-[#a78bfa] to-[#7c3aed] text-white border-transparent shadow-[0_0_15px_rgba(139,92,246,0.3)]'
                    : 'bg-white/[0.04] border-purple-500/20 text-[#c4b5fd] hover:bg-white/[0.08]'
                }`}
              >
                <Wifi className="w-4 h-4" />
                Internet Package
              </button>
            </div>
          </div>

          {/* Internet Package Fields */}
          {isInternetPackage && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="space-y-5 bg-white/[0.02] border border-purple-500/15 rounded-xl p-5"
            >
              <div className="flex items-center gap-2 mb-2">
                <Wifi className="w-4 h-4 text-[#a78bfa]" />
                <span className="text-sm font-semibold text-[#c4b5fd]">
                  Internet Package Details
                </span>
              </div>

              {/* Speed */}
              <div className="space-y-2">
                <Label className="text-sm text-[#a78bfa]/80">Speed</Label>
                <Input
                  placeholder="e.g. 100 Mbps"
                  value={speed}
                  onChange={(e) => setSpeed(e.target.value)}
                  className="bg-white/[0.04] border-purple-500/20 text-white placeholder:text-white/30 rounded-xl focus:border-purple-500/50"
                />
              </div>

              {/* Connection Type */}
              <div className="space-y-2">
                <Label className="text-sm text-[#a78bfa]/80">
                  Connection Type
                </Label>
                <div className="flex flex-wrap gap-2">
                  {CONNECTION_TYPES.map((type) => (
                    <button
                      key={type}
                      type="button"
                      onClick={() => setConnectionType(type)}
                      className={`px-4 py-2 rounded-xl text-xs font-medium transition-all border ${
                        connectionType === type
                          ? 'bg-gradient-to-r from-[#a78bfa] to-[#7c3aed] text-white border-transparent shadow-[0_0_15px_rgba(139,92,246,0.3)]'
                          : 'bg-white/[0.04] border-purple-500/20 text-[#c4b5fd] hover:bg-white/[0.08]'
                      }`}
                    >
                      {type}
                    </button>
                  ))}
                </div>
              </div>

              {/* Provider */}
              <div className="space-y-2">
                <Label className="text-sm text-[#a78bfa]/80">Provider</Label>
                <Input
                  placeholder="e.g. PTCL, Nayatel, Jazz"
                  value={provider}
                  onChange={(e) => setProvider(e.target.value)}
                  className="bg-white/[0.04] border-purple-500/20 text-white placeholder:text-white/30 rounded-xl focus:border-purple-500/50"
                />
              </div>

              {/* Contact Number */}
              <div className="space-y-2">
                <Label className="text-sm text-[#a78bfa]/80">
                  Contact Number
                </Label>
                <Input
                  placeholder="e.g. 0321-1234567"
                  value={contact}
                  onChange={(e) => setContact(e.target.value)}
                  className="bg-white/[0.04] border-purple-500/20 text-white placeholder:text-white/30 rounded-xl focus:border-purple-500/50"
                />
              </div>
            </motion.div>
          )}

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
                List Service
              </>
            )}
          </Button>
        </motion.form>
      </div>
    </div>
  );
}
