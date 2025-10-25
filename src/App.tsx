import React, { useState } from 'react';
import Header from './components/Header';
import Hero from './components/Hero';
import Menu from './components/Menu';
import Cart from './components/Cart';
import Checkout from './components/Checkout';
import AdminDashboard from './components/AdminDashboard';
import Sidebar from './components/Sidebar';
import MobileNav from './components/MobileNav';
import ContactModal from './components/ContactModal';
import DeliveryModal from './components/DeliveryModal';
import FloatingCartButton from './components/FloatingCartButton';
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
    <div className="min-h-screen bg-white flex flex-col lg:flex-row p-2 lg:p-4">
      {/* Sidebar */}
      <div className="hidden lg:block lg:w-80">
        <Sidebar 
          selectedCategory={selectedCategory}
          onCategorySelect={handleCategorySelect}
        />
      </div>
      
      {/* Main Content Area */}
      <div className="flex-1 flex flex-col lg:ml-4">
        <Header
          cartItemsCount={getTotalItems()}
          onCartClick={handleCartClick}
        />

        {/* Mobile Contact Info */}
        <div className="lg:hidden bg-white border-b border-gray-200 px-4 py-3">
          <h2 className="text-xl font-bold text-black mb-2">BRO-GER MAIN</h2>
          <p className="text-sm text-gray-600 mb-3">
            You can also Contact us on our page for faster transaction @Bro-Ger FB page
          </p>
          <div className="flex items-center space-x-6">
            <button 
              onClick={handleContactInfoClick}
              className="flex items-center space-x-2 hover:opacity-80 transition-opacity"
            >
              <div className="w-6 h-6 bg-gray-100 rounded-full flex items-center justify-center">
                <svg className="w-4 h-4 text-gray-600" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M18 10c0 3.866-3.582 7-8 7a8.841 8.841 0 01-4.083-.98L2 17l1.338-3.123C2.493 12.767 2 11.434 2 10c0-3.866 3.582-7 8-7s8 3.134 8 7zM7 9H5v2h2V9zm8 0h-2v2h2V9zM9 9h2v2H9V9z" clipRule="evenodd" />
                </svg>
              </div>
              <span className="text-sm text-gray-700">Contact info</span>
            </button>
            <button 
              onClick={handleDeliveryClick}
              className="flex items-center space-x-2 hover:opacity-80 transition-opacity"
            >
              <div className="w-6 h-6 bg-gray-100 rounded-full flex items-center justify-center">
                <svg className="w-4 h-4 text-gray-600" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
                </svg>
              </div>
              <span className="text-sm text-gray-700">Delivery</span>
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        <MobileNav
          activeCategory={selectedCategory}
          onCategoryClick={handleCategorySelect}
        />

        {currentView === 'home' && (
          <>
            <Hero />
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

        {currentView === 'menu' && (
          <Menu
            menuItems={menuItems}
            addToCart={addToCart}
            cartItems={cartItems}
            updateQuantity={updateQuantity}
            selectedCategory={selectedCategory}
            onCategorySelect={handleCategorySelect}
          />
        )}

        {currentView === 'cart' && (
          <Cart
            cartItems={cartItems}
            updateQuantity={updateQuantity}
            removeFromCart={removeFromCart}
            clearCart={clearCart}
            getTotalPrice={getTotalPrice}
            onContinueShopping={handleBackToMenu}
            onCheckout={handleCheckout}
          />
        )}

        {currentView === 'checkout' && (
          <Checkout
            cartItems={cartItems}
            totalPrice={getTotalPrice()}
            onBack={handleBackToCart}
          />
        )}

        <FloatingCartButton
          itemCount={getTotalItems()}
          onClick={handleCartClick}
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