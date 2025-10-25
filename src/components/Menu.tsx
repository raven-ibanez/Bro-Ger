import React from 'react';
import { MenuItem, CartItem } from '../types';
import { useCategories } from '../hooks/useCategories';
import MenuItemCard from './MenuItemCard';
import { Search, Plus, Trash2 } from 'lucide-react';

interface MenuProps {
  menuItems: MenuItem[];
  addToCart: (item: MenuItem, quantity?: number, variation?: any, addOns?: any[]) => void;
  cartItems: CartItem[];
  updateQuantity: (id: string, quantity: number) => void;
  selectedCategory?: string;
  onCategorySelect?: (category: string) => void;
}

const Menu: React.FC<MenuProps> = ({ menuItems, addToCart, cartItems, updateQuantity, selectedCategory = 'grilledburger', onCategorySelect }) => {
  const { categories } = useCategories();
  const [searchQuery, setSearchQuery] = React.useState('');
  const [isSearching, setIsSearching] = React.useState(false);
  const [showQuantityModal, setShowQuantityModal] = React.useState(false);
  const [selectedItem, setSelectedItem] = React.useState<MenuItem | null>(null);
  const [quantity, setQuantity] = React.useState(1);

  // Filter menu items based on selected category and search query
  const filteredItems = React.useMemo(() => {
    let items = selectedCategory === 'home' 
      ? menuItems 
      : menuItems.filter(item => item.category === selectedCategory);

    if (searchQuery.trim()) {
      items = items.filter(item => 
        item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.description.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    return items;
  }, [menuItems, selectedCategory, searchQuery]);

  const getCartQuantity = (item: MenuItem) => {
    const cartItem = cartItems.find(cartItem => cartItem.id === item.id);
    return cartItem?.quantity || 0;
  };

  const handleAddToCart = (item: MenuItem) => {
    setSelectedItem(item);
    setQuantity(1);
    setShowQuantityModal(true);
  };

  const handleConfirmAddToCart = () => {
    if (selectedItem) {
      addToCart(selectedItem, quantity);
      setShowQuantityModal(false);
      setSelectedItem(null);
      setQuantity(1);
    }
  };

  const handleCloseModal = () => {
    setShowQuantityModal(false);
    setSelectedItem(null);
    setQuantity(1);
  };

  const handleUpdateQuantity = (item: MenuItem, quantity: number) => {
    const cartItem = cartItems.find(cartItem => cartItem.id === item.id);
    if (cartItem) {
      updateQuantity(cartItem.id, quantity);
    }
  };

  const handleRemoveFromCart = (item: MenuItem) => {
    const cartItem = cartItems.find(cartItem => cartItem.id === item.id);
    if (cartItem) {
      updateQuantity(cartItem.id, 0);
    }
  };

  // Close search when clicking outside
  React.useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as Element;
      if (isSearching && !target.closest('.search-container')) {
        setIsSearching(false);
      }
    };

    if (isSearching) {
      document.addEventListener('mousedown', handleClickOutside);
      return () => document.removeEventListener('mousedown', handleClickOutside);
    }
  }, [isSearching]);

  return (
    <div className="flex-1 bg-white">
          {/* Category Navigation Bar - Hidden on mobile, shown on desktop */}
          <div className="bg-white border-b border-gray-200 px-6 py-4 hidden lg:block">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <div className="relative search-container">
                  <Search 
                    className="h-5 w-5 text-gray-600 cursor-pointer hover:text-black transition-colors" 
                    onClick={() => setIsSearching(!isSearching)}
                  />
                  {isSearching && (
                    <div className="absolute top-8 left-0 z-10 bg-white border border-gray-200 rounded-lg shadow-lg p-2 min-w-64">
                      <input
                        type="text"
                        placeholder="Search menu items..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent"
                        autoFocus
                      />
                      {searchQuery && (
                        <button
                          onClick={() => setSearchQuery('')}
                          className="absolute right-2 top-2 text-gray-400 hover:text-gray-600"
                        >
                          ✕
                        </button>
                      )}
                    </div>
                  )}
                </div>
                <div className="flex space-x-2">
                  <button 
                    onClick={() => onCategorySelect('home')}
                    className={`px-3 py-1 rounded text-sm ${selectedCategory === 'home' ? 'bg-black text-white' : 'text-gray-600 hover:text-black'}`}
                  >
                    HOME
                  </button>
                  <button 
                    onClick={() => onCategorySelect('grilledburger')}
                    className={`px-3 py-1 rounded text-sm ${selectedCategory === 'grilledburger' ? 'bg-black text-white' : 'text-gray-600 hover:text-black'}`}
                  >
                    GRILLEDBURGER
                  </button>
                  <button 
                    onClick={() => onCategorySelect('chickensandwich')}
                    className={`px-3 py-1 rounded text-sm ${selectedCategory === 'chickensandwich' ? 'bg-black text-white' : 'text-gray-600 hover:text-black'}`}
                  >
                    CHICKENSANDWICH
                  </button>
                  <button 
                    onClick={() => onCategorySelect('pickapicka')}
                    className={`px-3 py-1 rounded text-sm ${selectedCategory === 'pickapicka' ? 'bg-black text-white' : 'text-gray-600 hover:text-black'}`}
                  >
                    PICKA-PICKA
                  </button>
                  <button 
                    onClick={() => onCategorySelect('drinks')}
                    className={`px-3 py-1 rounded text-sm ${selectedCategory === 'drinks' ? 'bg-black text-white' : 'text-gray-600 hover:text-black'}`}
                  >
                    DRINKS
                  </button>
                  <button 
                    onClick={() => onCategorySelect('addons')}
                    className={`px-3 py-1 rounded text-sm ${selectedCategory === 'addons' ? 'bg-black text-white' : 'text-gray-600 hover:text-black'}`}
                  >
                    ADD ONS
                  </button>
                </div>
              </div>
              
            </div>
          </div>

      {/* Menu Content */}
      <div className="p-4 lg:p-6 lg:pr-8">
        {searchQuery && (
          <div className="mb-6">
            <h2 className="text-2xl font-bold text-black mb-2">
              Search Results for "{searchQuery}"
            </h2>
            <p className="text-sm text-gray-600">
              Found {filteredItems.length} item{filteredItems.length !== 1 ? 's' : ''}
        </p>
      </div>
        )}
        
        {!searchQuery && selectedCategory !== 'home' && (
          <div className="mb-6">
            <h2 className="text-2xl font-bold text-black mb-2">
              {selectedCategory.toUpperCase()}
            </h2>
            <a href="#" className="text-sm text-gray-600 hover:text-black">
              View everything ({filteredItems.length})
            </a>
          </div>
        )}

        {/* Product Grid */}
        {filteredItems.length === 0 ? (
          <div className="text-center py-12">
            <div className="text-gray-400 text-6xl mb-4">🔍</div>
            <h3 className="text-xl font-semibold text-gray-600 mb-2">No items found</h3>
            <p className="text-gray-500">
              {searchQuery ? `No menu items match "${searchQuery}"` : 'No items available in this category'}
            </p>
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="mt-4 px-4 py-2 bg-black text-white rounded hover:bg-gray-800 transition-colors"
              >
                Clear Search
              </button>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 lg:gap-8">
            {filteredItems.map((item) => {
            const quantity = getCartQuantity(item);
            return (
              <div key={item.id} className="bg-white rounded-lg shadow-sm border border-gray-100 p-4 lg:p-8 flex items-center">
                {/* Product Image - Left Side */}
                <div className="w-20 h-20 lg:w-32 lg:h-32 bg-gray-50 rounded-lg flex items-center justify-center mr-4 lg:mr-8 flex-shrink-0">
                  {item.image ? (
                    <img 
                      src={item.image} 
                      alt={item.name}
                      className="w-full h-full object-contain"
                    />
                  ) : (
                    <div className="text-gray-400 text-5xl">🍔</div>
                  )}
                </div>
                
                {/* Product Info - Right Side */}
                <div className="flex-1">
                  <h3 className="font-medium text-black text-lg lg:text-2xl mb-2 lg:mb-3">{item.name}</h3>
                  <div className="text-lg lg:text-2xl font-bold text-black">
                    ₱{item.basePrice.toFixed(2)}
                  </div>
            </div>
            
                {/* Quantity Controls - Bottom Right */}
                <div className="flex items-center">
                  {quantity > 0 ? (
                    <div className="flex items-center space-x-3 lg:space-x-5">
                      <button 
                        onClick={() => handleRemoveFromCart(item)}
                        className="p-1 lg:p-2 text-gray-600 hover:text-red-600"
                      >
                        <Trash2 className="h-5 w-5 lg:h-8 lg:w-8" />
                      </button>
                      <span className="text-lg lg:text-2xl font-medium text-black underline">{quantity}</span>
                      <button 
                        onClick={() => handleUpdateQuantity(item, quantity + 1)}
                        className="p-1 lg:p-2 text-gray-600 hover:text-black"
                      >
                        <Plus className="h-5 w-5 lg:h-8 lg:w-8" />
                      </button>
                    </div>
                  ) : (
                    <button 
                      onClick={() => handleAddToCart(item)}
                      className="w-8 h-8 bg-black text-white rounded-full flex items-center justify-center hover:bg-gray-800 transition-colors"
                    >
                      <Plus className="h-4 w-4" />
                    </button>
                  )}
                </div>
              </div>
                );
              })}
            </div>
        )}
      </div>

      {/* Quantity Selection Modal */}
      {showQuantityModal && selectedItem && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
            <div className="flex items-center mb-4">
              <div className="w-16 h-16 bg-gray-50 rounded-lg flex items-center justify-center mr-4">
                {selectedItem.image ? (
                  <img 
                    src={selectedItem.image} 
                    alt={selectedItem.name}
                    className="w-full h-full object-contain"
                  />
                ) : (
                  <div className="text-gray-400 text-2xl">🍔</div>
                )}
              </div>
              <div>
                <h3 className="font-semibold text-lg">{selectedItem.name}</h3>
                <p className="text-gray-600">₱{selectedItem.basePrice.toFixed(2)}</p>
              </div>
            </div>

            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Quantity
              </label>
              <div className="flex items-center space-x-4">
                <button
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center hover:bg-gray-300"
                >
                  <span className="text-lg">-</span>
                </button>
                <span className="text-2xl font-bold w-12 text-center">{quantity}</span>
                <button
                  onClick={() => setQuantity(quantity + 1)}
                  className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center hover:bg-gray-300"
                >
                  <span className="text-lg">+</span>
                </button>
              </div>
            </div>

            <div className="flex space-x-3">
              <button
                onClick={handleCloseModal}
                className="flex-1 px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                onClick={handleConfirmAddToCart}
                className="flex-1 px-4 py-2 bg-black text-white rounded-lg hover:bg-gray-800"
              >
                Add to Cart
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Menu;