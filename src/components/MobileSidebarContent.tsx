import React, { useState } from 'react';
import { Phone, Mail, MessageCircle, ChevronDown, Info } from 'lucide-react';
import { useSidebarContent } from '../hooks/useSidebarContent';

interface MobileSidebarContentProps {
  selectedCategory: string;
  onCategorySelect: (category: string) => void;
}

const MobileSidebarContent: React.FC<MobileSidebarContentProps> = ({ selectedCategory, onCategorySelect }) => {
  const [expandedDelivery, setExpandedDelivery] = useState(false);
  const [expandedPickup, setExpandedPickup] = useState(false);
  const [showAboutUs, setShowAboutUs] = useState(false);
  const [showContact, setShowContact] = useState(false);
  const [showDeliveryOptions, setShowDeliveryOptions] = useState(false);
  const { content, loading } = useSidebarContent();
  
  const categories = [
    { id: 'grilledburger', name: 'GRILLEDBURGER', icon: '🍔' },
    { id: 'chickensandwich', name: 'CHICKENSANDWICH', icon: '🐔' },
    { id: 'pickapicka', name: 'PICKA-PICKA', icon: '🍗' },
    { id: 'drinks', name: 'DRINKS', icon: '🥤' },
    { id: 'addons', name: 'ADD ONS', icon: '➕' }
  ];

  return (
    <div className="lg:hidden bg-white border-b border-gray-200 px-4 py-3">
      <div className="flex flex-wrap gap-2">
        {/* About Us Button */}
        <button
          onClick={() => setShowAboutUs(!showAboutUs)}
          className="flex items-center space-x-2 bg-gray-100 hover:bg-gray-200 text-gray-700 px-3 py-2 rounded-lg transition-colors text-sm"
        >
          <Info className="h-4 w-4" />
          <span>About Us</span>
        </button>

        {/* Contact Button */}
        <button
          onClick={() => setShowContact(!showContact)}
          className="flex items-center space-x-2 bg-gray-100 hover:bg-gray-200 text-gray-700 px-3 py-2 rounded-lg transition-colors text-sm"
        >
          <Phone className="h-4 w-4" />
          <span>Contact</span>
        </button>

        {/* Delivery/Pickup Button */}
        <button
          onClick={() => setShowDeliveryOptions(!showDeliveryOptions)}
          className="flex items-center space-x-2 bg-gray-100 hover:bg-gray-200 text-gray-700 px-3 py-2 rounded-lg transition-colors text-sm"
        >
          <MessageCircle className="h-4 w-4" />
          <span>Delivery</span>
        </button>
      </div>

      {/* About Us Popup */}
      {showAboutUs && (
        <div className="mt-3 p-3 bg-gray-50 rounded-lg border border-gray-200">
          <div className="flex items-center justify-between mb-2">
            <h3 className="font-semibold text-black text-sm">ABOUT US</h3>
            <button onClick={() => setShowAboutUs(false)} className="text-gray-400 hover:text-gray-600">
              <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
          <p className="text-gray-600 text-xs">
            {loading ? 'Loading...' : content.aboutUs}
          </p>
        </div>
      )}

      {/* Contact Popup */}
      {showContact && (
        <div className="mt-3 p-3 bg-gray-50 rounded-lg border border-gray-200">
          <div className="flex items-center justify-between mb-2">
            <h3 className="font-semibold text-black text-sm">GET IN TOUCH</h3>
            <button onClick={() => setShowContact(false)} className="text-gray-400 hover:text-gray-600">
              <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
          <div className="space-y-1.5">
            {content.contactMessage && (
              <div className="flex items-center space-x-2">
                <MessageCircle className="h-3 w-3 text-green-600" />
                <span className="text-xs text-gray-600">{loading ? 'Loading...' : content.contactMessage}</span>
              </div>
            )}
            {content.contactEmail && (
              <div className="flex items-center space-x-2">
                <Mail className="h-3 w-3 text-blue-600" />
                <span className="text-xs text-gray-600">{loading ? 'Loading...' : content.contactEmail}</span>
              </div>
            )}
            {content.contactPhone && (
              <div className="flex items-center space-x-2">
                <Phone className="h-3 w-3 text-gray-600" />
                <span className="text-xs text-gray-600">{loading ? 'Loading...' : content.contactPhone}</span>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Delivery/Pickup Popup */}
      {showDeliveryOptions && (
        <div className="mt-3 p-3 bg-gray-50 rounded-lg border border-gray-200">
          <div className="flex items-center justify-between mb-2">
            <h3 className="font-semibold text-black text-sm">DELIVERY OPTIONS</h3>
            <button onClick={() => setShowDeliveryOptions(false)} className="text-gray-400 hover:text-gray-600">
              <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
          
          {/* Delivery */}
          <div className="mb-2">
            <button 
              onClick={() => setExpandedDelivery(!expandedDelivery)}
              className="w-full text-left flex items-center justify-between text-xs text-black"
            >
              <span className="font-medium">Delivery</span>
              <ChevronDown className={`h-3 w-3 transition-transform ${expandedDelivery ? 'rotate-180' : ''}`} />
            </button>
            {expandedDelivery && (
              <div className="mt-2 text-xs text-gray-600">
                {loading ? 'Loading...' : content.deliveryInfo}
              </div>
            )}
          </div>

          {/* Pickup */}
          <div className="border-t border-gray-200 pt-2">
            <button 
              onClick={() => setExpandedPickup(!expandedPickup)}
              className="w-full text-left flex items-center justify-between text-xs text-black"
            >
              <span className="font-medium">Pickup</span>
              <ChevronDown className={`h-3 w-3 transition-transform ${expandedPickup ? 'rotate-180' : ''}`} />
            </button>
            {expandedPickup && (
              <div className="mt-2 text-xs text-gray-600">
                {loading ? 'Loading...' : content.pickupInfo}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default MobileSidebarContent;
