'use client';

import { motion } from 'framer-motion';
import { useStore } from '@/store';
import { DollarSign, Bell, Shield, Globe } from 'lucide-react';

export default function SettingsPage() {
  const { user, currency, setCurrency, navigate } = useStore();

  if (!user) { navigate('home'); return null; }

  return (
    <div className="pt-16 min-h-screen">
      <div className="max-w-2xl mx-auto px-4 sm:px-6 py-8">
        <h1 className="text-2xl font-bold text-white mb-6">Settings</h1>

        <div className="space-y-4">
          {/* Currency */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
            className="p-5 rounded-2xl border border-purple-500/15 bg-[#130030]/80">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-xl bg-green-500/10 flex items-center justify-center">
                <DollarSign className="w-5 h-5 text-green-400" />
              </div>
              <div>
                <h3 className="text-white font-semibold">Currency Preference</h3>
                <p className="text-xs text-purple-400">Choose your preferred currency</p>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-3">
              {(['PKR', 'USD'] as const).map((c) => (
                <button key={c} onClick={() => setCurrency(c)}
                  className={`p-3 rounded-xl border text-sm font-medium transition-all flex items-center justify-center gap-2 ${
                    currency === c ? 'border-purple-500 bg-purple-500/20 text-white' : 'border-purple-500/15 bg-purple-500/5 text-purple-300 hover:bg-purple-500/10'
                  }`}>
                  <Globe className="w-4 h-4" />
                  {c === 'PKR' ? 'Pakistani Rupee (PKR)' : 'US Dollar (USD)'}
                </button>
              ))}
            </div>
          </motion.div>

          {/* Notifications */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
            className="p-5 rounded-2xl border border-purple-500/15 bg-[#130030]/80">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-xl bg-blue-500/10 flex items-center justify-center">
                <Bell className="w-5 h-5 text-blue-400" />
              </div>
              <div>
                <h3 className="text-white font-semibold">Notifications</h3>
                <p className="text-xs text-purple-400">Manage notification preferences</p>
              </div>
            </div>
            <div className="space-y-3">
              {[
                { label: 'Order updates', desc: 'Get notified when order status changes' },
                { label: 'New messages', desc: 'Get notified when you receive messages' },
                { label: 'Promotions', desc: 'Receive promotional offers and deals' },
              ].map((notif) => (
                <div key={notif.label} className="flex items-center justify-between p-3 rounded-xl bg-purple-500/5">
                  <div>
                    <p className="text-sm text-white">{notif.label}</p>
                    <p className="text-xs text-purple-400/60">{notif.desc}</p>
                  </div>
                  <div className="w-11 h-6 rounded-full bg-purple-600 flex items-center px-0.5 cursor-pointer">
                    <div className="w-5 h-5 rounded-full bg-white translate-x-5 transition-transform" />
                  </div>
                </div>
              ))}
            </div>
          </motion.div>

          {/* Account */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}
            className="p-5 rounded-2xl border border-purple-500/15 bg-[#130030]/80">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-xl bg-purple-500/10 flex items-center justify-center">
                <Shield className="w-5 h-5 text-purple-400" />
              </div>
              <div>
                <h3 className="text-white font-semibold">Account</h3>
                <p className="text-xs text-purple-400">Account information</p>
              </div>
            </div>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between p-3 rounded-xl bg-purple-500/5">
                <span className="text-purple-400">Email</span>
                <span className="text-white">{user.email}</span>
              </div>
              <div className="flex justify-between p-3 rounded-xl bg-purple-500/5">
                <span className="text-purple-400">Role</span>
                <span className="text-white">{user.role === 'ADMIN' ? 'Administrator' : 'Member'}</span>
              </div>
              <div className="flex justify-between p-3 rounded-xl bg-purple-500/5">
                <span className="text-purple-400">Member since</span>
                <span className="text-white">{new Date(user.createdAt).toLocaleDateString()}</span>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
