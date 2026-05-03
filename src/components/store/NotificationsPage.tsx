'use client';

import { useState, useEffect, useCallback } from 'react';
import { useStore, type NotificationItem } from '@/store';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import {
  Package,
  MessageSquare,
  Tag,
  Info,
  CheckCheck,
  BellOff,
} from 'lucide-react';
import { toast } from 'sonner';

export function NotificationsPage() {
  const { user, navigate, setNotificationCount } = useStore();
  const [notifications, setNotifications] = useState<NotificationItem[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchNotifications = useCallback(async () => {
    if (!user) return;
    setLoading(true);
    try {
      const res = await fetch(`/api/notifications?userId=${user.id}`);
      const data = await res.json();
      setNotifications(data.notifications || []);
      const unread = (data.notifications || []).filter((n: any) => !n.read).length;
      setNotificationCount(unread);
    } catch {
      setNotifications([]);
    } finally {
      setLoading(false);
    }
  }, [user, setNotificationCount]);

  useEffect(() => {
    fetchNotifications();
  }, [fetchNotifications]);

  const markAsRead = async (id: string) => {
    try {
      await fetch(`/api/notifications/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ read: true }),
      });
      setNotifications((prev) =>
        prev.map((n) => (n.id === id ? { ...n, read: true } : n))
      );
      const unread = notifications.filter((n) => !n.read && n.id !== id).length;
      setNotificationCount(unread);
    } catch {
      // silent
    }
  };

  const markAllAsRead = async () => {
    try {
      await fetch(`/api/notifications?userId=${user?.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ readAll: true }),
      });
      setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
      setNotificationCount(0);
      toast.success('All notifications marked as read');
    } catch {
      toast.error('Failed to mark all as read');
    }
  };

  const typeIcons: Record<string, any> = {
    ORDER: Package,
    MESSAGE: MessageSquare,
    PROMO: Tag,
    INFO: Info,
  };

  const typeColors: Record<string, string> = {
    ORDER: 'bg-blue-500/20 text-blue-400',
    MESSAGE: 'bg-purple-500/20 text-purple-400',
    PROMO: 'bg-pink-500/20 text-pink-400',
    INFO: 'bg-cyan-500/20 text-cyan-400',
  };

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const mins = Math.floor(diff / 60000);
    if (mins < 1) return 'Just now';
    if (mins < 60) return `${mins}m ago`;
    const hours = Math.floor(mins / 60);
    if (hours < 24) return `${hours}h ago`;
    const days = Math.floor(hours / 24);
    if (days < 7) return `${days}d ago`;
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  };

  if (!user) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-20 text-center">
        <p className="text-[#a78bfa]/50">Please sign in to view notifications</p>
      </div>
    );
  }

  const unreadCount = notifications.filter((n) => !n.read).length;

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="flex items-start justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-white mb-2">Notifications</h1>
          <p className="text-[#c4b5fd]">
            {unreadCount > 0 ? `${unreadCount} unread notification${unreadCount !== 1 ? 's' : ''}` : 'All caught up!'}
          </p>
        </div>
        {unreadCount > 0 && (
          <Button
            onClick={markAllAsRead}
            variant="outline"
            className="border-purple-500/20 text-[#c4b5fd] hover:text-white text-sm"
          >
            <CheckCheck className="w-4 h-4 mr-2" /> Mark all read
          </Button>
        )}
      </motion.div>

      {loading ? (
        <div className="space-y-3">
          {Array.from({ length: 5 }).map((_, i) => (
            <Skeleton key={i} className="h-20 bg-white/[0.04] rounded-xl" />
          ))}
        </div>
      ) : notifications.length > 0 ? (
        <div className="space-y-2">
          <AnimatePresence>
            {notifications.map((notif) => {
              const Icon = typeIcons[notif.type] || Info;
              const color = typeColors[notif.type] || typeColors.INFO;
              return (
                <motion.div
                  key={notif.id}
                  layout
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -10 }}
                  onClick={() => {
                    if (!notif.read) markAsRead(notif.id);
                    if (notif.link) {
                      const parts = notif.link.replace('/', '').split('/');
                      navigate(parts[0] as any, parts[1]);
                    }
                  }}
                  className={`bg-white/[0.04] border rounded-xl p-4 flex items-start gap-3 cursor-pointer transition-all hover:border-purple-500/30 ${
                    notif.read ? 'border-purple-500/10 opacity-60' : 'border-purple-500/20'
                  }`}
                >
                  <div className={`w-10 h-10 rounded-lg ${color} flex items-center justify-center shrink-0`}>
                    <Icon className="w-5 h-5" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2">
                      <p className={`text-sm font-semibold ${notif.read ? 'text-[#c4b5fd]' : 'text-white'}`}>
                        {notif.title}
                      </p>
                      <span className="text-[10px] text-[#a78bfa]/40 shrink-0">
                        {formatDate(notif.createdAt)}
                      </span>
                    </div>
                    <p className="text-xs text-[#a78bfa]/60 mt-0.5 line-clamp-2">{notif.message}</p>
                  </div>
                  {!notif.read && (
                    <div className="w-2 h-2 bg-[#a78bfa] rounded-full shrink-0 mt-2" />
                  )}
                </motion.div>
              );
            })}
          </AnimatePresence>
        </div>
      ) : (
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center py-20"
        >
          <div className="w-20 h-20 mx-auto mb-4 bg-white/[0.04] border border-purple-500/20 rounded-2xl flex items-center justify-center">
            <BellOff className="w-10 h-10 text-[#a78bfa]/30" />
          </div>
          <h3 className="text-xl font-semibold text-white mb-2">No notifications</h3>
          <p className="text-[#a78bfa]/50">We&apos;ll notify you when something new happens</p>
        </motion.div>
      )}
    </div>
  );
}
