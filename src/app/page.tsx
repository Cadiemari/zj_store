'use client';

import { useStore } from '@/store';
import { AnimatePresence, motion } from 'framer-motion';
import { Navbar } from '@/components/store/Navbar';
import { HeroSection } from '@/components/store/HeroSection';
import { ProductsPage } from '@/components/store/ProductsPage';
import { ServicesPage } from '@/components/store/ServicesPage';
import { ProductDetail } from '@/components/store/ProductDetail';
import { CartPage } from '@/components/store/CartPage';
import { OrdersPage } from '@/components/store/OrdersPage';
import { SellPage } from '@/components/store/SellPage';
import { SellServicePage } from '@/components/store/SellServicePage';
import { AdminPanel } from '@/components/store/AdminPanel';
import { ProfilePage } from '@/components/store/ProfilePage';
import { SupportPage } from '@/components/store/SupportPage';
import { WishlistPage } from '@/components/store/WishlistPage';
import { MessagesPage } from '@/components/store/MessagesPage';
import { NotificationsPage } from '@/components/store/NotificationsPage';
import { Footer } from '@/components/store/Footer';
import { AuthModal } from '@/components/store/AuthModal';

const pageVariants = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -20 },
};

function PageContent() {
  const { currentPage } = useStore();

  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={currentPage}
        variants={pageVariants}
        initial="initial"
        animate="animate"
        exit="exit"
        transition={{ duration: 0.3, ease: 'easeInOut' }}
        className="min-h-screen"
      >
        {currentPage === 'home' && <HeroSection />}
        {currentPage === 'products' && <ProductsPage />}
        {currentPage === 'services' && <ServicesPage />}
        {currentPage === 'product-detail' && <ProductDetail />}
        {currentPage === 'service-detail' && <ServicesPage />}
        {currentPage === 'cart' && <CartPage />}
        {currentPage === 'orders' && <OrdersPage />}
        {currentPage === 'sell' && <SellPage />}
        {currentPage === 'sell-service' && <SellServicePage />}
        {currentPage === 'admin' && <AdminPanel />}
        {currentPage === 'admin-messages' && <AdminPanel />}
        {currentPage === 'profile' && <ProfilePage />}
        {currentPage === 'support' && <SupportPage />}
        {currentPage === 'wishlist' && <WishlistPage />}
        {currentPage === 'messages' && <MessagesPage />}
        {currentPage === 'notifications' && <NotificationsPage />}
      </motion.div>
    </AnimatePresence>
  );
}

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col bg-[#06001a]">
      <Navbar />
      <main className="flex-1">
        <PageContent />
      </main>
      <Footer />
      <AuthModal />
    </div>
  );
}
