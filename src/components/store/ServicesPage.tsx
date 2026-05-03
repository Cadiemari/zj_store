'use client';

import { useState, useEffect, useCallback } from 'react';
import { useStore, type ServiceItem } from '@/store';
import { motion } from 'framer-motion';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Search, Briefcase, Plus } from 'lucide-react';
import { ServiceCard } from './ServiceCard';

export function ServicesPage() {
  const { navigate, user, openAuthModal } = useStore();

  const [services, setServices] = useState<ServiceItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [localSearch, setLocalSearch] = useState('');
  const [category, setCategory] = useState<string>('all');
  const [serviceType, setServiceType] = useState<string>('all');
  const [categories, setCategories] = useState<{ id: string; name: string }[]>([]);

  const fetchCategories = async () => {
    try {
      const res = await fetch('/api/categories?type=SERVICE');
      if (res.ok) {
        const data = await res.json();
        setCategories(data);
      }
    } catch {
      // silent
    }
  };

  const fetchServices = useCallback(async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (localSearch) params.set('search', localSearch);
      if (category !== 'all') params.set('categoryId', category);
      if (serviceType !== 'all') params.set('serviceType', serviceType);
      params.set('limit', '50');

      const res = await fetch(`/api/services?${params.toString()}`);
      if (res.ok) {
        const data = await res.json();
        setServices(Array.isArray(data) ? data : data.services || []);
      }
    } catch {
      setServices([]);
    } finally {
      setLoading(false);
    }
  }, [localSearch, category, serviceType]);

  useEffect(() => {
    fetchCategories();
  }, []);

  useEffect(() => {
    fetchServices();
  }, [fetchServices]);

  return (
    <div className="min-h-screen bg-[#06001a]">
      {/* Background Effects */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-0 right-1/4 w-96 h-96 bg-[#8b5cf6]/10 rounded-full blur-[150px]" />
        <div className="absolute bottom-0 left-1/3 w-80 h-80 bg-[#7c3aed]/8 rounded-full blur-[130px]" />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 py-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl sm:text-4xl font-bold text-white mb-2">
                Services
              </h1>
              <p className="text-[#a78bfa]/60">
                Find professional services and internet packages
              </p>
            </div>
            {user && (
              <Button
                onClick={() => navigate('sell-service')}
                className="bg-gradient-to-r from-[#a78bfa] to-[#7c3aed] hover:from-[#8b5cf6] hover:to-[#6d28d9] text-white text-sm font-semibold shadow-[0_0_20px_rgba(139,92,246,0.35)] hidden sm:flex"
              >
                <Plus className="w-4 h-4 mr-1.5" />
                Sell Service
              </Button>
            )}
          </div>
        </motion.div>

        {/* Search & Filters */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="mb-6 flex flex-col sm:flex-row gap-3"
        >
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#a78bfa]/50" />
            <Input
              placeholder="Search services..."
              value={localSearch}
              onChange={(e) => setLocalSearch(e.target.value)}
              className="bg-white/[0.04] border-purple-500/20 text-white placeholder:text-white/30 pl-10 pr-4 rounded-xl focus:border-purple-500/50 h-11"
            />
          </div>
          <Select value={serviceType} onValueChange={setServiceType}>
            <SelectTrigger className="w-[170px] bg-white/[0.04] border-purple-500/20 text-[#c4b5fd] h-11 rounded-xl">
              <SelectValue placeholder="Service Type" />
            </SelectTrigger>
            <SelectContent className="bg-[#120033] border-purple-500/20">
              <SelectItem value="all">All Types</SelectItem>
              <SelectItem value="GENERAL">General Service</SelectItem>
              <SelectItem value="INTERNET_PACKAGE">Internet Package</SelectItem>
            </SelectContent>
          </Select>
        </motion.div>

        {/* Category Filter Chips */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15 }}
          className="mb-8 flex flex-wrap gap-2"
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

        {/* Services Grid */}
        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
            {Array.from({ length: 6 }).map((_, i) => (
              <div
                key={i}
                className="bg-white/[0.04] border border-purple-500/20 rounded-2xl overflow-hidden"
              >
                <Skeleton className="h-44 w-full bg-white/[0.06]" />
                <div className="p-4 space-y-3">
                  <Skeleton className="h-4 w-full bg-white/[0.06] rounded" />
                  <Skeleton className="h-3 w-2/3 bg-white/[0.06] rounded" />
                  <Skeleton className="h-3 w-24 bg-white/[0.06] rounded" />
                  <div className="flex justify-between pt-2">
                    <Skeleton className="h-5 w-20 bg-white/[0.06] rounded" />
                    <Skeleton className="h-8 w-24 bg-white/[0.06] rounded" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : services.length === 0 ? (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="flex flex-col items-center justify-center py-20"
          >
            <div className="w-20 h-20 rounded-full bg-white/[0.04] border border-purple-500/20 flex items-center justify-center mb-6">
              <Briefcase className="w-10 h-10 text-[#a78bfa]/40" />
            </div>
            <h3 className="text-xl font-semibold text-white mb-2">
              No services found
            </h3>
            <p className="text-sm text-[#a78bfa]/50 mb-6 text-center max-w-md">
              {user
                ? 'No services match your search. Try adjusting filters or sell your own service.'
                : 'No services available yet. Sign in to sell your own service.'}
            </p>
            {user ? (
              <Button
                onClick={() => navigate('sell-service')}
                className="bg-gradient-to-r from-[#a78bfa] to-[#7c3aed] hover:from-[#8b5cf6] hover:to-[#6d28d9] text-white font-semibold"
              >
                <Plus className="w-4 h-4 mr-1.5" />
                Sell a Service
              </Button>
            ) : (
              <Button
                onClick={() => openAuthModal('login')}
                className="bg-gradient-to-r from-[#a78bfa] to-[#7c3aed] hover:from-[#8b5cf6] hover:to-[#6d28d9] text-white font-semibold"
              >
                Sign In to Sell Services
              </Button>
            )}
          </motion.div>
        ) : (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5"
          >
            {services.map((service, i) => (
              <motion.div
                key={service.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.05, duration: 0.3 }}
              >
                <ServiceCard service={service} />
              </motion.div>
            ))}
          </motion.div>
        )}

        {/* Results count */}
        {!loading && services.length > 0 && (
          <div className="mt-8 text-center">
            <p className="text-xs text-[#a78bfa]/40">
              Showing {services.length} service{services.length !== 1 ? 's' : ''}
            </p>
          </div>
        )}

        {/* Mobile CTA */}
        {user && (
          <div className="sm:hidden fixed bottom-20 right-4 z-30">
            <Button
              onClick={() => navigate('sell-service')}
              size="lg"
              className="w-12 h-12 rounded-full bg-gradient-to-r from-[#a78bfa] to-[#7c3aed] shadow-[0_0_25px_rgba(139,92,246,0.4)] p-0 flex items-center justify-center"
            >
              <Plus className="w-5 h-5" />
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
