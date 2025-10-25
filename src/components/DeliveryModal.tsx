import React, { useState } from 'react';
import { X, ChevronDown, ChevronRight } from 'lucide-react';

interface DeliveryModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const DeliveryModal: React.FC<DeliveryModalProps> = ({ isOpen, onClose }) => {
  const [expandedDelivery, setExpandedDelivery] = useState(false);
  const [expandedPickup, setExpandedPickup] = useState(false);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg max-w-md w-full mx-4">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h2 className="text-xl font-bold text-black">DELIVERY OPTIONS</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-black transition-colors"
          >
            <X className="h-6 w-6" />
          </button>
        </div>

        {/* Delivery Options */}
        <div className="p-6">
          {/* Delivery Option */}
          <div className="border-b border-gray-200 pb-4 mb-4">
            <button
              onClick={() => setExpandedDelivery(!expandedDelivery)}
              className="w-full flex items-center justify-between py-2 hover:bg-gray-50 rounded-lg px-2 -mx-2"
            >
              <span className="text-black font-medium">Delivery</span>
              {expandedDelivery ? (
                <ChevronDown className="h-5 w-5 text-gray-600" />
              ) : (
                <ChevronRight className="h-5 w-5 text-gray-600" />
              )}
            </button>
            {expandedDelivery && (
              <div className="mt-2 pl-4">
                <p className="text-sm text-gray-600">Within bagong barrio</p>
              </div>
            )}
          </div>

          {/* Pickup Option */}
          <div>
            <button
              onClick={() => setExpandedPickup(!expandedPickup)}
              className="w-full flex items-center justify-between py-2 hover:bg-gray-50 rounded-lg px-2 -mx-2"
            >
              <span className="text-black font-medium">Pickup</span>
              {expandedPickup ? (
                <ChevronDown className="h-5 w-5 text-gray-600" />
              ) : (
                <ChevronRight className="h-5 w-5 text-gray-600" />
              )}
            </button>
            {expandedPickup && (
              <div className="mt-2 pl-4">
                <p className="text-sm text-gray-600">Pickup time: WE WILL CONTACT YOU ONCE YOUR ORDER IS DONE</p>
              </div>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="p-6 border-t border-gray-200">
          <button
            onClick={onClose}
            className="w-full py-2 px-4 bg-black text-white rounded-lg hover:bg-gray-800 transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default DeliveryModal;
