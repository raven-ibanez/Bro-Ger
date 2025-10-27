import React, { useState } from 'react';
import { Plus, Edit, Trash2, Save, X, ArrowLeft, Truck } from 'lucide-react';
import { useServiceOptions } from '../hooks/useServiceOptions';
import { ServiceOption } from '../types';

interface ServiceOptionManagerProps {
  onBack: () => void;
}

const ServiceOptionManager: React.FC<ServiceOptionManagerProps> = ({ onBack }) => {
  const { serviceOptions, loading, fetchAll, addServiceOption, updateServiceOption, deleteServiceOption } = useServiceOptions();
  const [currentView, setCurrentView] = useState<'list' | 'add' | 'edit'>('list');
  const [editingOption, setEditingOption] = useState<ServiceOption | null>(null);
  const [formData, setFormData] = useState({
    id: '',
    name: '',
    icon: '',
    description: '',
    active: true,
    sort_order: 0
  });

  React.useEffect(() => {
    fetchAll();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleAddOption = () => {
    const nextSortOrder = Math.max(...serviceOptions.map(o => o.sort_order), 0) + 1;
    setFormData({
      id: '',
      name: '',
      icon: '',
      description: '',
      active: true,
      sort_order: nextSortOrder
    });
    setCurrentView('add');
  };

  const handleEditOption = (option: ServiceOption) => {
    setEditingOption(option);
    setFormData({
      id: option.id,
      name: option.name,
      icon: option.icon,
      description: option.description || '',
      active: option.active,
      sort_order: option.sort_order
    });
    setCurrentView('edit');
  };

  const handleDeleteOption = async (id: string) => {
    if (confirm('Are you sure you want to delete this service option?')) {
      try {
        await deleteServiceOption(id);
      } catch (error) {
        alert(error instanceof Error ? error.message : 'Failed to delete service option');
      }
    }
  };

  const handleSaveOption = async () => {
    if (!formData.name || !formData.icon) {
      alert('Please fill in all required fields');
      return;
    }

    try {
      if (editingOption) {
        await updateServiceOption(editingOption.id, formData);
      } else {
        await addServiceOption(formData);
      }
      setCurrentView('list');
      setEditingOption(null);
    } catch (error) {
      alert(error instanceof Error ? error.message : 'Failed to save service option');
    }
  };

  const handleCancel = () => {
    setCurrentView('list');
    setEditingOption(null);
  };

  const generateIdFromName = (name: string) => {
    return name
      .toLowerCase()
      .replace(/[^a-z0-9\s-]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-')
      .trim();
  };

  const handleNameChange = (name: string) => {
    setFormData({
      ...formData,
      name,
      id: currentView === 'add' ? generateIdFromName(name) : formData.id
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-black mx-auto mb-4"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  // Form View (Add/Edit)
  if (currentView === 'add' || currentView === 'edit') {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="bg-white shadow-sm border-b">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between h-16">
              <div className="flex items-center space-x-4">
                <button
                  onClick={handleCancel}
                  className="flex items-center space-x-2 text-gray-600 hover:text-black transition-colors duration-200"
                >
                  <ArrowLeft className="h-5 w-5" />
                  <span>Back</span>
                </button>
                <h1 className="text-2xl font-playfair font-semibold text-black">
                  {currentView === 'add' ? 'Add Service Option' : 'Edit Service Option'}
                </h1>
              </div>
              <div className="flex space-x-3">
                <button
                  onClick={handleCancel}
                  className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors duration-200 flex items-center space-x-2"
                >
                  <X className="h-4 w-4" />
                  <span>Cancel</span>
                </button>
                <button
                  onClick={handleSaveOption}
                  className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors duration-200 flex items-center space-x-2"
                >
                  <Save className="h-4 w-4" />
                  <span>Save</span>
                </button>
              </div>
            </div>
          </div>
        </div>

        <div className="max-w-2xl mx-auto px-4 py-8">
          <div className="bg-white rounded-xl shadow-sm p-8">
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-black mb-2">Service Name *</label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => handleNameChange(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  placeholder="e.g., Pickup, Delivery, In House Delivery"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-black mb-2">Option ID *</label>
                <input
                  type="text"
                  value={formData.id}
                  onChange={(e) => setFormData({ ...formData, id: e.target.value })}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  placeholder="kebab-case-id"
                  disabled={currentView === 'edit'}
                />
                <p className="text-xs text-gray-500 mt-1">
                  {currentView === 'edit' 
                    ? 'Option ID cannot be changed after creation'
                    : 'Use kebab-case format (e.g., "pickup", "in-house-delivery")'
                  }
                </p>
              </div>

              <div>
                <label className="block text-sm font-medium text-black mb-2">Icon *</label>
                <input
                  type="text"
                  value={formData.icon}
                  onChange={(e) => setFormData({ ...formData, icon: e.target.value })}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  placeholder="e.g., 🚶, 🛵, 🏠"
                />
                <p className="text-xs text-gray-500 mt-1">
                  Enter an emoji or text
                </p>
              </div>

              <div>
                <label className="block text-sm font-medium text-black mb-2">Description</label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  placeholder="Optional description for the service"
                  rows={3}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-black mb-2">Sort Order</label>
                <input
                  type="number"
                  value={formData.sort_order}
                  onChange={(e) => setFormData({ ...formData, sort_order: Number(e.target.value) })}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  placeholder="0"
                />
                <p className="text-xs text-gray-500 mt-1">
                  Lower numbers appear first in the checkout
                </p>
              </div>

              <div className="flex items-center">
                <label className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    checked={formData.active}
                    onChange={(e) => setFormData({ ...formData, active: e.target.checked })}
                    className="rounded border-gray-300 text-green-600 focus:ring-green-500"
                  />
                  <span className="text-sm font-medium text-black">Active Service Option</span>
                </label>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // List View
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
                <span>Dashboard</span>
              </button>
              <h1 className="text-2xl font-playfair font-semibold text-black">Service Options</h1>
            </div>
            <button
              onClick={handleAddOption}
              className="flex items-center space-x-2 bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors duration-200"
            >
              <Plus className="h-4 w-4" />
              <span>Add Service Option</span>
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="bg-white rounded-xl shadow-sm overflow-hidden">
          <div className="p-6">
            <h2 className="text-lg font-playfair font-medium text-black mb-4">Service Options</h2>
            
            {serviceOptions.length === 0 ? (
              <div className="text-center py-8">
                <Truck className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-500 mb-4">No service options found</p>
                <button
                  onClick={handleAddOption}
                  className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors duration-200"
                >
                  Add First Service Option
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {serviceOptions.map((option) => (
                  <div
                    key={option.id}
                    className="relative p-6 border-2 border-gray-200 rounded-lg hover:border-gray-300 transition-all duration-200 bg-white"
                  >
                    <div className="text-center mb-4">
                      <div className="text-5xl mb-3">{option.icon}</div>
                      <h3 className="font-semibold text-black text-lg">{option.name}</h3>
                      {option.description && (
                        <p className="text-sm text-gray-600 mt-2">{option.description}</p>
                      )}
                    </div>
                    
                    <div className="flex items-center justify-between pt-4 border-t border-gray-200">
                      <div className="flex items-center gap-2">
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                          option.active 
                            ? 'bg-green-100 text-green-800' 
                            : 'bg-red-100 text-red-800'
                        }`}>
                          {option.active ? 'Active' : 'Inactive'}
                        </span>
                        <span className="text-xs text-gray-500">#{option.sort_order}</span>
                      </div>
                      
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => handleEditOption(option)}
                          className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded transition-colors duration-200"
                        >
                          <Edit className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => handleDeleteOption(option.id)}
                          className="p-2 text-red-400 hover:text-red-600 hover:bg-red-50 rounded transition-colors duration-200"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ServiceOptionManager;