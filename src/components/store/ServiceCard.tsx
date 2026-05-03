'use client';

import { motion } from 'framer-motion';
import { useStore, formatPrice, type ServiceItem } from '@/store';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Eye, Wifi, Zap, Phone, Globe } from 'lucide-react';
import { toast } from 'sonner';

interface ServiceCardProps {
  service: ServiceItem;
}

export function ServiceCard({ service }: ServiceCardProps) {
  const { navigate, currency, openAuthModal, user } = useStore();

  const displayPrice =
    currency === 'USD' && service.priceUSD ? service.priceUSD : service.price;

  const serviceTypeColors: Record<string, string> = {
    GENERAL: 'bg-purple-500/20 text-purple-400 border-purple-500/30',
    INTERNET_PACKAGE: 'bg-cyan-500/20 text-cyan-400 border-cyan-500/30',
  };

  const handleOrderNow = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!user) {
      openAuthModal('login');
      toast.error('Please sign in to order services');
      return;
    }
    navigate('service-detail', service.id);
  };

  return (
    <motion.div
      whileHover={{ y: -4, transition: { duration: 0.2 } }}
      className="group bg-white/[0.04] border border-purple-500/20 rounded-2xl overflow-hidden hover:border-purple-500/40 hover:shadow-[0_0_25px_rgba(167,139,250,0.15)] transition-all duration-300 cursor-pointer"
      onClick={() => navigate('service-detail', service.id)}
    >
      {/* Image / Icon */}
      <div className="relative h-44 overflow-hidden bg-white/[0.02]">
        {service.image ? (
          <img
            src={service.image}
            alt={service.title}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-purple-500/10 to-cyan-500/10">
            {service.serviceType === 'INTERNET_PACKAGE' ? (
              <Wifi className="w-12 h-12 text-[#a78bfa]/40" />
            ) : (
              <Zap className="w-12 h-12 text-[#a78bfa]/40" />
            )}
          </div>
        )}

        {/* Service Type Badge */}
        <Badge
          className={`absolute top-3 left-3 text-[10px] font-semibold border ${
            serviceTypeColors[service.serviceType] ||
            serviceTypeColors.GENERAL
          }`}
        >
          {service.serviceType === 'INTERNET_PACKAGE'
            ? 'Internet Package'
            : 'General Service'}
        </Badge>

        {/* Views */}
        <div className="absolute top-3 right-3 bg-black/40 backdrop-blur-sm rounded-full px-2 py-1 flex items-center gap-1">
          <Eye className="w-3 h-3 text-white/70" />
          <span className="text-[10px] text-white/70">{service.views}</span>
        </div>
      </div>

      {/* Content */}
      <div className="p-4 space-y-3">
        {/* Title */}
        <h3 className="text-sm font-semibold text-white line-clamp-2 group-hover:text-[#c4b5fd] transition-colors">
          {service.title}
        </h3>

        {/* Internet Package Details */}
        {service.serviceType === 'INTERNET_PACKAGE' && (
          <div className="space-y-1.5">
            {(service.speed || service.connectionType) && (
              <div className="flex items-center gap-2">
                <Wifi className="w-3.5 h-3.5 text-[#a78bfa]/60" />
                <span className="text-xs text-[#a78bfa]/60">
                  {[service.speed, service.connectionType].filter(Boolean).join(' · ')}
                </span>
              </div>
            )}
            {service.provider && (
              <div className="flex items-center gap-2">
                <Globe className="w-3.5 h-3.5 text-[#a78bfa]/60" />
                <span className="text-xs text-[#a78bfa]/60">{service.provider}</span>
              </div>
            )}
          </div>
        )}

        {/* Seller */}
        {service.seller && (
          <p className="text-xs text-[#a78bfa]/50 flex items-center gap-1.5">
            <span className="w-4 h-4 rounded-full bg-gradient-to-br from-[#a78bfa] to-[#7c3aed] flex items-center justify-center text-[8px] text-white font-bold">
              {service.seller.name?.charAt(0).toUpperCase()}
            </span>
            {service.seller.name}
          </p>
        )}

        {/* Contact */}
        {service.contact && (
          <p className="text-xs text-[#a78bfa]/50 flex items-center gap-1.5">
            <Phone className="w-3 h-3" />
            {service.contact}
          </p>
        )}

        {/* Price & Order */}
        <div className="flex items-center justify-between pt-2 border-t border-purple-500/10">
          <p className="text-base font-bold gradient-text">
            {formatPrice(displayPrice, currency)}
          </p>
          <Button
            onClick={handleOrderNow}
            size="sm"
            className="bg-gradient-to-r from-[#a78bfa] to-[#7c3aed] hover:from-[#8b5cf6] hover:to-[#6d28d9] text-white text-xs font-semibold shadow-[0_0_15px_rgba(139,92,246,0.3)]"
          >
            Order Now
          </Button>
        </div>
      </div>
    </motion.div>
  );
}
