'use client';

import { useState, useEffect, useCallback } from 'react';
import { useStore, type MessageItem } from '@/store';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Skeleton } from '@/components/ui/skeleton';
import {
  MessageSquare,
  Send,
  ChevronDown,
  ChevronUp,
  Loader2,
  Inbox,
  Reply,
  Mail,
  Calendar,
  User,
} from 'lucide-react';
import { toast } from 'sonner';

export function MessagesPage() {
  const { user, navigate, openAuthModal } = useStore();

  const [messages, setMessages] = useState<MessageItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [expanded, setExpanded] = useState<string | null>(null);
  const [replyText, setReplyText] = useState('');
  const [sendingReply, setSendingReply] = useState<string | null>(null);
  const isAdmin = user?.role === 'ADMIN';

  const fetchMessages = useCallback(async () => {
    if (!user) return;
    setLoading(true);
    try {
      const url = isAdmin
        ? '/api/messages?limit=100'
        : `/api/messages?userId=${user.id}`;
      const res = await fetch(url);
      if (res.ok) {
        const data = await res.json();
        setMessages(Array.isArray(data) ? data : []);
      }
    } catch {
      setMessages([]);
    } finally {
      setLoading(false);
    }
  }, [user, isAdmin]);

  useEffect(() => {
    if (!user) {
      openAuthModal('login');
      navigate('home');
      return;
    }
    fetchMessages();
  }, [user, navigate, openAuthModal, fetchMessages]);

  const handleReply = async (parentId: string) => {
    if (!replyText.trim() || !user) return;
    setSendingReply(parentId);
    try {
      const res = await fetch('/api/messages', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          senderId: user.id,
          senderName: user.name,
          senderEmail: user.email,
          subject: '',
          content: replyText.trim(),
          parentId,
        }),
      });
      if (res.ok) {
        toast.success('Reply sent');
        setReplyText('');
        fetchMessages();
      } else {
        toast.error('Failed to send reply');
      }
    } catch {
      toast.error('Something went wrong');
    } finally {
      setSendingReply(null);
    }
  };

  if (!user) return null;

  return (
    <div className="min-h-screen bg-[#06001a]">
      {/* Background */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-20 right-1/4 w-96 h-96 bg-[#8b5cf6]/8 rounded-full blur-[150px]" />
      </div>

      <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 py-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#a78bfa] to-[#7c3aed] flex items-center justify-center">
              <MessageSquare className="w-5 h-5 text-white" />
            </div>
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold text-white">
                Messages
              </h1>
              <p className="text-sm text-[#a78bfa]/60">
                {isAdmin
                  ? 'All messages from users'
                  : 'Your conversations with support'}
              </p>
            </div>
          </div>
        </motion.div>

        {/* Messages */}
        {loading ? (
          <div className="space-y-4">
            {Array.from({ length: 5 }).map((_, i) => (
              <Skeleton key={i} className="h-24 bg-white/[0.06] rounded-xl" />
            ))}
          </div>
        ) : messages.length === 0 ? (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="flex flex-col items-center justify-center py-20"
          >
            <div className="w-24 h-24 rounded-full bg-white/[0.04] border border-purple-500/20 flex items-center justify-center mb-6">
              <Inbox className="w-12 h-12 text-[#a78bfa]/40" />
            </div>
            <h3 className="text-xl font-semibold text-white mb-2">
              No messages yet
            </h3>
            <p className="text-sm text-[#a78bfa]/50 mb-6 text-center max-w-md">
              {isAdmin
                ? 'No messages from users yet.'
                : 'You don\'t have any messages. Contact support to start a conversation.'}
            </p>
            {!isAdmin && (
              <Button
                onClick={() => navigate('support')}
                className="bg-gradient-to-r from-[#a78bfa] to-[#7c3aed] hover:from-[#8b5cf6] hover:to-[#6d28d9] text-white font-semibold"
              >
                <Mail className="w-4 h-4 mr-2" />
                Contact Support
              </Button>
            )}
          </motion.div>
        ) : (
          <div className="space-y-3">
            {messages.map((msg, i) => {
              const isExpanded = expanded === msg.id;

              return (
                <motion.div
                  key={msg.id}
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.04 }}
                  className="bg-white/[0.04] border border-purple-500/20 rounded-xl overflow-hidden hover:border-purple-500/30 transition-colors"
                >
                  {/* Message Header - clickable */}
                  <button
                    onClick={() =>
                      setExpanded(isExpanded ? null : msg.id)
                    }
                    className="w-full text-left p-4"
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex items-start gap-3 min-w-0 flex-1">
                        {/* Unread dot */}
                        <div className="mt-2 flex-shrink-0">
                          {!msg.isRead && (
                            <span className="block w-2 h-2 rounded-full bg-blue-400 shadow-[0_0_8px_rgba(96,165,250,0.5)]" />
                          )}
                        </div>

                        {/* Avatar */}
                        <div className="w-9 h-9 rounded-full bg-gradient-to-br from-[#a78bfa] to-[#7c3aed] flex items-center justify-center text-white text-xs font-bold flex-shrink-0">
                          {msg.senderName?.charAt(0).toUpperCase()}
                        </div>

                        {/* Content */}
                        <div className="min-w-0 flex-1">
                          <div className="flex items-center gap-2">
                            <p className="text-sm font-semibold text-white truncate">
                              {msg.senderName}
                            </p>
                            <span className="text-[10px] text-[#a78bfa]/40 flex items-center gap-1">
                              <Calendar className="w-2.5 h-2.5" />
                              {new Date(msg.createdAt).toLocaleDateString()}
                            </span>
                          </div>
                          <p className="text-sm text-[#c4b5fd] truncate mt-0.5">
                            {msg.subject}
                          </p>
                          <p className="text-xs text-[#a78bfa]/50 truncate mt-0.5">
                            {msg.content}
                          </p>
                        </div>
                      </div>

                      {/* Expand icon */}
                      <div className="flex-shrink-0 mt-1">
                        {isExpanded ? (
                          <ChevronUp className="w-4 h-4 text-[#a78bfa]/40" />
                        ) : (
                          <ChevronDown className="w-4 h-4 text-[#a78bfa]/40" />
                        )}
                      </div>
                    </div>
                  </button>

                  {/* Expanded Content */}
                  <AnimatePresence>
                    {isExpanded && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.2 }}
                        className="overflow-hidden"
                      >
                        <div className="border-t border-purple-500/10 px-4 pb-4 pt-3">
                          {/* Sender Info */}
                          <div className="flex items-center gap-3 mb-3 text-xs text-[#a78bfa]/50">
                            <div className="flex items-center gap-1.5">
                              <User className="w-3 h-3" />
                              {msg.senderName}
                            </div>
                            <div className="flex items-center gap-1.5">
                              <Mail className="w-3 h-3" />
                              {msg.senderEmail}
                            </div>
                          </div>

                          {/* Full Message */}
                          <div className="bg-white/[0.03] rounded-lg p-3 mb-4">
                            {msg.subject && (
                              <p className="text-sm font-semibold text-white mb-2">
                                {msg.subject}
                              </p>
                            )}
                            <p className="text-sm text-[#c4b5fd] whitespace-pre-line leading-relaxed">
                              {msg.content}
                            </p>
                            <p className="text-[10px] text-[#a78bfa]/30 mt-3">
                              {new Date(msg.createdAt).toLocaleString()}
                            </p>
                          </div>

                          {/* Replies */}
                          {msg.replies && msg.replies.length > 0 && (
                            <div className="space-y-3 mb-4">
                              <p className="text-xs text-[#a78bfa]/50 font-medium uppercase tracking-wider">
                                Replies ({msg.replies.length})
                              </p>
                              {msg.replies.map((reply) => (
                                <div
                                  key={reply.id}
                                  className="bg-white/[0.04] border border-purple-500/10 rounded-lg p-3"
                                >
                                  <div className="flex items-center gap-2 mb-2">
                                    <div className="w-6 h-6 rounded-full bg-gradient-to-br from-emerald-500/30 to-emerald-600/30 flex items-center justify-center text-[10px] text-emerald-400 font-bold">
                                      {reply.senderName?.charAt(0).toUpperCase()}
                                    </div>
                                    <span className="text-xs font-semibold text-white">
                                      {reply.senderName}
                                    </span>
                                    <span className="text-[10px] text-[#a78bfa]/40">
                                      {new Date(reply.createdAt).toLocaleString()}
                                    </span>
                                  </div>
                                  <p className="text-sm text-[#c4b5fd] whitespace-pre-line leading-relaxed">
                                    {reply.content}
                                  </p>
                                </div>
                              ))}
                            </div>
                          )}

                          {/* Reply Input */}
                          <div className="space-y-2">
                            <div className="flex items-center gap-2 text-xs text-[#a78bfa]/50">
                              <Reply className="w-3 h-3" />
                              Reply to this message
                            </div>
                            <Textarea
                              placeholder="Type your reply..."
                              value={replyText}
                              onChange={(e) => setReplyText(e.target.value)}
                              rows={3}
                              className="bg-white/[0.04] border-purple-500/20 text-white placeholder:text-white/30 rounded-xl resize-none text-sm focus:border-purple-500/50"
                            />
                            <Button
                              onClick={() => handleReply(msg.id)}
                              disabled={
                                !replyText.trim() ||
                                sendingReply === msg.id
                              }
                              size="sm"
                              className="bg-gradient-to-r from-[#a78bfa] to-[#7c3aed] hover:from-[#8b5cf6] hover:to-[#6d28d9] text-white text-xs font-semibold"
                            >
                              {sendingReply === msg.id ? (
                                <>
                                  <Loader2 className="w-3 h-3 mr-1 animate-spin" />
                                  Sending...
                                </>
                              ) : (
                                <>
                                  <Send className="w-3 h-3 mr-1" />
                                  Send Reply
                                </>
                              )}
                            </Button>
                          </div>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.div>
              );
            })}
          </div>
        )}

        {/* Message count */}
        {!loading && messages.length > 0 && (
          <div className="mt-8 text-center">
            <p className="text-xs text-[#a78bfa]/40">
              {messages.length} message{messages.length !== 1 ? 's' : ''}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
