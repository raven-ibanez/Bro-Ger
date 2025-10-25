import React from 'react';

interface MobileNavProps {
  activeCategory: string;
  onCategoryClick: (categoryId: string) => void;
}

const MobileNav: React.FC<MobileNavProps> = ({ activeCategory, onCategoryClick }) => {
  const handleCategoryClick = (categoryId: string) => {
    onCategoryClick(categoryId);
  };
  const categories = [
    { id: 'grilledburger', name: 'GRILLEDBURGER', icon: '🍔' },
    { id: 'chickensandwich', name: 'CHICKENSANDWICH', icon: '🐔' },
    { id: 'pickapicka', name: 'PICKA-PICKA', icon: '🍗' },
    { id: 'drinks', name: 'DRINKS', icon: '🥤' },
    { id: 'addons', name: 'ADD ONS', icon: '➕' }
  ];

  return (
    <div className="sticky top-16 z-40 bg-white border-b border-gray-200 lg:hidden shadow-sm">
      <div className="flex overflow-x-auto scrollbar-hide px-4 py-3 space-x-2 snap-x snap-mandatory">
        {categories.map((category) => (
          <button
            key={category.id}
            onClick={() => handleCategoryClick(category.id)}
            className={`flex-shrink-0 flex items-center space-x-2 px-4 py-2 rounded-lg transition-all duration-200 snap-start ${
              activeCategory === category.id
                ? 'bg-black text-white shadow-md'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200 active:bg-gray-300'
            }`}
          >
            <span className="text-sm">{category.icon}</span>
            <span className="text-xs font-medium whitespace-nowrap">{category.name}</span>
          </button>
        ))}
      </div>
    </div>
  );
};

export default MobileNav;