import React, { useState } from 'react';
import { Phone, Mail, MessageCircle, Facebook, ChevronDown } from 'lucide-react';
import { useSidebarContent } from '../hooks/useSidebarContent';

interface SidebarProps {
  selectedCategory: string;
  onCategorySelect: (category: string) => void;
}

const Sidebar: React.FC<SidebarProps> = ({ selectedCategory, onCategorySelect }) => {
  const [expandedDelivery, setExpandedDelivery] = useState(false);
  const [expandedPickup, setExpandedPickup] = useState(false);
  const { content, loading } = useSidebarContent();
  
  const categories = [
    { id: 'grilledburger', name: 'GRILLEDBURGER', icon: '🍔' },
    { id: 'chickensandwich', name: 'CHICKENSANDWICH', icon: '🐔' },
    { id: 'pickapicka', name: 'PICKA-PICKA', icon: '🍗' },
    { id: 'drinks', name: 'DRINKS', icon: '🥤' },
    { id: 'addons', name: 'ADD ONS', icon: '➕' }
  ];

  return (
    <div className="hidden lg:block w-full lg:w-80 bg-white border-r border-gray-200 p-4 lg:p-6 space-y-4 lg:space-y-6">
      {/* About Us Card */}
      <div className="bg-white border border-gray-200 rounded-lg p-4">
        <h3 className="font-semibold text-black text-lg mb-3">ABOUT US</h3>
        <p className="text-gray-600 text-sm">
          {loading ? 'Loading...' : content.aboutUs}
        </p>
      </div>

      {/* Get In Touch Card */}
      <div className="bg-white border border-gray-200 rounded-lg p-4">
        <h3 className="font-semibold text-black text-lg mb-3">GET IN TOUCH</h3>
        <div className="space-y-2">
          {content.contactMessage && (
            <div className="flex items-center space-x-2">
              <MessageCircle className="h-4 w-4 text-green-600" />
              <span className="text-sm text-gray-600">{loading ? 'Loading...' : content.contactMessage}</span>
            </div>
          )}
          {content.contactEmail && (
            <div className="flex items-center space-x-2">
              <Mail className="h-4 w-4 text-blue-600" />
              <span className="text-sm text-gray-600">{loading ? 'Loading...' : content.contactEmail}</span>
            </div>
          )}
          {content.contactPhone && (
            <div className="flex items-center space-x-2">
              <Phone className="h-4 w-4 text-gray-600" />
              <span className="text-sm text-gray-600">{loading ? 'Loading...' : content.contactPhone}</span>
            </div>
          )}
        </div>
      </div>

      {/* Delivery Options Card */}
      <div className="bg-white border border-gray-200 rounded-lg p-4">
        <h3 className="font-semibold text-black text-lg mb-3">DELIVERY OPTIONS</h3>
        
        {/* Delivery Option */}
        <div className="mb-3">
          <button 
            onClick={() => setExpandedDelivery(!expandedDelivery)}
            className="w-full text-left flex items-center justify-between text-sm text-black hover:text-gray-600 transition-colors"
          >
            <span>Delivery</span>
            <ChevronDown className={`h-4 w-4 transition-transform ${expandedDelivery ? 'rotate-180' : ''}`} />
          </button>
          {expandedDelivery && (
            <div className="mt-2 ml-4 text-xs text-gray-600">
              {loading ? 'Loading...' : content.deliveryInfo}
            </div>
          )}
        </div>

        {/* Separator */}
        <div className="border-t border-gray-200 my-3"></div>

        {/* Pickup Option */}
        <div>
          <button 
            onClick={() => setExpandedPickup(!expandedPickup)}
            className="w-full text-left flex items-center justify-between text-sm text-black hover:text-gray-600 transition-colors"
          >
            <span>Pickup</span>
            <ChevronDown className={`h-4 w-4 transition-transform ${expandedPickup ? 'rotate-180' : ''}`} />
          </button>
          {expandedPickup && (
            <div className="mt-2 ml-4 text-xs text-gray-600">
              {loading ? 'Loading...' : content.pickupInfo}
            </div>
          )}
        </div>
      </div>

      {/* Categories Card */}
      <div className="bg-white border border-gray-200 rounded-lg p-4">
        <h3 className="font-semibold text-black text-lg mb-3">CATEGORIES</h3>
        <div className="space-y-2">
          {categories.map((category) => (
            <button
              key={category.id}
              onClick={() => onCategorySelect(category.id)}
              className={`w-full text-left text-sm transition-colors ${
                selectedCategory === category.id
                  ? 'bg-black text-white px-3 py-2 rounded'
                  : 'text-gray-600 hover:text-black'
              }`}
            >
              <span className="inline-flex items-center space-x-2">
                <span>{category.icon}</span>
                <span>{category.name}</span>
              </span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
