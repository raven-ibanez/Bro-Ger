import React, { useState } from 'react';
import Header from './components/Header';
import Hero from './components/Hero';
import Menu from './components/Menu';
import Cart from './components/Cart';
import Checkout from './components/Checkout';
import AdminDashboard from './components/AdminDashboard';
import Sidebar from './components/Sidebar';
import MobileNav from './components/MobileNav';
import FloatingCartButton from './components/FloatingCartButton';
import { useCart } from './hooks/useCart';
import { useMenu } from './hooks/useMenu';

const App: React.FC = () => {
  const [currentView, setCurrentView] = useState<'home' | 'menu' | 'cart' | 'checkout' | 'admin'>('home');
  const [selectedCategory, setSelectedCategory] = useState('home');
  const [showMobileMenu, setShowMobileMenu] = useState(false);
  
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
      </div>
    </div>
  );
};

export default App;