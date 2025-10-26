import React, { useState } from 'react';
import Header from './components/Header';
import Hero from './components/Hero';
import Menu from './components/Menu';
import Cart from './components/Cart';
import Checkout from './components/Checkout';
import AdminDashboard from './components/AdminDashboard';
import Sidebar from './components/Sidebar';
import MobileNav from './components/MobileNav';
import MobileSidebarContent from './components/MobileSidebarContent';
import ContactModal from './components/ContactModal';
import DeliveryModal from './components/DeliveryModal';
import FloatingCartButton from './components/FloatingCartButton';
import ReviewsDisplay from './components/ReviewsDisplay';
import { useCart } from './hooks/useCart';
import { useMenu } from './hooks/useMenu';

const App: React.FC = () => {
  const [currentView, setCurrentView] = useState<'home' | 'menu' | 'cart' | 'checkout' | 'admin'>('home');
  const [selectedCategory, setSelectedCategory] = useState('home');
  const [showMobileMenu, setShowMobileMenu] = useState(false);
  const [showContactModal, setShowContactModal] = useState(false);
  const [showDeliveryModal, setShowDeliveryModal] = useState(false);
  
  const {
    cartItems,
    isCartOpen,
    addToCart,
    updateQuantity,
    removeFromCart,
    clearCart,
    getTotalPrice,
    getTotalItems,
    openCart,
    closeCart
  } = useCart();

  const { menuItems, loading } = useMenu();

  const handleMenuClick = () => {
    setCurrentView('menu');
    setShowMobileMenu(false);
  };

  const handleCartClick = () => {
    setCurrentView('cart');
    setShowMobileMenu(false);
  };

  const handleBackToMenu = () => {
    setCurrentView('menu');
  };

  const handleBackToCart = () => {
    setCurrentView('cart');
  };

  const handleCheckout = () => {
    setCurrentView('checkout');
  };

  const handleBackToHome = () => {
    setCurrentView('home');
  };

  const handleCategorySelect = (category: string) => {
    setSelectedCategory(category);
    if (category === 'home') {
      setCurrentView('home');
    } else {
      setCurrentView('menu');
    }
  };

  const handleContactInfoClick = () => {
    setShowContactModal(true);
  };

  const handleCloseContactModal = () => {
    setShowContactModal(false);
  };

  const handleDeliveryClick = () => {
    setShowDeliveryModal(true);
  };

  const handleCloseDeliveryModal = () => {
    setShowDeliveryModal(false);
  };

  // Check if we're on admin route
  const isAdminRoute = window.location.pathname === '/admin';

  if (isAdminRoute) {
    return <AdminDashboard />;
  }

  return (
    <div className="min-h-screen bg-white flex flex-col lg:flex-row p-0 lg:p-4">
      {/* Sidebar */}
      <div className="hidden lg:block lg:w-80">
        <Sidebar 
          selectedCategory={selectedCategory}
          onCategorySelect={handleCategorySelect}
        />
      </div>
      
      {/* Main Content Area */}
      <div className="flex-1 flex flex-col lg:ml-4">
        {currentView === 'home' && (
          <>
            <Header
              cartItemsCount={getTotalItems()}
              onCartClick={handleCartClick}
            />
            
            <Hero />
            
            {/* Mobile Sidebar Content - Same as Desktop */}
            <MobileSidebarContent 
              selectedCategory={selectedCategory}
              onCategorySelect={handleCategorySelect}
            />
            
            {/* Mobile Navigation */}
            <MobileNav
              activeCategory={selectedCategory}
              onCategoryClick={handleCategorySelect}
            />
            
            <Menu
              menuItems={menuItems}
              addToCart={addToCart}
              cartItems={cartItems}
              updateQuantity={updateQuantity}
              selectedCategory={selectedCategory}
              onCategorySelect={handleCategorySelect}
            />
            <div className="max-w-7xl mx-auto px-4 py-8">
              <ReviewsDisplay />
            </div>
          </>
        )}

        {currentView === 'menu' && (
          <>
            <Header
              cartItemsCount={getTotalItems()}
              onCartClick={handleCartClick}
            />
            {/* Mobile Navigation */}
            <MobileNav
              activeCategory={selectedCategory}
              onCategoryClick={handleCategorySelect}
            />
            <Menu
              menuItems={menuItems}
              addToCart={addToCart}
              cartItems={cartItems}
              updateQuantity={updateQuantity}
              selectedCategory={selectedCategory}
              onCategorySelect={handleCategorySelect}
            />
          </>
        )}

        {currentView === 'cart' && (
          <>
            <Header
              cartItemsCount={getTotalItems()}
              onCartClick={handleCartClick}
            />
            <Cart
              cartItems={cartItems}
              updateQuantity={updateQuantity}
              removeFromCart={removeFromCart}
              clearCart={clearCart}
              getTotalPrice={getTotalPrice}
              onContinueShopping={handleBackToMenu}
              onCheckout={handleCheckout}
            />
          </>
        )}

        {currentView === 'checkout' && (
          <>
            <Header
              cartItemsCount={getTotalItems()}
              onCartClick={handleCartClick}
            />
            <Checkout
              cartItems={cartItems}
              totalPrice={getTotalPrice()}
              onBack={handleBackToCart}
            />
          </>
        )}

        <FloatingCartButton
          itemCount={getTotalItems()}
          onCartClick={handleCartClick}
        />

        {/* Contact Modal */}
        <ContactModal
          isOpen={showContactModal}
          onClose={handleCloseContactModal}
        />

        {/* Delivery Modal */}
        <DeliveryModal
          isOpen={showDeliveryModal}
          onClose={handleCloseDeliveryModal}
        />
      </div>
    </div>
  );
};

export default App;