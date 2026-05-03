'use client';

import { motion } from 'framer-motion';

export function AdPlaceholder() {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay: 1.2 }}
      className="my-8"
    >
      {/* Google AdSense Placeholder */}
      {/* Replace this div with your Google AdSense code */}
      <div className="w-full max-w-3xl mx-auto border border-purple-500/15 rounded-xl p-4 bg-white/[0.02] flex items-center justify-center min-h-[90px]">
        <div className="text-center">
          <p className="text-xs text-[#a78bfa]/30 uppercase tracking-wider font-medium">
            Advertisement
          </p>
          <p className="text-[10px] text-[#a78bfa]/20 mt-1">
            Google AdSense Placeholder
          </p>
        </div>
      </div>
    </motion.div>
  );
}
