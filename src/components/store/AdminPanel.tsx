'use client';

import { useState, useEffect, useCallback } from 'react';
import { useStore, type User, type Product, type ServiceItem, type OrderItem, type MessageItem } from '@/store';
import { motion } from 'framer-motion';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import {
  Shield,
  Users,
  Package,
  Briefcase,
  ShoppingBag,
  MessageSquare,
  Search,
  Trash2,
  TrendingUp,
  Eye,
  ChevronDown,
  BarChart3,
  Loader2,
  RefreshCw,
} from 'lucide-react';
import { toast } from 'sonner';

export function AdminPanel() {
  const { user, navigate } = useStore();
  const [activeTab, setActiveTab] = useState('dashboard');

  useEffect(() => {
    if (!user || user.role !== 'ADMIN') {
      navigate('home');
    }
  }, [user, navigate]);

  if (!user || user.role !== 'ADMIN') return null;

  return (
    <div className="min-h-screen bg-[#06001a]">
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-0 left-1/3 w-96 h-96 bg-[#8b5cf6]/10 rounded-full blur-[150px]" />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 py-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#a78bfa] to-[#7c3aed] flex items-center justify-center">
              <Shield className="w-5 h-5 text-white" />
            </div>
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold text-white">
                Admin Panel
              </h1>
              <p className="text-sm text-[#a78bfa]/60">
                Manage your marketplace
              </p>
            </div>
          </div>
        </motion.div>

        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="bg-white/[0.04] border border-purple-500/20 p-1 mb-6 w-full overflow-x-auto flex-wrap h-auto gap-1">
            {[
              { value: 'dashboard', label: 'Dashboard', icon: BarChart3 },
              { value: 'users', label: 'Users', icon: Users },
              { value: 'products', label: 'Products', icon: Package },
              { value: 'services', label: 'Services', icon: Briefcase },
              { value: 'orders', label: 'Orders', icon: ShoppingBag },
              { value: 'messages', label: 'Messages', icon: MessageSquare },
            ].map((tab) => (
              <TabsTrigger
                key={tab.value}
                value={tab.value}
                className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-[#a78bfa] data-[state=active]:to-[#7c3aed] data-[state=active]:text-white text-[#c4b5fd] text-xs sm:text-sm px-3 py-2 rounded-lg flex items-center gap-1.5"
              >
                <tab.icon className="w-3.5 h-3.5" />
                {tab.label}
              </TabsTrigger>
            ))}
          </TabsList>

          <TabsContent value="dashboard">
            <DashboardTab />
          </TabsContent>
          <TabsContent value="users">
            <UsersTab />
          </TabsContent>
          <TabsContent value="products">
            <ProductsTab />
          </TabsContent>
          <TabsContent value="services">
            <ServicesTab />
          </TabsContent>
          <TabsContent value="orders">
            <OrdersTab />
          </TabsContent>
          <TabsContent value="messages">
            <MessagesTab />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}

/* ─── Dashboard Tab ─── */
function DashboardTab() {
  const [stats, setStats] = useState({ users: 0, products: 0, services: 0, orders: 0 });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      fetch('/api/users').then((r) => (r.ok ? r.json().then((d) => (Array.isArray(d) ? d.length : 0)) : 0)),
      fetch('/api/products?limit=1').then((r) => (r.ok ? r.json().then((d) => (Array.isArray(d) ? d.length : 0)) : 0)),
      fetch('/api/services?limit=1').then((r) => (r.ok ? r.json().then((d) => (Array.isArray(d) ? d.length : 0)) : 0)),
      fetch('/api/orders?limit=1').then((r) => (r.ok ? r.json().then((d) => (Array.isArray(d) ? d.length : 0)) : 0)),
    ])
      .then(([users, products, services, orders]) => {
        setStats({ users, products, services, orders });
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const cards = [
    { label: 'Total Users', value: stats.users, icon: Users, color: 'from-violet-500 to-purple-600' },
    { label: 'Total Products', value: stats.products, icon: Package, color: 'from-cyan-500 to-blue-600' },
    { label: 'Total Services', value: stats.services, icon: Briefcase, color: 'from-emerald-500 to-green-600' },
    { label: 'Total Orders', value: stats.orders, icon: ShoppingBag, color: 'from-amber-500 to-orange-600' },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {loading
        ? Array.from({ length: 4 }).map((_, i) => (
            <Skeleton key={i} className="h-32 bg-white/[0.06] rounded-2xl" />
          ))
        : cards.map((card, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              className="bg-white/[0.04] border border-purple-500/20 rounded-2xl p-5"
            >
              <div className="flex items-center justify-between mb-3">
                <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${card.color} flex items-center justify-center`}>
                  <card.icon className="w-5 h-5 text-white" />
                </div>
                <TrendingUp className="w-4 h-4 text-emerald-400" />
              </div>
              <p className="text-2xl font-bold text-white">{card.value}</p>
              <p className="text-xs text-[#a78bfa]/60 mt-1">{card.label}</p>
            </motion.div>
          ))}
    </div>
  );
}

/* ─── Users Tab ─── */
function UsersTab() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  const fetchUsers = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/users');
      if (res.ok) {
        const data = await res.json();
        setUsers(Array.isArray(data) ? data : []);
      }
    } catch {
      setUsers([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  const filtered = users.filter(
    (u) =>
      u.name.toLowerCase().includes(search.toLowerCase()) ||
      u.email.toLowerCase().includes(search.toLowerCase())
  );

  const handleDelete = async (userId: string) => {
    try {
      const res = await fetch(`/api/users/${userId}`, { method: 'DELETE' });
      if (res.ok) {
        toast.success('User deleted');
        fetchUsers();
      } else {
        const data = await res.json();
        toast.error(data.error || 'Failed to delete user');
      }
    } catch {
      toast.error('Something went wrong');
    }
  };

  return (
    <div>
      <div className="relative mb-6 max-w-md">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#a78bfa]/50" />
        <Input
          placeholder="Search users..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="bg-white/[0.04] border-purple-500/20 text-white placeholder:text-white/30 pl-10 rounded-xl focus:border-purple-500/50"
        />
      </div>

      {loading ? (
        <div className="space-y-3">
          {Array.from({ length: 5 }).map((_, i) => (
            <Skeleton key={i} className="h-16 bg-white/[0.06] rounded-xl" />
          ))}
        </div>
      ) : filtered.length === 0 ? (
        <div className="text-center py-12">
          <Users className="w-10 h-10 text-[#a78bfa]/30 mx-auto mb-3" />
          <p className="text-sm text-[#a78bfa]/50">No users found</p>
        </div>
      ) : (
        <div className="space-y-3">
          {filtered.map((u, i) => (
            <motion.div
              key={u.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.03 }}
              className="bg-white/[0.04] border border-purple-500/20 rounded-xl p-4 flex items-center gap-3"
            >
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#a78bfa] to-[#7c3aed] flex items-center justify-center text-white text-sm font-bold flex-shrink-0">
                {u.name?.charAt(0).toUpperCase()}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-white truncate">
                  {u.name}
                </p>
                <p className="text-xs text-[#a78bfa]/50 truncate">{u.email}</p>
              </div>
              <Badge
                className={`text-[10px] font-semibold border-0 ${
                  u.role === 'ADMIN'
                    ? 'bg-gradient-to-r from-[#a78bfa] to-[#7c3aed] text-white'
                    : 'bg-white/[0.06] text-[#c4b5fd]'
                }`}
              >
                {u.role}
              </Badge>
              {u.role !== 'ADMIN' && (
                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="text-red-400/60 hover:text-red-400 hover:bg-red-500/10 h-8 w-8 p-0"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent className="bg-[#120033] border-purple-500/20">
                    <AlertDialogHeader>
                      <AlertDialogTitle className="text-white">
                        Delete User
                      </AlertDialogTitle>
                      <AlertDialogDescription className="text-[#a78bfa]/60">
                        Are you sure you want to delete {u.name}? This action cannot be undone.
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel className="bg-white/[0.06] border-purple-500/20 text-[#c4b5fd] hover:bg-white/[0.1]">
                        Cancel
                      </AlertDialogCancel>
                      <AlertDialogAction
                        onClick={() => handleDelete(u.id)}
                        className="bg-red-500 hover:bg-red-600 text-white"
                      >
                        Delete
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              )}
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
}

/* ─── Products Tab ─── */
function ProductsTab() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  const fetchProducts = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/products?limit=100');
      if (res.ok) {
        const data = await res.json();
        setProducts(Array.isArray(data) ? data : []);
      }
    } catch {
      setProducts([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  const filtered = products.filter((p) =>
    p.title.toLowerCase().includes(search.toLowerCase())
  );

  const handleDelete = async (id: string) => {
    try {
      const res = await fetch(`/api/products/${id}`, { method: 'DELETE' });
      if (res.ok) {
        toast.success('Product deleted');
        fetchProducts();
      } else {
        toast.error('Failed to delete product');
      }
    } catch {
      toast.error('Something went wrong');
    }
  };

  return (
    <div>
      <div className="relative mb-6 max-w-md">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#a78bfa]/50" />
        <Input
          placeholder="Search products..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="bg-white/[0.04] border-purple-500/20 text-white placeholder:text-white/30 pl-10 rounded-xl focus:border-purple-500/50"
        />
      </div>

      {loading ? (
        <div className="space-y-3">
          {Array.from({ length: 5 }).map((_, i) => (
            <Skeleton key={i} className="h-16 bg-white/[0.06] rounded-xl" />
          ))}
        </div>
      ) : filtered.length === 0 ? (
        <div className="text-center py-12">
          <Package className="w-10 h-10 text-[#a78bfa]/30 mx-auto mb-3" />
          <p className="text-sm text-[#a78bfa]/50">No products found</p>
        </div>
      ) : (
        <div className="space-y-3">
          {filtered.map((p, i) => (
            <motion.div
              key={p.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.03 }}
              className="bg-white/[0.04] border border-purple-500/20 rounded-xl p-4 flex items-center gap-3"
            >
              <div className="w-12 h-12 rounded-lg overflow-hidden bg-white/[0.04] flex-shrink-0">
                {p.image ? (
                  <img src={p.image} alt={p.title} className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-lg">📦</div>
                )}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-white truncate">{p.title}</p>
                <p className="text-xs text-[#a78bfa]/50">
                  Rs. {p.price.toLocaleString()} · {p.condition} · {p.views} views
                </p>
              </div>
              <Badge
                className={`text-[10px] font-semibold border-0 ${
                  p.status === 'ACTIVE'
                    ? 'bg-emerald-500/15 text-emerald-400'
                    : 'bg-red-500/15 text-red-400'
                }`}
              >
                {p.status}
              </Badge>
              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="text-red-400/60 hover:text-red-400 hover:bg-red-500/10 h-8 w-8 p-0"
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </AlertDialogTrigger>
                <AlertDialogContent className="bg-[#120033] border-purple-500/20">
                  <AlertDialogHeader>
                    <AlertDialogTitle className="text-white">Delete Product</AlertDialogTitle>
                    <AlertDialogDescription className="text-[#a78bfa]/60">
                      Are you sure you want to delete &quot;{p.title}&quot;?
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel className="bg-white/[0.06] border-purple-500/20 text-[#c4b5fd] hover:bg-white/[0.1]">Cancel</AlertDialogCancel>
                    <AlertDialogAction onClick={() => handleDelete(p.id)} className="bg-red-500 hover:bg-red-600 text-white">Delete</AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
}

/* ─── Services Tab ─── */
function ServicesTab() {
  const [services, setServices] = useState<ServiceItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  const fetchServices = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/services?limit=100');
      if (res.ok) {
        const data = await res.json();
        setServices(Array.isArray(data) ? data : []);
      }
    } catch {
      setServices([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchServices();
  }, [fetchServices]);

  const filtered = services.filter((s) =>
    s.title.toLowerCase().includes(search.toLowerCase())
  );

  const handleDelete = async (id: string) => {
    try {
      const res = await fetch(`/api/services/${id}`, { method: 'DELETE' });
      if (res.ok) {
        toast.success('Service deleted');
        fetchServices();
      } else {
        toast.error('Failed to delete service');
      }
    } catch {
      toast.error('Something went wrong');
    }
  };

  return (
    <div>
      <div className="relative mb-6 max-w-md">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#a78bfa]/50" />
        <Input
          placeholder="Search services..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="bg-white/[0.04] border-purple-500/20 text-white placeholder:text-white/30 pl-10 rounded-xl focus:border-purple-500/50"
        />
      </div>

      {loading ? (
        <div className="space-y-3">
          {Array.from({ length: 5 }).map((_, i) => (
            <Skeleton key={i} className="h-16 bg-white/[0.06] rounded-xl" />
          ))}
        </div>
      ) : filtered.length === 0 ? (
        <div className="text-center py-12">
          <Briefcase className="w-10 h-10 text-[#a78bfa]/30 mx-auto mb-3" />
          <p className="text-sm text-[#a78bfa]/50">No services found</p>
        </div>
      ) : (
        <div className="space-y-3">
          {filtered.map((s, i) => (
            <motion.div
              key={s.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.03 }}
              className="bg-white/[0.04] border border-purple-500/20 rounded-xl p-4 flex items-center gap-3"
            >
              <div className="w-12 h-12 rounded-lg overflow-hidden bg-white/[0.04] flex-shrink-0">
                {s.image ? (
                  <img src={s.image} alt={s.title} className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-lg">💼</div>
                )}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-white truncate">{s.title}</p>
                <p className="text-xs text-[#a78bfa]/50">
                  Rs. {s.price.toLocaleString()} · {s.serviceType} · {s.views} views
                </p>
              </div>
              <Badge
                className={`text-[10px] font-semibold border-0 ${
                  s.status === 'ACTIVE'
                    ? 'bg-emerald-500/15 text-emerald-400'
                    : 'bg-red-500/15 text-red-400'
                }`}
              >
                {s.status}
              </Badge>
              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="text-red-400/60 hover:text-red-400 hover:bg-red-500/10 h-8 w-8 p-0"
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </AlertDialogTrigger>
                <AlertDialogContent className="bg-[#120033] border-purple-500/20">
                  <AlertDialogHeader>
                    <AlertDialogTitle className="text-white">Delete Service</AlertDialogTitle>
                    <AlertDialogDescription className="text-[#a78bfa]/60">
                      Are you sure you want to delete &quot;{s.title}&quot;?
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel className="bg-white/[0.06] border-purple-500/20 text-[#c4b5fd] hover:bg-white/[0.1]">Cancel</AlertDialogCancel>
                    <AlertDialogAction onClick={() => handleDelete(s.id)} className="bg-red-500 hover:bg-red-600 text-white">Delete</AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
}

/* ─── Orders Tab ─── */
function OrdersTab() {
  const [orders, setOrders] = useState<OrderItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState<string | null>(null);

  const fetchOrders = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/orders?limit=100');
      if (res.ok) {
        const data = await res.json();
        setOrders(Array.isArray(data) ? data : []);
      }
    } catch {
      setOrders([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchOrders();
  }, [fetchOrders]);

  const handleStatusUpdate = async (orderId: string, status: string) => {
    setUpdating(orderId);
    try {
      const res = await fetch(`/api/orders/${orderId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status }),
      });
      if (res.ok) {
        toast.success('Order status updated');
        fetchOrders();
      } else {
        toast.error('Failed to update status');
      }
    } catch {
      toast.error('Something went wrong');
    } finally {
      setUpdating(null);
    }
  };

  const STATUS_STYLES: Record<string, string> = {
    PENDING: 'bg-yellow-500/15 text-yellow-400',
    PROCESSING: 'bg-blue-500/15 text-blue-400',
    OUT_FOR_DELIVERY: 'bg-purple-500/15 text-purple-400',
    DELIVERED: 'bg-emerald-500/15 text-emerald-400',
    CANCELLED: 'bg-red-500/15 text-red-400',
  };

  return (
    <div>
      {loading ? (
        <div className="space-y-3">
          {Array.from({ length: 5 }).map((_, i) => (
            <Skeleton key={i} className="h-20 bg-white/[0.06] rounded-xl" />
          ))}
        </div>
      ) : orders.length === 0 ? (
        <div className="text-center py-12">
          <ShoppingBag className="w-10 h-10 text-[#a78bfa]/30 mx-auto mb-3" />
          <p className="text-sm text-[#a78bfa]/50">No orders found</p>
        </div>
      ) : (
        <div className="space-y-3">
          {orders.map((order, i) => (
            <motion.div
              key={order.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.03 }}
              className="bg-white/[0.04] border border-purple-500/20 rounded-xl p-4 flex flex-col sm:flex-row sm:items-center gap-3"
            >
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-white truncate">
                  {order.product?.title || 'Product'}
                </p>
                <p className="text-xs text-[#a78bfa]/50">
                  Qty: {order.quantity} · Rs. {order.total.toLocaleString()} · {order.buyerId}
                </p>
              </div>
              <div className="flex items-center gap-2">
                <Badge className={`text-[10px] font-semibold border-0 ${STATUS_STYLES[order.status] || ''}`}>
                  {order.status}
                </Badge>
                <Select
                  value={order.status}
                  onValueChange={(val) => handleStatusUpdate(order.id, val)}
                  disabled={updating === order.id}
                >
                  <SelectTrigger className="w-[160px] h-8 text-xs bg-white/[0.04] border-purple-500/20 text-[#c4b5fd] rounded-lg">
                    {updating === order.id ? (
                      <Loader2 className="w-3 h-3 animate-spin" />
                    ) : (
                      <SelectValue />
                    )}
                  </SelectTrigger>
                  <SelectContent className="bg-[#120033] border-purple-500/20">
                    <SelectItem value="PENDING">Pending</SelectItem>
                    <SelectItem value="PROCESSING">Processing</SelectItem>
                    <SelectItem value="OUT_FOR_DELIVERY">Out for Delivery</SelectItem>
                    <SelectItem value="DELIVERED">Delivered</SelectItem>
                    <SelectItem value="CANCELLED">Cancelled</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
}

/* ─── Messages Tab ─── */
function MessagesTab() {
  const [messages, setMessages] = useState<MessageItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [expanded, setExpanded] = useState<string | null>(null);

  const fetchMessages = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/messages?limit=100');
      if (res.ok) {
        const data = await res.json();
        setMessages(Array.isArray(data) ? data : []);
      }
    } catch {
      setMessages([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchMessages();
  }, [fetchMessages]);

  return (
    <div>
      {loading ? (
        <div className="space-y-3">
          {Array.from({ length: 5 }).map((_, i) => (
            <Skeleton key={i} className="h-20 bg-white/[0.06] rounded-xl" />
          ))}
        </div>
      ) : messages.length === 0 ? (
        <div className="text-center py-12">
          <MessageSquare className="w-10 h-10 text-[#a78bfa]/30 mx-auto mb-3" />
          <p className="text-sm text-[#a78bfa]/50">No messages</p>
        </div>
      ) : (
        <div className="space-y-3">
          {messages.map((msg, i) => (
            <motion.div
              key={msg.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.03 }}
            >
              <button
                onClick={() => setExpanded(expanded === msg.id ? null : msg.id)}
                className="w-full text-left bg-white/[0.04] border border-purple-500/20 rounded-xl p-4 hover:border-purple-500/30 transition-colors"
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      {!msg.isRead && (
                        <span className="w-2 h-2 rounded-full bg-blue-400 flex-shrink-0" />
                      )}
                      <p className="text-sm font-semibold text-white truncate">
                        {msg.subject}
                      </p>
                    </div>
                    <p className="text-xs text-[#a78bfa]/50 truncate">
                      {msg.senderName} · {msg.senderEmail}
                    </p>
                  </div>
                  <ChevronDown
                    className={`w-4 h-4 text-[#a78bfa]/40 transition-transform ${
                      expanded === msg.id ? 'rotate-180' : ''
                    }`}
                  />
                </div>
              </button>

              {expanded === msg.id && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  className="bg-white/[0.02] border border-t-0 border-purple-500/20 rounded-b-xl px-4 pb-4 pt-2 -mt-2"
                >
                  <p className="text-sm text-[#c4b5fd] whitespace-pre-line">{msg.content}</p>
                  <p className="text-[10px] text-[#a78bfa]/40 mt-3">
                    {new Date(msg.createdAt).toLocaleString()}
                  </p>

                  {/* Replies */}
                  {msg.replies && msg.replies.length > 0 && (
                    <div className="mt-4 space-y-3 border-t border-purple-500/10 pt-3">
                      {msg.replies.map((reply) => (
                        <div
                          key={reply.id}
                          className="bg-white/[0.04] rounded-lg p-3"
                        >
                          <p className="text-xs text-[#a78bfa]/60 mb-1">
                            {reply.senderName} replied:
                          </p>
                          <p className="text-sm text-[#c4b5fd] whitespace-pre-line">
                            {reply.content}
                          </p>
                        </div>
                      ))}
                    </div>
                  )}
                </motion.div>
              )}
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
}
