'use client';

import { useState, useRef } from 'react';
import { useStore } from '@/store';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet';
import {
  Search,
  ShoppingCart,
  Bell,
  MessageSquare,
  User,
  Plus,
  Menu,
  LogOut,
  Package,
  Heart,
  Settings,
  Shield,
  Headphones,
  Home,
  ShoppingBag,
  Briefcase,
  Phone,
  Mail,
  ArrowRight,
  ChevronDown,
  Zap,
} from 'lucide-react';

export function Navbar() {
  const {
    user,
    setUser,
    currency,
    setCurrency,
    cart,
    navigate,
    notificationCount,
    messagesCount,
    openAuthModal,
    searchQuery,
    setSearchQuery,
    searchType,
    setSearchType,
  } = useStore();

  const [mobileOpen, setMobileOpen] = useState(false);
  const [searchFocused, setSearchFocused] = useState(false);
  const searchRef = useRef<HTMLInputElement>(null);

  const cartCount = cart.reduce((sum, item) => sum + item.quantity, 0);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(searchType === 'products' ? 'products' : 'services');
      setMobileOpen(false);
    }
  };

  const handleLogout = () => {
    setUser(null);
    navigate('home');
  };

  return (
    <motion.nav
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.5, ease: 'easeOut' }}
      className="sticky top-0 z-50"
      style={{
        background: 'rgba(6, 0, 26, 0.88)',
        backdropFilter: 'blur(20px)',
        WebkitBackdropFilter: 'blur(20px)',
        borderBottom: '1px solid rgba(139, 92, 246, 0.15)',
      }}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <button
            onClick={() => navigate('home')}
            className="flex items-center gap-2 shrink-0 group"
          >
            <div className="relative w-9 h-9">
              <div className="absolute inset-0 bg-gradient-to-br from-[#a78bfa] to-[#7c3aed] rounded-xl animate-spin-slow opacity-80" />
              <div className="absolute inset-0 flex items-center justify-center">
                <Zap className="w-5 h-5 text-white" />
              </div>
            </div>
            <span className="text-xl font-bold gradient-text hidden sm:block">
              ZJ Store
            </span>
          </button>

          {/* Desktop Search */}
          <form
            onSubmit={handleSearch}
            className="hidden md:flex items-center flex-1 max-w-lg mx-6"
          >
            <div
              className={`flex items-center w-full rounded-xl border transition-all duration-300 ${
                searchFocused
                  ? 'border-purple-500/50 shadow-[0_0_20px_rgba(167,139,250,0.18)]'
                  : 'border-purple-500/20'
              } bg-white/[0.04]`}
            >
              <button
                type="button"
                onClick={() => setSearchType(searchType === 'products' ? 'services' : 'products')}
                className="px-3 py-2 text-xs font-medium text-[#c4b5fd] hover:text-white transition-colors shrink-0 border-r border-purple-500/20"
              >
                {searchType === 'products' ? 'Products' : 'Services'}
                <ChevronDown className="inline w-3 h-3 ml-1" />
              </button>
              <input
                ref={searchRef}
                type="text"
                placeholder={`Search ${searchType}...`}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onFocus={() => setSearchFocused(true)}
                onBlur={() => setSearchFocused(false)}
                className="flex-1 bg-transparent text-white placeholder:text-white/30 px-3 py-2 text-sm outline-none"
              />
              <button
                type="submit"
                className="px-3 py-2 text-[#a78bfa] hover:text-white transition-colors"
              >
                <Search className="w-4 h-4" />
              </button>
            </div>
          </form>

          {/* Desktop Nav Actions */}
          <div className="hidden md:flex items-center gap-1">
            {/* Nav Links */}
            <button
              onClick={() => navigate('products')}
              className="px-3 py-2 text-sm text-[#c4b5fd] hover:text-white transition-colors rounded-lg hover:bg-white/[0.04]"
            >
              Products
            </button>
            <button
              onClick={() => navigate('services')}
              className="px-3 py-2 text-sm text-[#c4b5fd] hover:text-white transition-colors rounded-lg hover:bg-white/[0.04]"
            >
              Services
            </button>

            {/* Currency Toggle */}
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setCurrency(currency === 'PKR' ? 'USD' : 'PKR')}
              className="text-[#c4b5fd] hover:text-white text-xs font-bold px-2"
            >
              {currency === 'PKR' ? '₨ PKR' : '$ USD'}
            </Button>

            {/* Sell Button */}
            {user && (
              <Button
                onClick={() => navigate('sell')}
                className="bg-gradient-to-r from-[#a78bfa] to-[#7c3aed] hover:from-[#8b5cf6] hover:to-[#6d28d9] text-white text-xs font-semibold shadow-[0_0_20px_rgba(139,92,246,0.35)] ml-1"
              >
                <Plus className="w-3.5 h-3.5 mr-1" /> Sell
              </Button>
            )}

            {/* Notification Bell */}
            {user && (
              <button
                onClick={() => navigate('notifications')}
                className="relative p-2 text-[#c4b5fd] hover:text-white transition-colors rounded-lg hover:bg-white/[0.04]"
                aria-label="Notifications"
              >
                <Bell className="w-5 h-5" />
                {notificationCount > 0 && (
                  <span className="absolute -top-0.5 -right-0.5 min-w-[18px] h-[18px] bg-red-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center px-1">
                    {notificationCount > 9 ? '9+' : notificationCount}
                  </span>
                )}
              </button>
            )}

            {/* Messages */}
            {user && (
              <button
                onClick={() => navigate('messages')}
                className="relative p-2 text-[#c4b5fd] hover:text-white transition-colors rounded-lg hover:bg-white/[0.04]"
                aria-label="Messages"
              >
                <MessageSquare className="w-5 h-5" />
                {messagesCount > 0 && (
                  <span className="absolute -top-0.5 -right-0.5 min-w-[18px] h-[18px] bg-red-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center px-1">
                    {messagesCount > 9 ? '9+' : messagesCount}
                  </span>
                )}
              </button>
            )}

            {/* Cart */}
            <button
              onClick={() => navigate('cart')}
              className="relative p-2 text-[#c4b5fd] hover:text-white transition-colors rounded-lg hover:bg-white/[0.04]"
              aria-label="Cart"
            >
              <ShoppingCart className="w-5 h-5" />
              {cartCount > 0 && (
                <span className="absolute -top-0.5 -right-0.5 min-w-[18px] h-[18px] bg-gradient-to-r from-[#a78bfa] to-[#7c3aed] text-white text-[10px] font-bold rounded-full flex items-center justify-center px-1">
                  {cartCount > 9 ? '9+' : cartCount}
                </span>
              )}
            </button>

            {/* User Menu Dropdown */}
            {user ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <button className="ml-1 p-0.5 rounded-full border-2 border-purple-500/30 hover:border-purple-500/60 transition-colors">
                    <Avatar className="w-8 h-8">
                      <AvatarImage src={user.avatar} alt={user.name} />
                      <AvatarFallback className="bg-gradient-to-br from-[#a78bfa] to-[#7c3aed] text-white text-xs font-bold">
                        {user.name?.charAt(0).toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                  </button>
                </DropdownMenuTrigger>
                <DropdownMenuContent
                  align="end"
                  className="w-56 bg-[#120033] border-purple-500/20 text-white"
                >
                  {/* User Info Header */}
                  <div className="px-3 py-2 border-b border-purple-500/20">
                    <p className="text-sm font-semibold text-white truncate">{user.name}</p>
                    <p className="text-xs text-[#c4b5fd] truncate">{user.email}</p>
                    {user.role === 'ADMIN' && (
                      <Badge className="mt-1 bg-gradient-to-r from-[#a78bfa] to-[#7c3aed] text-white text-[10px] border-0">
                        Admin
                      </Badge>
                    )}
                  </div>

                  {/* Menu Items */}
                  <DropdownMenuItem onClick={() => navigate('profile')} className="text-[#c4b5fd] hover:text-white hover:bg-white/[0.04] cursor-pointer">
                    <User className="w-4 h-4 mr-2" /> Profile
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => navigate('orders')} className="text-[#c4b5fd] hover:text-white hover:bg-white/[0.04] cursor-pointer">
                    <Package className="w-4 h-4 mr-2" /> My Orders
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => navigate('wishlist')} className="text-[#c4b5fd] hover:text-white hover:bg-white/[0.04] cursor-pointer">
                    <Heart className="w-4 h-4 mr-2" /> Wishlist
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => navigate('messages')} className="text-[#c4b5fd] hover:text-white hover:bg-white/[0.04] cursor-pointer">
                    <MessageSquare className="w-4 h-4 mr-2" /> Messages
                    {messagesCount > 0 && (
                      <Badge className="ml-auto bg-red-500 text-white text-[10px]">{messagesCount}</Badge>
                    )}
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => navigate('notifications')} className="text-[#c4b5fd] hover:text-white hover:bg-white/[0.04] cursor-pointer">
                    <Bell className="w-4 h-4 mr-2" /> Notifications
                    {notificationCount > 0 && (
                      <Badge className="ml-auto bg-red-500 text-white text-[10px]">{notificationCount}</Badge>
                    )}
                  </DropdownMenuItem>

                  {/* Admin Panel (only for ADMIN role) */}
                  {user.role === 'ADMIN' && (
                    <DropdownMenuItem onClick={() => navigate('admin')} className="text-[#c4b5fd] hover:text-white hover:bg-white/[0.04] cursor-pointer">
                      <Shield className="w-4 h-4 mr-2" /> Admin Panel
                    </DropdownMenuItem>
                  )}

                  <DropdownMenuItem onClick={() => navigate('support')} className="text-[#c4b5fd] hover:text-white hover:bg-white/[0.04] cursor-pointer">
                    <Headphones className="w-4 h-4 mr-2" /> Support
                  </DropdownMenuItem>

                  <DropdownMenuSeparator className="bg-purple-500/20" />

                  <DropdownMenuItem onClick={handleLogout} className="text-red-400 hover:text-red-300 hover:bg-red-500/10 cursor-pointer">
                    <LogOut className="w-4 h-4 mr-2" /> Logout
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <Button
                onClick={() => openAuthModal('login')}
                className="bg-gradient-to-r from-[#a78bfa] to-[#7c3aed] hover:from-[#8b5cf6] hover:to-[#6d28d9] text-white text-sm font-semibold shadow-[0_0_20px_rgba(139,92,246,0.35)] ml-2"
              >
                Sign In
              </Button>
            )}
          </div>

          {/* Mobile Menu Button */}
          <div className="flex items-center gap-2 md:hidden">
            {/* Mobile Cart */}
            <button
              onClick={() => navigate('cart')}
              className="relative p-2 text-[#c4b5fd]"
              aria-label="Cart"
            >
              <ShoppingCart className="w-5 h-5" />
              {cartCount > 0 && (
                <span className="absolute -top-0.5 -right-0.5 min-w-[16px] h-[16px] bg-gradient-to-r from-[#a78bfa] to-[#7c3aed] text-white text-[9px] font-bold rounded-full flex items-center justify-center px-0.5">
                  {cartCount > 9 ? '9+' : cartCount}
                </span>
              )}
            </button>

            {/* Mobile Sheet */}
            <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
              <SheetTrigger asChild>
                <button className="p-2 text-[#c4b5fd]" aria-label="Menu">
                  <Menu className="w-6 h-6" />
                </button>
              </SheetTrigger>
              <SheetContent
                side="right"
                className="w-80 bg-[#0c0024] border-purple-500/20 p-0 overflow-y-auto"
              >
                <SheetHeader className="p-6 border-b border-purple-500/20">
                  <SheetTitle className="text-white flex items-center gap-2">
                    <div className="w-8 h-8 bg-gradient-to-br from-[#a78bfa] to-[#7c3aed] rounded-lg flex items-center justify-center">
                      <Zap className="w-4 h-4 text-white" />
                    </div>
                    ZJ Store
                  </SheetTitle>
                </SheetHeader>

                <div className="p-4 space-y-1">
                  {/* Mobile Search */}
                  <form onSubmit={handleSearch} className="mb-4">
                    <div className="flex items-center rounded-lg border border-purple-500/20 bg-white/[0.04] overflow-hidden">
                      <button
                        type="button"
                        onClick={() => setSearchType(searchType === 'products' ? 'services' : 'products')}
                        className="px-2 py-2 text-[10px] font-medium text-[#c4b5fd] border-r border-purple-500/20"
                      >
                        {searchType === 'products' ? 'Products' : 'Services'}
                      </button>
                      <input
                        type="text"
                        placeholder="Search..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="flex-1 bg-transparent text-white placeholder:text-white/30 px-2 py-2 text-sm outline-none"
                      />
                      <button type="submit" className="px-3 py-2 text-[#a78bfa]">
                        <Search className="w-4 h-4" />
                      </button>
                    </div>
                  </form>

                  {/* Main Nav Links */}
                  {[
                    { icon: Home, label: 'Home', page: 'home' as const },
                    { icon: ShoppingBag, label: 'Products', page: 'products' as const },
                    { icon: Briefcase, label: 'Services', page: 'services' as const },
                  ].map((item) => (
                    <button
                      key={item.page}
                      onClick={() => {
                        navigate(item.page);
                        setMobileOpen(false);
                      }}
                      className="w-full flex items-center gap-3 px-3 py-2.5 text-sm text-[#c4b5fd] hover:text-white hover:bg-white/[0.04] rounded-lg transition-colors"
                    >
                      <item.icon className="w-4 h-4" />
                      {item.label}
                      <ArrowRight className="w-4 h-4 ml-auto opacity-50" />
                    </button>
                  ))}

                  {/* Currency Toggle */}
                  <button
                    onClick={() => setCurrency(currency === 'PKR' ? 'USD' : 'PKR')}
                    className="w-full flex items-center gap-3 px-3 py-2.5 text-sm text-[#c4b5fd] hover:text-white hover:bg-white/[0.04] rounded-lg transition-colors"
                  >
                    <Settings className="w-4 h-4" />
                    Currency: {currency === 'PKR' ? '₨ PKR' : '$ USD'}
                  </button>

                  <div className="border-t border-purple-500/20 my-3" />

                  {/* Authenticated Menu */}
                  {user ? (
                    <>
                      <div className="px-3 py-2 mb-1">
                        <p className="text-sm font-semibold text-white">{user.name}</p>
                        <p className="text-xs text-[#a78bfa]/50">{user.email}</p>
                      </div>

                      {user && (
                        <button
                          onClick={() => { navigate('sell'); setMobileOpen(false); }}
                          className="w-full flex items-center gap-3 px-3 py-2.5 text-sm text-[#c4b5fd] hover:text-white hover:bg-white/[0.04] rounded-lg"
                        >
                          <Plus className="w-4 h-4" /> Sell Something
                        </button>
                      )}

                      {[
                        { icon: Package, label: 'My Orders', page: 'orders' as const },
                        { icon: Heart, label: 'Wishlist', page: 'wishlist' as const },
                        { icon: MessageSquare, label: 'Messages', page: 'messages' as const, badge: messagesCount },
                        { icon: Bell, label: 'Notifications', page: 'notifications' as const, badge: notificationCount },
                        { icon: User, label: 'Profile', page: 'profile' as const },
                        { icon: Headphones, label: 'Support', page: 'support' as const },
                      ].map((item) => (
                        <button
                          key={item.page}
                          onClick={() => {
                            navigate(item.page);
                            setMobileOpen(false);
                          }}
                          className="w-full flex items-center gap-3 px-3 py-2.5 text-sm text-[#c4b5fd] hover:text-white hover:bg-white/[0.04] rounded-lg"
                        >
                          <item.icon className="w-4 h-4" />
                          {item.label}
                          {'badge' in item && item.badge > 0 && (
                            <Badge className="ml-auto bg-red-500 text-white text-[10px]">{item.badge}</Badge>
                          )}
                        </button>
                      ))}

                      {user.role === 'ADMIN' && (
                        <button
                          onClick={() => { navigate('admin'); setMobileOpen(false); }}
                          className="w-full flex items-center gap-3 px-3 py-2.5 text-sm text-[#c4b5fd] hover:text-white hover:bg-white/[0.04] rounded-lg"
                        >
                          <Shield className="w-4 h-4" /> Admin Panel
                        </button>
                      )}

                      <div className="border-t border-purple-500/20 my-3" />
                      <button
                        onClick={() => { handleLogout(); setMobileOpen(false); }}
                        className="w-full flex items-center gap-3 px-3 py-2.5 text-sm text-red-400 hover:text-red-300 hover:bg-red-500/10 rounded-lg"
                      >
                        <LogOut className="w-4 h-4" /> Logout
                      </button>
                    </>
                  ) : (
                    <Button
                      onClick={() => { openAuthModal('login'); setMobileOpen(false); }}
                      className="w-full bg-gradient-to-r from-[#a78bfa] to-[#7c3aed] text-white font-semibold mt-2"
                    >
                      Sign In
                    </Button>
                  )}

                  {/* Support Info in Mobile Menu */}
                  <div className="border-t border-purple-500/20 my-3" />
                  <div className="px-3 py-2 space-y-2">
                    <p className="text-xs font-semibold text-[#c4b5fd] uppercase tracking-wider">Support</p>
                    <a href="tel:0320-7668531" className="flex items-center gap-2 text-xs text-[#a78bfa]/70 hover:text-white transition-colors">
                      <Phone className="w-3 h-3" /> 0320-7668531
                    </a>
                    <a href="mailto:zjtech12@gmail.com" className="flex items-center gap-2 text-xs text-[#a78bfa]/70 hover:text-white transition-colors">
                      <Mail className="w-3 h-3" /> zjtech12@gmail.com
                    </a>
                  </div>
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>
    </motion.nav>
  );
}
