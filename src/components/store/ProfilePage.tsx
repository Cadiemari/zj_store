'use client';

import { useState } from 'react';
import { useStore } from '@/store';
import { motion } from 'framer-motion';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  User,
  Mail,
  Phone,
  Edit3,
  Save,
  X,
  Package,
  Heart,
  Settings,
  Shield,
  Headphones,
  DollarSign,
  CheckCircle2,
  Camera,
  MapPin,
} from 'lucide-react';
import { toast } from 'sonner';

export function ProfilePage() {
  const { user, setUser, currency, setCurrency, wishlist, navigate } = useStore();

  const [editingName, setEditingName] = useState(false);
  const [editingBio, setEditingBio] = useState(false);
  const [editingPhone, setEditingPhone] = useState(false);
  const [localName, setLocalName] = useState(user?.name || '');
  const [localBio, setLocalBio] = useState(user?.bio || '');
  const [localPhone, setLocalPhone] = useState(user?.phone || '');

  if (!user) return null;

  const handleSaveName = () => {
    if (localName.trim()) {
      setUser({ ...user, name: localName.trim() });
      toast.success('Name updated');
    }
    setEditingName(false);
  };

  const handleSaveBio = () => {
    setUser({ ...user, bio: localBio.trim() });
    toast.success('Bio updated');
    setEditingBio(false);
  };

  const handleSavePhone = () => {
    setUser({ ...user, phone: localPhone.trim() });
    toast.success('Phone updated');
    setEditingPhone(false);
  };

  const quickActions = [
    { icon: Package, label: 'My Orders', page: 'orders' as const },
    { icon: Heart, label: 'Wishlist', page: 'wishlist' as const },
    { icon: Settings, label: 'Settings', page: 'support' as const },
    { icon: Headphones, label: 'Support', page: 'support' as const },
  ];

  return (
    <div className="min-h-screen bg-[#06001a]">
      {/* Background */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-0 left-1/3 w-96 h-96 bg-[#8b5cf6]/10 rounded-full blur-[150px]" />
      </div>

      <div className="relative z-10 max-w-2xl mx-auto px-4 sm:px-6 py-8">
        {/* Banner */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="relative"
        >
          {/* Banner Image */}
          <div className="h-36 sm:h-44 rounded-2xl overflow-hidden bg-gradient-to-br from-[#a78bfa]/30 via-[#7c3aed]/20 to-[#6d28d9]/30 border border-purple-500/20">
            <div className="absolute inset-0 grid-pattern opacity-20" />
            <div className="absolute bottom-4 left-4 text-xs text-white/40">
              <MapPin className="w-3 h-3 inline mr-1" />
              ZJ Tech Solutions, Pakistan
            </div>
          </div>

          {/* Avatar */}
          <div className="relative -mt-12 ml-6">
            <div className="relative">
              <div className="w-24 h-24 rounded-2xl bg-gradient-to-br from-[#a78bfa] to-[#7c3aed] border-4 border-[#06001a] flex items-center justify-center text-white text-2xl font-bold shadow-[0_0_20px_rgba(139,92,246,0.3)]">
                {user.name?.charAt(0).toUpperCase()}
              </div>
              <button className="absolute -bottom-1 -right-1 w-7 h-7 rounded-full bg-white/[0.1] backdrop-blur-sm border border-purple-500/30 flex items-center justify-center text-white hover:bg-white/[0.2] transition-colors">
                <Camera className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </motion.div>

        {/* User Info */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="mt-4 px-2"
        >
          <div className="flex items-start justify-between gap-3">
            <div>
              {editingName ? (
                <div className="flex items-center gap-2 mb-1">
                  <Input
                    value={localName}
                    onChange={(e) => setLocalName(e.target.value)}
                    className="bg-white/[0.04] border-purple-500/20 text-white h-8 w-48 rounded-lg text-lg font-bold"
                    autoFocus
                  />
                  <button
                    onClick={handleSaveName}
                    className="text-emerald-400 hover:text-emerald-300"
                  >
                    <Save className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => {
                      setLocalName(user.name || '');
                      setEditingName(false);
                    }}
                    className="text-red-400 hover:text-red-300"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              ) : (
                <div className="flex items-center gap-2 mb-1">
                  <h1 className="text-xl font-bold text-white">{user.name}</h1>
                  <button
                    onClick={() => setEditingName(true)}
                    className="text-[#a78bfa]/50 hover:text-[#a78bfa] transition-colors"
                  >
                    <Edit3 className="w-3.5 h-3.5" />
                  </button>
                </div>
              )}

              <p className="text-sm text-[#a78bfa]/50 flex items-center gap-1.5">
                <Mail className="w-3.5 h-3.5" />
                {user.email}
              </p>
            </div>

            {/* Role Badge */}
            <Badge
              className={`text-[10px] font-semibold border-0 ${
                user.role === 'ADMIN'
                  ? 'bg-gradient-to-r from-[#a78bfa] to-[#7c3aed] text-white'
                  : 'bg-white/[0.06] text-[#c4b5fd]'
              }`}
            >
              {user.role === 'ADMIN' && <Shield className="w-3 h-3 mr-1" />}
              {user.role}
            </Badge>
          </div>
        </motion.div>

        {/* Stats */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15 }}
          className="mt-6 grid grid-cols-2 gap-3"
        >
          <button
            onClick={() => navigate('orders')}
            className="bg-white/[0.04] border border-purple-500/20 rounded-xl p-4 text-left hover:border-purple-500/40 transition-colors"
          >
            <div className="flex items-center gap-2 mb-2">
              <Package className="w-4 h-4 text-[#a78bfa]" />
              <span className="text-xs text-[#a78bfa]/60">Orders</span>
            </div>
            <p className="text-2xl font-bold text-white">—</p>
          </button>
          <button
            onClick={() => navigate('wishlist')}
            className="bg-white/[0.04] border border-purple-500/20 rounded-xl p-4 text-left hover:border-purple-500/40 transition-colors"
          >
            <div className="flex items-center gap-2 mb-2">
              <Heart className="w-4 h-4 text-[#a78bfa]" />
              <span className="text-xs text-[#a78bfa]/60">Wishlist</span>
            </div>
            <p className="text-2xl font-bold text-white">{wishlist.length}</p>
          </button>
        </motion.div>

        {/* Currency Toggle */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="mt-6"
        >
          <div className="bg-white/[0.04] border border-purple-500/20 rounded-xl p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <DollarSign className="w-4 h-4 text-[#a78bfa]" />
                <span className="text-sm text-[#c4b5fd]">Currency</span>
              </div>
              <div className="flex bg-white/[0.04] border border-purple-500/20 rounded-lg overflow-hidden">
                <button
                  onClick={() => setCurrency('PKR')}
                  className={`px-4 py-1.5 text-xs font-semibold transition-all ${
                    currency === 'PKR'
                      ? 'bg-gradient-to-r from-[#a78bfa] to-[#7c3aed] text-white'
                      : 'text-[#a78bfa]/50 hover:text-white'
                  }`}
                >
                  ₨ PKR
                </button>
                <button
                  onClick={() => setCurrency('USD')}
                  className={`px-4 py-1.5 text-xs font-semibold transition-all ${
                    currency === 'USD'
                      ? 'bg-gradient-to-r from-[#a78bfa] to-[#7c3aed] text-white'
                      : 'text-[#a78bfa]/50 hover:text-white'
                  }`}
                >
                  $ USD
                </button>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Editable Fields */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.25 }}
          className="mt-6 space-y-3"
        >
          {/* Bio */}
          <div className="bg-white/[0.04] border border-purple-500/20 rounded-xl p-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs text-[#a78bfa]/60 font-medium uppercase tracking-wider">
                Bio
              </span>
              {!editingBio && (
                <button
                  onClick={() => setEditingBio(true)}
                  className="text-[#a78bfa]/50 hover:text-[#a78bfa] transition-colors"
                >
                  <Edit3 className="w-3.5 h-3.5" />
                </button>
              )}
            </div>
            {editingBio ? (
              <div className="space-y-2">
                <textarea
                  value={localBio}
                  onChange={(e) => setLocalBio(e.target.value)}
                  rows={3}
                  className="w-full bg-white/[0.04] border border-purple-500/20 text-white text-sm rounded-lg p-2 outline-none focus:border-purple-500/50 resize-none"
                  autoFocus
                />
                <div className="flex gap-2">
                  <button
                    onClick={handleSaveBio}
                    className="text-xs text-emerald-400 hover:text-emerald-300 flex items-center gap-1"
                  >
                    <Save className="w-3 h-3" /> Save
                  </button>
                  <button
                    onClick={() => {
                      setLocalBio(user.bio || '');
                      setEditingBio(false);
                    }}
                    className="text-xs text-red-400 hover:text-red-300 flex items-center gap-1"
                  >
                    <X className="w-3 h-3" /> Cancel
                  </button>
                </div>
              </div>
            ) : (
              <p className="text-sm text-[#c4b5fd]">
                {user.bio || 'No bio yet. Click edit to add one.'}
              </p>
            )}
          </div>

          {/* Phone */}
          <div className="bg-white/[0.04] border border-purple-500/20 rounded-xl p-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs text-[#a78bfa]/60 font-medium uppercase tracking-wider">
                Phone
              </span>
              {!editingPhone && (
                <button
                  onClick={() => setEditingPhone(true)}
                  className="text-[#a78bfa]/50 hover:text-[#a78bfa] transition-colors"
                >
                  <Edit3 className="w-3.5 h-3.5" />
                </button>
              )}
            </div>
            {editingPhone ? (
              <div className="flex items-center gap-2">
                <Input
                  value={localPhone}
                  onChange={(e) => setLocalPhone(e.target.value)}
                  placeholder="03XX-XXXXXXX"
                  className="bg-white/[0.04] border-purple-500/20 text-white text-sm h-8 rounded-lg flex-1"
                  autoFocus
                />
                <button
                  onClick={handleSavePhone}
                  className="text-emerald-400 hover:text-emerald-300"
                >
                  <Save className="w-4 h-4" />
                </button>
                <button
                  onClick={() => {
                    setLocalPhone(user.phone || '');
                    setEditingPhone(false);
                  }}
                  className="text-red-400 hover:text-red-300"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <p className="text-sm text-[#c4b5fd] flex items-center gap-1.5">
                <Phone className="w-3.5 h-3.5" />
                {user.phone || 'Not set'}
              </p>
            )}
          </div>
        </motion.div>

        {/* Support Info */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="mt-6 bg-white/[0.04] border border-purple-500/20 rounded-xl p-4"
        >
          <h3 className="text-xs text-[#a78bfa]/60 font-medium uppercase tracking-wider mb-3">
            Need Help?
          </h3>
          <div className="space-y-2">
            <a
              href="tel:0320-7668531"
              className="flex items-center gap-2 text-sm text-[#c4b5fd] hover:text-white transition-colors"
            >
              <Phone className="w-3.5 h-3.5 text-[#a78bfa]" />
              0320-7668531
            </a>
            <a
              href="mailto:zjtech12@gmail.com"
              className="flex items-center gap-2 text-sm text-[#c4b5fd] hover:text-white transition-colors"
            >
              <Mail className="w-3.5 h-3.5 text-[#a78bfa]" />
              zjtech12@gmail.com
            </a>
          </div>
        </motion.div>

        {/* Quick Actions */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.35 }}
          className="mt-6"
        >
          <h3 className="text-xs text-[#a78bfa]/60 font-medium uppercase tracking-wider mb-3 px-1">
            Quick Actions
          </h3>
          <div className="grid grid-cols-2 gap-3">
            {quickActions.map((action) => (
              <button
                key={action.label}
                onClick={() => navigate(action.page)}
                className="bg-white/[0.04] border border-purple-500/20 rounded-xl p-4 flex items-center gap-3 hover:border-purple-500/40 hover:bg-white/[0.06] transition-all"
              >
                <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-[#a78bfa]/20 to-[#7c3aed]/20 flex items-center justify-center">
                  <action.icon className="w-4 h-4 text-[#a78bfa]" />
                </div>
                <span className="text-sm text-[#c4b5fd] font-medium">
                  {action.label}
                </span>
              </button>
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  );
}
