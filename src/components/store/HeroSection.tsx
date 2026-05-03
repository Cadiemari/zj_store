'use client';

import { useStore } from '@/store';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import {
  ArrowRight,
  ShieldCheck,
  Truck,
  Star,
  TrendingUp,
  Users,
  ThumbsUp,
  Sparkles,
} from 'lucide-react';
import { AdPlaceholder } from './AdPlaceholder';

export function HeroSection() {
  const { navigate } = useStore();

  const stats = [
    { icon: TrendingUp, label: 'Products', value: '10K+' },
    { icon: Users, label: 'Sellers', value: '5K+' },
    { icon: ThumbsUp, label: 'Satisfaction', value: '99%' },
  ];

  const features = [
    {
      icon: ShieldCheck,
      title: 'Secure Payments',
      desc: 'Your transactions are safe and protected',
    },
    {
      icon: Truck,
      title: 'Fast Delivery',
      desc: 'Quick and reliable shipping across Pakistan',
    },
    {
      icon: Star,
      title: 'Quality Assured',
      desc: 'Verified sellers and quality products',
    },
  ];

  const showcaseCards = [
    { title: 'Electronics', color: 'from-violet-500 to-purple-600', rotate: '-6deg', y: '10px', emoji: '💻' },
    { title: 'Fashion', color: 'from-purple-500 to-fuchsia-600', rotate: '0deg', y: '-10px', emoji: '👗' },
    { title: 'Home & Garden', color: 'from-fuchsia-500 to-pink-600', rotate: '6deg', y: '10px', emoji: '🏡' },
  ];

  return (
    <div className="relative min-h-screen overflow-hidden">
      {/* Animated Orbs */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-[10%] w-72 h-72 bg-[#8b5cf6]/20 rounded-full blur-[120px] animate-orb-1" />
        <div className="absolute top-40 right-[15%] w-96 h-96 bg-[#7c3aed]/15 rounded-full blur-[150px] animate-orb-2" />
        <div className="absolute bottom-20 left-[30%] w-80 h-80 bg-[#a78bfa]/10 rounded-full blur-[130px] animate-orb-3" />
        <div className="absolute top-60 left-[60%] w-48 h-48 bg-[#a5f3fc]/10 rounded-full blur-[100px] animate-orb-2" />
      </div>

      {/* Grid Pattern */}
      <div className="absolute inset-0 grid-pattern opacity-40" />

      {/* Main Content */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 pt-20 pb-12">
        {/* Hero Heading */}
        <div className="text-center mb-16">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: 'easeOut' }}
          >
            {/* Badge */}
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.1, duration: 0.4 }}
              className="inline-flex items-center gap-2 px-4 py-1.5 mb-6 rounded-full bg-white/[0.05] border border-purple-500/20 text-sm text-[#c4b5fd]"
            >
              <Sparkles className="w-4 h-4 text-[#a78bfa]" />
              Pakistan&apos;s #1 Marketplace
            </motion.div>

            <h1 className="text-5xl sm:text-6xl lg:text-7xl font-extrabold mb-6 leading-tight">
              <span className="text-white">Buy & Sell</span>
              <br />
              <span className="gradient-text-bright animate-text-glow">Anything</span>
            </h1>
            <p className="text-lg sm:text-xl text-[#c4b5fd] max-w-2xl mx-auto mb-10 leading-relaxed">
              Pakistan&apos;s premium marketplace. Discover amazing products, professional services,
              and connect with trusted sellers.
            </p>
          </motion.div>

          {/* CTA Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.6 }}
            className="flex flex-col sm:flex-row gap-4 justify-center"
          >
            <Button
              onClick={() => navigate('products')}
              size="lg"
              className="bg-gradient-to-r from-[#a78bfa] to-[#7c3aed] hover:from-[#8b5cf6] hover:to-[#6d28d9] text-white font-semibold text-base px-8 py-6 shadow-[0_0_30px_rgba(139,92,246,0.35)] hover:shadow-[0_0_50px_rgba(139,92,246,0.45)] transition-all"
            >
              Explore Products
              <ArrowRight className="w-5 h-5 ml-2" />
            </Button>
            <Button
              onClick={() => navigate('services')}
              size="lg"
              variant="outline"
              className="border-purple-500/30 text-white hover:bg-purple-500/10 hover:border-purple-500/50 font-semibold text-base px-8 py-6 transition-all"
            >
              Browse Services
              <ArrowRight className="w-5 h-5 ml-2" />
            </Button>
          </motion.div>
        </div>

        {/* Stats */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5, duration: 0.6 }}
          className="flex flex-wrap justify-center gap-8 sm:gap-12 mb-20"
        >
          {stats.map((stat, i) => (
            <div key={i} className="text-center">
              <div className="text-3xl sm:text-4xl font-bold gradient-text mb-1">
                {stat.value}
              </div>
              <div className="text-sm text-[#a78bfa]/60 flex items-center gap-1.5 justify-center">
                <stat.icon className="w-4 h-4" />
                {stat.label}
              </div>
            </div>
          ))}
        </motion.div>

        {/* 3D Product Showcase Cards */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.6, duration: 0.8 }}
          className="mb-20"
          style={{ perspective: '1200px' }}
        >
          <div className="flex justify-center items-center gap-4 sm:gap-8 flex-wrap">
            {showcaseCards.map((card, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 40, rotateY: -15 }}
                animate={{ opacity: 1, y: 0, rotateY: 0 }}
                transition={{ delay: 0.8 + i * 0.15, duration: 0.6 }}
                whileHover={{
                  scale: 1.05,
                  rotateY: 5,
                  y: -5,
                  transition: { duration: 0.3 },
                }}
                className="w-52 sm:w-64 bg-white/[0.04] border border-purple-500/20 rounded-2xl p-6 cursor-pointer hover:border-purple-500/40 hover:shadow-[0_0_30px_rgba(167,139,250,0.18)] transition-all duration-300"
                style={{
                  transform: `rotate(${card.rotate}) translateY(${card.y})`,
                  transformStyle: 'preserve-3d',
                }}
                onClick={() => navigate('products')}
              >
                <div className={`w-full h-32 rounded-xl bg-gradient-to-br ${card.color} mb-4 flex items-center justify-center`}>
                  <span className="text-4xl">{card.emoji}</span>
                </div>
                <h3 className="text-white font-semibold text-center">{card.title}</h3>
                <p className="text-[#a78bfa]/50 text-xs text-center mt-1">Explore now</p>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Trust Features */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.0, duration: 0.6 }}
          className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-16"
        >
          {features.map((feature, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1.1 + i * 0.1 }}
              whileHover={{ y: -4, transition: { duration: 0.2 } }}
              className="bg-white/[0.04] border border-purple-500/20 rounded-2xl p-6 text-center hover:border-purple-500/40 hover:shadow-[0_0_30px_rgba(167,139,250,0.18)] transition-all duration-300"
            >
              <div className="w-12 h-12 mx-auto mb-4 bg-gradient-to-br from-[#a78bfa]/20 to-[#7c3aed]/20 rounded-xl flex items-center justify-center">
                <feature.icon className="w-6 h-6 text-[#a78bfa]" />
              </div>
              <h3 className="text-white font-semibold mb-1">{feature.title}</h3>
              <p className="text-sm text-[#a78bfa]/60">{feature.desc}</p>
            </motion.div>
          ))}
        </motion.div>

        {/* Ad Placeholder */}
        <AdPlaceholder />
      </div>
    </div>
  );
}
