import React, { useState } from 'react';
import { ShoppingCart, Search } from 'lucide-react';

interface HeaderProps {
  cartItemsCount: number;
  onCartClick: () => void;
  onSearchClick?: () => void;
}

const Header: React.FC<HeaderProps> = ({ cartItemsCount, onCartClick, onSearchClick }) => {
  const [isSearching, setIsSearching] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const handleSearchClick = () => {
    if (onSearchClick) {
      onSearchClick();
    } else {
      setIsSearching(!isSearching);
    }
  };

  const handleLogoClick = () => {
    window.location.reload();
  };

  return (
    <header className="sticky top-0 z-50 bg-white border-b border-gray-200">
      <div className="px-6 py-4">
        <div className="flex items-center justify-between">
          {/* Title */}
          <h1 
            className="text-2xl font-bold text-black cursor-pointer hover:opacity-70 transition-opacity" 
            onClick={handleLogoClick}
          >
            BRO-GER 
          </h1>
          
          {/* Right side - Search and Cart */}
          <div className="flex items-center space-x-4">
            {/* Mobile Search */}
            <div className="lg:hidden">
              {isSearching ? (
                <div className="flex items-center space-x-2">
                  <input
                    type="text"
                    placeholder="Search..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="px-3 py-1 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent"
                    autoFocus
                  />
                  <button
                    onClick={() => {
                      setSearchQuery('');
                      setIsSearching(false);
                    }}
                    className="text-gray-400 hover:text-gray-600"
                  >
                    ✕
                  </button>
                </div>
              ) : (
                <button
                  onClick={handleSearchClick}
                  className="p-2 text-gray-600 hover:text-black transition-colors duration-200"
                >
                  <Search className="h-5 w-5" />
                </button>
              )}
            </div>

            {/* Desktop Search Icon */}
            <div className="hidden lg:block">
              <Search className="h-5 w-5 text-gray-600" />
            </div>
            
            {/* Cart */}
            <button 
              onClick={onCartClick}
              className="relative p-2 text-gray-700 hover:text-black transition-colors duration-200"
            >
              <ShoppingCart className="h-6 w-6" />
              {cartItemsCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-black text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                  {cartItemsCount}
                </span>
              )}
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;