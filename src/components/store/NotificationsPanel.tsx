'use client';

import { motion } from 'framer-motion';
import { useStore } from '@/store';
import { Bell, Check, CheckCheck } from 'lucide-react';
import { useEffect } from 'react';

export default function NotificationsPanel() {
  const { user, navigate, notifications, unreadCount, markAsRead, markAllAsRead, setNotifications } = useStore();

  useEffect(() => {
    if (!user) return;
    fetch(`/api/notifications?userId=${user.id}`)
      .then(r => r.json())
      .then(d => { if (d.notifications) setNotifications(d.notifications); });
  }, [user, setNotifications]);

  const formatTime = (dateStr: string) => {
    const diff = Date.now() - new Date(dateStr).getTime();
    const mins = Math.floor(diff / 60000);
    if (mins < 1) return 'Just now';
    if (mins < 60) return `${mins}m ago`;
    const hours = Math.floor(mins / 60);
    if (hours < 24) return `${hours}h ago`;
    return new Date(dateStr).toLocaleDateString();
  };

  return (
    <div className="pt-16 min-h-screen">
      <div className="max-w-2xl mx-auto px-4 sm:px-6 py-8">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-bold text-white flex items-center gap-2">
            <Bell className="w-6 h-6 text-purple-400" /> Notifications
          </h1>
          {unreadCount() > 0 && (
            <button onClick={async () => {
              markAllAsRead();
              if (user) {
                await fetch('/api/notifications', {
                  method: 'PUT',
                  headers: { 'Content-Type': 'application/json' },
                  body: JSON.stringify({ userId: user.id, markAll: true }),
                });
              }
            }}
              className="text-sm text-purple-400 hover:text-purple-300 flex items-center gap-1">
              <CheckCheck className="w-4 h-4" /> Mark all as read
            </button>
          )}
        </div>

        {notifications.length === 0 ? (
          <div className="text-center py-20">
            <Bell className="w-16 h-16 text-purple-500/30 mx-auto mb-4" />
            <p className="text-purple-400/60">No notifications</p>
          </div>
        ) : (
          <div className="space-y-2">
            {notifications.map((notif, i) => (
              <motion.div key={notif.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.03 }}
                onClick={() => {
                  if (!notif.read) {
                    markAsRead(notif.id);
                    fetch('/api/notifications', {
                      method: 'PUT',
                      headers: { 'Content-Type': 'application/json' },
                      body: JSON.stringify({ id: notif.id }),
                    });
                  }
                }}
                className={`p-4 rounded-xl border cursor-pointer transition-all ${
                  !notif.read ? 'bg-purple-500/10 border-purple-500/20' : 'bg-[#130030]/50 border-purple-500/10 hover:border-purple-500/20'
                }`}
              >
                <div className="flex items-start gap-3">
                  <div className={`w-2 h-2 rounded-full mt-2 shrink-0 ${!notif.read ? 'bg-purple-500' : 'bg-transparent'}`} />
                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <h3 className={`text-sm ${!notif.read ? 'font-semibold text-white' : 'text-purple-200'}`}>{notif.title}</h3>
                      <span className="text-xs text-purple-400/50 shrink-0 ml-2">{formatTime(notif.createdAt)}</span>
                    </div>
                    <p className="text-xs text-purple-300/70 mt-0.5">{notif.message}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
