'use client';

import { useState } from 'react';
import { useStore } from '@/store';
import { motion } from 'framer-motion';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  Phone,
  Mail,
  MessageCircle,
  Send,
  Loader2,
  CheckCircle2,
  Headphones,
  Clock,
  MapPin,
  ExternalLink,
} from 'lucide-react';
import { toast } from 'sonner';

export function SupportPage() {
  const { navigate } = useStore();

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !email.trim() || !subject.trim() || !message.trim()) {
      toast.error('Please fill in all fields');
      return;
    }

    setSubmitting(true);
    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: name.trim(),
          email: email.trim(),
          subject: subject.trim(),
          message: message.trim(),
        }),
      });

      if (res.ok) {
        setSubmitted(true);
        toast.success('Message sent successfully! We\'ll get back to you soon.');
      } else {
        toast.error('Failed to send message');
      }
    } catch {
      toast.error('Something went wrong');
    } finally {
      setSubmitting(false);
    }
  };

  const contactCards = [
    {
      icon: Phone,
      title: 'Call Us',
      info: '0320-7668531',
      description: 'Available Mon-Sat, 9AM-9PM',
      href: 'tel:0320-7668531',
      color: 'from-emerald-500 to-green-600',
    },
    {
      icon: Mail,
      title: 'Email Us',
      info: 'zjtech12@gmail.com',
      description: 'We reply within 24 hours',
      href: 'mailto:zjtech12@gmail.com',
      color: 'from-blue-500 to-cyan-600',
    },
    {
      icon: MessageCircle,
      title: 'Live Chat',
      info: 'WhatsApp Support',
      description: 'Quick response guaranteed',
      href: 'https://wa.me/923207668531',
      color: 'from-violet-500 to-purple-600',
    },
  ];

  return (
    <div className="min-h-screen bg-[#06001a]">
      {/* Background */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-20 left-1/4 w-96 h-96 bg-[#8b5cf6]/10 rounded-full blur-[150px]" />
        <div className="absolute bottom-20 right-1/3 w-80 h-80 bg-[#7c3aed]/8 rounded-full blur-[130px]" />
      </div>

      <div className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 py-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <div className="w-14 h-14 mx-auto mb-4 rounded-2xl bg-gradient-to-br from-[#a78bfa] to-[#7c3aed] flex items-center justify-center shadow-[0_0_30px_rgba(139,92,246,0.3)]">
            <Headphones className="w-7 h-7 text-white" />
          </div>
          <h1 className="text-3xl sm:text-4xl font-bold text-white mb-2">
            How Can We Help?
          </h1>
          <p className="text-[#a78bfa]/60 max-w-lg mx-auto">
            Our support team is here to assist you. Reach out through any of the channels below.
          </p>
        </motion.div>

        {/* Contact Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-12">
          {contactCards.map((card, i) => (
            <motion.a
              key={card.title}
              href={card.href}
              target={card.href.startsWith('http') ? '_blank' : undefined}
              rel={card.href.startsWith('http') ? 'noopener noreferrer' : undefined}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 + i * 0.1 }}
              whileHover={{ y: -4 }}
              className="bg-white/[0.04] border border-purple-500/20 rounded-2xl p-6 text-center hover:border-purple-500/40 hover:shadow-[0_0_25px_rgba(167,139,250,0.15)] transition-all duration-300 group"
            >
              <div
                className={`w-12 h-12 mx-auto mb-4 rounded-xl bg-gradient-to-br ${card.color} flex items-center justify-center group-hover:shadow-[0_0_20px_rgba(139,92,246,0.3)] transition-shadow`}
              >
                <card.icon className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-sm font-semibold text-white mb-1">
                {card.title}
              </h3>
              <p className="text-base font-bold gradient-text mb-1">{card.info}</p>
              <p className="text-xs text-[#a78bfa]/50">{card.description}</p>
              {card.href.startsWith('http') && (
                <ExternalLink className="w-3.5 h-3.5 text-[#a78bfa]/40 mx-auto mt-3" />
              )}
            </motion.a>
          ))}
        </div>

        {/* Contact Form or Success State */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="max-w-2xl mx-auto"
        >
          <div className="bg-white/[0.04] border border-purple-500/20 rounded-2xl p-6 sm:p-8">
            {submitted ? (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="text-center py-8"
              >
                <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-emerald-500/15 flex items-center justify-center">
                  <CheckCircle2 className="w-8 h-8 text-emerald-400" />
                </div>
                <h3 className="text-xl font-semibold text-white mb-2">
                  Message Sent!
                </h3>
                <p className="text-sm text-[#a78bfa]/60 mb-6 max-w-md mx-auto">
                  Thank you for reaching out. Our team will get back to you within 24 hours.
                </p>
                <Button
                  onClick={() => {
                    setSubmitted(false);
                    setName('');
                    setEmail('');
                    setSubject('');
                    setMessage('');
                  }}
                  className="bg-gradient-to-r from-[#a78bfa] to-[#7c3aed] hover:from-[#8b5cf6] hover:to-[#6d28d9] text-white font-semibold"
                >
                  Send Another Message
                </Button>
              </motion.div>
            ) : (
              <>
                <h2 className="text-xl font-bold text-white mb-1">
                  Send us a Message
                </h2>
                <p className="text-sm text-[#a78bfa]/60 mb-6">
                  Fill out the form below and we&apos;ll respond as soon as possible.
                </p>

                <form onSubmit={handleSubmit} className="space-y-5">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label className="text-sm text-[#c4b5fd]">Name</Label>
                      <Input
                        placeholder="Your name"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        className="bg-white/[0.04] border-purple-500/20 text-white placeholder:text-white/30 rounded-xl focus:border-purple-500/50"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label className="text-sm text-[#c4b5fd]">Email</Label>
                      <Input
                        type="email"
                        placeholder="your@email.com"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="bg-white/[0.04] border-purple-500/20 text-white placeholder:text-white/30 rounded-xl focus:border-purple-500/50"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label className="text-sm text-[#c4b5fd]">Subject</Label>
                    <Input
                      placeholder="What is this about?"
                      value={subject}
                      onChange={(e) => setSubject(e.target.value)}
                      className="bg-white/[0.04] border-purple-500/20 text-white placeholder:text-white/30 rounded-xl focus:border-purple-500/50"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label className="text-sm text-[#c4b5fd]">Message</Label>
                    <Textarea
                      placeholder="Describe your issue or question..."
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                      rows={5}
                      className="bg-white/[0.04] border-purple-500/20 text-white placeholder:text-white/30 rounded-xl focus:border-purple-500/50 resize-none"
                    />
                  </div>

                  <Button
                    type="submit"
                    disabled={submitting}
                    size="lg"
                    className="w-full bg-gradient-to-r from-[#a78bfa] to-[#7c3aed] hover:from-[#8b5cf6] hover:to-[#6d28d9] text-white font-semibold shadow-[0_0_25px_rgba(139,92,246,0.35)] hover:shadow-[0_0_40px_rgba(139,92,246,0.5)] transition-all"
                  >
                    {submitting ? (
                      <>
                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                        Sending...
                      </>
                    ) : (
                      <>
                        <Send className="w-4 h-4 mr-2" />
                        Send Message
                      </>
                    )}
                  </Button>
                </form>
              </>
            )}
          </div>
        </motion.div>

        {/* Direct Contact Info */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="mt-8 text-center"
        >
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 sm:gap-8">
            <div className="flex items-center gap-2 text-xs text-[#a78bfa]/50">
              <Clock className="w-3.5 h-3.5" />
              Mon-Sat, 9AM-9PM
            </div>
            <div className="flex items-center gap-2 text-xs text-[#a78bfa]/50">
              <MapPin className="w-3.5 h-3.5" />
              ZJ Tech Solutions, Pakistan
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
