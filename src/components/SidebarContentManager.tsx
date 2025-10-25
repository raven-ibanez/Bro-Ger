import React, { useState, useEffect } from 'react';
import { Save, ArrowLeft, MessageCircle, Mail, Phone, Truck, Package } from 'lucide-react';
import { supabase } from '../lib/supabase';

interface SidebarContent {
  aboutUs: string;
  contactPhone: string;
  contactEmail: string;
  contactMessage: string;
  deliveryInfo: string;
  pickupInfo: string;
}

interface SidebarContentManagerProps {
  onBack: () => void;
}

const SidebarContentManager: React.FC<SidebarContentManagerProps> = ({ onBack }) => {
  const [content, setContent] = useState<SidebarContent>({
    aboutUs: '',
    contactPhone: '',
    contactEmail: '',
    contactMessage: '',
    deliveryInfo: '',
    pickupInfo: ''
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    fetchSidebarContent();
  }, []);

  const fetchSidebarContent = async () => {
    try {
      setLoading(true);
      setError(null);

      const { data, error } = await supabase
        .from('site_settings')
        .select('*')
        .in('id', [
          'sidebar_about_us',
          'sidebar_contact_phone',
          'sidebar_contact_email',
          'sidebar_contact_message',
          'sidebar_delivery_info',
          'sidebar_pickup_info'
        ]);

      if (error) throw error;

      const settings: SidebarContent = {
        aboutUs: data.find(s => s.id === 'sidebar_about_us')?.value || '',
        contactPhone: data.find(s => s.id === 'sidebar_contact_phone')?.value || '',
        contactEmail: data.find(s => s.id === 'sidebar_contact_email')?.value || '',
        contactMessage: data.find(s => s.id === 'sidebar_contact_message')?.value || '',
        deliveryInfo: data.find(s => s.id === 'sidebar_delivery_info')?.value || '',
        pickupInfo: data.find(s => s.id === 'sidebar_pickup_info')?.value || ''
      };

      setContent(settings);
    } catch (err) {
      console.error('Error fetching sidebar content:', err);
      setError(err instanceof Error ? err.message : 'Failed to fetch sidebar content');
    } finally {
      setLoading(false);
    }
  };

  const saveSidebarContent = async () => {
    try {
      setSaving(true);
      setError(null);
      setSuccess(false);

      // Update or insert each setting
      const settings = [
        { id: 'sidebar_about_us', value: content.aboutUs, type: 'text', description: 'About Us section content' },
        { id: 'sidebar_contact_phone', value: content.contactPhone, type: 'text', description: 'Contact phone number' },
        { id: 'sidebar_contact_email', value: content.contactEmail, type: 'text', description: 'Contact email address' },
        { id: 'sidebar_contact_message', value: content.contactMessage, type: 'text', description: 'Contact message/WhatsApp number' },
        { id: 'sidebar_delivery_info', value: content.deliveryInfo, type: 'text', description: 'Delivery information' },
        { id: 'sidebar_pickup_info', value: content.pickupInfo, type: 'text', description: 'Pickup information' }
      ];

      for (const setting of settings) {
        const { error } = await supabase
          .from('site_settings')
          .upsert(setting);

        if (error) throw error;
      }

      setSuccess(true);
      setTimeout(() => setSuccess(false), 3000);
    } catch (err) {
      console.error('Error saving sidebar content:', err);
      setError(err instanceof Error ? err.message : 'Failed to save sidebar content');
    } finally {
      setSaving(false);
    }
  };

  const handleInputChange = (field: keyof SidebarContent, value: string) => {
    setContent(prev => ({ ...prev, [field]: value }));
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-black mx-auto mb-4"></div>
          <p className="text-gray-600">Loading sidebar content...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-4">
              <button
                onClick={onBack}
                className="flex items-center space-x-2 text-gray-600 hover:text-black transition-colors duration-200"
              >
                <ArrowLeft className="h-5 w-5" />
                <span>Back</span>
              </button>
              <h1 className="text-2xl font-playfair font-semibold text-black">Sidebar Content</h1>
            </div>
            <button
              onClick={saveSidebarContent}
              disabled={saving}
              className="flex items-center space-x-2 bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Save className="h-4 w-4" />
              <span>{saving ? 'Saving...' : 'Save Changes'}</span>
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 py-8">
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
            <p className="text-red-600">{error}</p>
          </div>
        )}

        {success && (
          <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-6">
            <p className="text-green-600">Sidebar content saved successfully!</p>
          </div>
        )}

        <div className="bg-white rounded-xl shadow-sm p-8">
          {/* About Us Section */}
          <div className="mb-8">
            <h3 className="text-lg font-playfair font-medium text-black mb-4 flex items-center">
              <MessageCircle className="h-5 w-5 mr-2" />
              About Us
            </h3>
            <div>
              <label className="block text-sm font-medium text-black mb-2">About Us Content</label>
              <textarea
                value={content.aboutUs}
                onChange={(e) => handleInputChange('aboutUs', e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                placeholder="Enter about us content..."
                rows={3}
              />
            </div>
          </div>

          {/* Contact Information Section */}
          <div className="mb-8">
            <h3 className="text-lg font-playfair font-medium text-black mb-4 flex items-center">
              <Phone className="h-5 w-5 mr-2" />
              Contact Information
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-black mb-2">Phone Number</label>
                <input
                  type="text"
                  value={content.contactPhone}
                  onChange={(e) => handleInputChange('contactPhone', e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  placeholder="+639171102916"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-black mb-2">Email Address</label>
                <input
                  type="email"
                  value={content.contactEmail}
                  onChange={(e) => handleInputChange('contactEmail', e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  placeholder="brogerphilippines@gmail.com"
                />
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-black mb-2">Message/WhatsApp Number</label>
                <input
                  type="text"
                  value={content.contactMessage}
                  onChange={(e) => handleInputChange('contactMessage', e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  placeholder="+63"
                />
              </div>
            </div>
          </div>

          {/* Delivery Options Section */}
          <div className="mb-8">
            <h3 className="text-lg font-playfair font-medium text-black mb-4 flex items-center">
              <Truck className="h-5 w-5 mr-2" />
              Delivery Options
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-black mb-2">Delivery Information</label>
                <textarea
                  value={content.deliveryInfo}
                  onChange={(e) => handleInputChange('deliveryInfo', e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  placeholder="Within bagong barrio"
                  rows={2}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-black mb-2">Pickup Information</label>
                <textarea
                  value={content.pickupInfo}
                  onChange={(e) => handleInputChange('pickupInfo', e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  placeholder="Pickup time: WE WILL CONTACT YOU ONCE YOUR ORDER IS DONE"
                  rows={2}
                />
              </div>
            </div>
          </div>

          {/* Preview Section */}
          <div className="border-t border-gray-200 pt-8">
            <h3 className="text-lg font-playfair font-medium text-black mb-4">Preview</h3>
            <div className="bg-gray-50 rounded-lg p-6">
              <div className="space-y-4">
                {/* About Us Preview */}
                {content.aboutUs && (
                  <div className="bg-white border border-gray-200 rounded-lg p-4">
                    <h4 className="font-semibold text-black text-lg mb-2">ABOUT US</h4>
                    <p className="text-gray-600 text-sm">{content.aboutUs}</p>
                  </div>
                )}

                {/* Contact Preview */}
                {(content.contactPhone || content.contactEmail || content.contactMessage) && (
                  <div className="bg-white border border-gray-200 rounded-lg p-4">
                    <h4 className="font-semibold text-black text-lg mb-3">GET IN TOUCH</h4>
                    <div className="space-y-2">
                      {content.contactMessage && (
                        <div className="flex items-center space-x-2">
                          <MessageCircle className="h-4 w-4 text-green-600" />
                          <span className="text-sm text-gray-600">{content.contactMessage}</span>
                        </div>
                      )}
                      {content.contactEmail && (
                        <div className="flex items-center space-x-2">
                          <Mail className="h-4 w-4 text-blue-600" />
                          <span className="text-sm text-gray-600">{content.contactEmail}</span>
                        </div>
                      )}
                      {content.contactPhone && (
                        <div className="flex items-center space-x-2">
                          <Phone className="h-4 w-4 text-gray-600" />
                          <span className="text-sm text-gray-600">{content.contactPhone}</span>
                        </div>
                      )}
                    </div>
                  </div>
                )}

                {/* Delivery Options Preview */}
                {(content.deliveryInfo || content.pickupInfo) && (
                  <div className="bg-white border border-gray-200 rounded-lg p-4">
                    <h4 className="font-semibold text-black text-lg mb-3">DELIVERY OPTIONS</h4>
                    {content.deliveryInfo && (
                      <div className="mb-3">
                        <div className="text-sm text-black">Delivery</div>
                        <div className="mt-1 ml-4 text-xs text-gray-600">{content.deliveryInfo}</div>
                      </div>
                    )}
                    {content.pickupInfo && (
                      <div>
                        <div className="text-sm text-black">Pickup</div>
                        <div className="mt-1 ml-4 text-xs text-gray-600">{content.pickupInfo}</div>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SidebarContentManager;

