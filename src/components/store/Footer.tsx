'use client';

import { useState, useEffect } from 'react';
import { useStore } from '@/store';
import { motion, AnimatePresence } from 'framer-motion';
import { Zap, ArrowUp, Facebook, MessageCircle, Music } from 'lucide-react';

export function Footer() {
  const { navigate } = useStore();
  const [showScrollTop, setShowScrollTop] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setShowScrollTop(window.scrollY > 400);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const quickLinks = [
    { label: 'Products', page: 'products' as const },
    { label: 'Services', page: 'services' as const },
    { label: 'Sell', page: 'sell' as const },
    { label: 'Support', page: 'support' as const },
  ];

  const socialLinks = [
    { icon: Facebook, label: 'Facebook', href: 'https://facebook.com/zjtech' },
    { icon: MessageCircle, label: 'WhatsApp Channel', href: 'https://whatsapp.com/channel/zjtech' },
    { icon: Music, label: 'TikTok', href: 'https://tiktok.com/@zjtech' },
  ];

  return (
    <footer className="mt-auto border-t border-purple-500/15 bg-[#06001a]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-12">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Logo & Description */}
          <div className="sm:col-span-2 lg:col-span-1">
            <button
              onClick={() => navigate('home')}
              className="flex items-center gap-2 mb-4 group"
            >
              <div className="w-9 h-9 bg-gradient-to-br from-[#a78bfa] to-[#7c3aed] rounded-xl flex items-center justify-center group-hover:shadow-[0_0_20px_rgba(139,92,246,0.4)] transition-shadow">
                <Zap className="w-5 h-5 text-white" />
              </div>
              <span className="text-xl font-bold gradient-text">ZJ Store</span>
            </button>
            <p className="text-sm text-[#a78bfa]/50 leading-relaxed">
              Pakistan&apos;s premium marketplace to buy and sell anything. Secure, fast, and quality assured.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-sm font-semibold text-white mb-4 uppercase tracking-wider">
              Quick Links
            </h3>
            <ul className="space-y-2">
              {quickLinks.map((link) => (
                <li key={link.page}>
                  <button
                    onClick={() => navigate(link.page)}
                    className="text-sm text-[#a78bfa]/50 hover:text-[#c4b5fd] transition-colors"
                  >
                    {link.label}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact Us */}
          <div>
            <h3 className="text-sm font-semibold text-white mb-4 uppercase tracking-wider">
              Contact Us
            </h3>
            <ul className="space-y-3">
              <li>
                <a
                  href="tel:0320-7668531"
                  className="text-sm text-[#a78bfa]/50 hover:text-[#c4b5fd] transition-colors"
                >
                  📞 0320-7668531
                </a>
              </li>
              <li>
                <a
                  href="mailto:zjtech12@gmail.com"
                  className="text-sm text-[#a78bfa]/50 hover:text-[#c4b5fd] transition-colors"
                >
                  ✉️ zjtech12@gmail.com
                </a>
              </li>
              <li>
                <span className="text-sm text-[#a78bfa]/50">🏢 ZJ Tech Solutions</span>
              </li>
            </ul>
          </div>

          {/* Social Links */}
          <div>
            <h3 className="text-sm font-semibold text-white mb-4 uppercase tracking-wider">
              Follow Us
            </h3>
            <div className="flex flex-col gap-3">
              {socialLinks.map((social) => (
                <a
                  key={social.label}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 text-sm text-[#a78bfa]/50 hover:text-[#c4b5fd] transition-colors w-fit"
                >
                  <social.icon className="w-4 h-4" />
                  {social.label}
                </a>
              ))}
            </div>
          </div>
        </div>

        {/* Separator */}
        <div className="border-t border-purple-500/10 mt-10 pt-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-xs text-[#a78bfa]/40">
            © 2026 ZJ Tech Solutions. All rights reserved.
          </p>
          <p className="text-xs text-[#a78bfa]/30">
            Built with ❤️ by ZJ Tech
          </p>
        </div>
      </div>

      {/* Scroll to Top */}
      <AnimatePresence>
        {showScrollTop && (
          <motion.button
            initial={{ opacity: 0, y: 20, scale: 0.8 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.8 }}
            transition={{ duration: 0.25 }}
            onClick={scrollToTop}
            className="fixed bottom-6 right-6 w-11 h-11 bg-gradient-to-br from-[#a78bfa] to-[#7c3aed] text-white rounded-xl flex items-center justify-center shadow-[0_0_20px_rgba(139,92,246,0.35)] hover:shadow-[0_0_35px_rgba(139,92,246,0.55)] transition-shadow z-40"
            aria-label="Scroll to top"
          >
            <ArrowUp className="w-5 h-5" />
          </motion.button>
        )}
      </AnimatePresence>
    </footer>
  );
}
