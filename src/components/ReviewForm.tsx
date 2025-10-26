import React, { useState } from 'react';
import { Star, Send, CheckCircle, AlertCircle } from 'lucide-react';
import { useReviews } from '../hooks/useReviews';
import { ReviewFormData } from '../types';
import ReviewImageUpload from './ReviewImageUpload';

interface ReviewFormProps {
  onClose?: () => void;
}

const ReviewForm: React.FC<ReviewFormProps> = ({ onClose }) => {
  const { addReview } = useReviews();
  const [formData, setFormData] = useState<ReviewFormData>({
    customer_name: '',
    customer_email: '',
    rating: 5,
    title: '',
    content: '',
    images: []
  });
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleInputChange = (field: keyof ReviewFormData, value: string | number | string[]) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.customer_name || !formData.title || !formData.content) {
      setError('Please fill in all required fields');
      return;
    }

    try {
      setSubmitting(true);
      setError(null);
      
      await addReview(formData);
      setSubmitted(true);
      
      // Reset form
      setFormData({
        customer_name: '',
        customer_email: '',
        rating: 5,
        title: '',
        content: '',
        images: []
      });
    } catch (err) {
      setError('Failed to submit review. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  const renderStars = (rating: number, interactive: boolean = false) => {
    return Array.from({ length: 5 }, (_, i) => (
      <button
        key={i}
        type="button"
        onClick={() => interactive && handleInputChange('rating', i + 1)}
        className={`${
          interactive ? 'hover:text-yellow-400 cursor-pointer' : 'cursor-default'
        } transition-colors duration-200`}
        disabled={!interactive}
      >
        <Star
          className={`h-6 w-6 ${
            i < rating ? 'text-yellow-400 fill-current' : 'text-gray-300'
          }`}
        />
      </button>
    ));
  };

  if (submitted) {
    return (
      <div className="bg-white rounded-xl shadow-sm p-8 text-center">
        <CheckCircle className="h-16 w-16 text-green-500 mx-auto mb-4" />
        <h3 className="text-xl font-semibold text-gray-900 mb-2">Thank You!</h3>
        <p className="text-gray-600 mb-6">
          Your review has been submitted and will be reviewed before being published.
        </p>
        {onClose && (
          <button
            onClick={onClose}
            className="bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-green-700 transition-colors duration-200"
          >
            Close
          </button>
        )}
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl shadow-sm p-8">
      <div className="text-center mb-6">
        <h2 className="text-2xl font-playfair font-semibold text-black mb-2">Share Your Experience</h2>
        <p className="text-gray-600">We'd love to hear about your visit!</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 flex items-center space-x-2">
            <AlertCircle className="h-5 w-5 text-red-500" />
            <p className="text-red-600">{error}</p>
          </div>
        )}

        {/* Rating */}
        <div>
          <label className="block text-sm font-medium text-black mb-3">Rating *</label>
          <div className="flex items-center space-x-1">
            {renderStars(formData.rating, true)}
            <span className="ml-2 text-sm text-gray-600">({formData.rating}/5)</span>
          </div>
        </div>

        {/* Customer Name */}
        <div>
          <label className="block text-sm font-medium text-black mb-2">Your Name *</label>
          <input
            type="text"
            value={formData.customer_name}
            onChange={(e) => handleInputChange('customer_name', e.target.value)}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
            placeholder="Enter your name"
            required
          />
        </div>

        {/* Customer Email */}
        <div>
          <label className="block text-sm font-medium text-black mb-2">Email (Optional)</label>
          <input
            type="email"
            value={formData.customer_email}
            onChange={(e) => handleInputChange('customer_email', e.target.value)}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
            placeholder="Enter your email"
          />
        </div>

        {/* Review Title */}
        <div>
          <label className="block text-sm font-medium text-black mb-2">Review Title *</label>
          <input
            type="text"
            value={formData.title}
            onChange={(e) => handleInputChange('title', e.target.value)}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
            placeholder="Give your review a title"
            required
          />
        </div>

        {/* Review Content */}
        <div>
          <label className="block text-sm font-medium text-black mb-2">Your Review *</label>
          <textarea
            value={formData.content}
            onChange={(e) => handleInputChange('content', e.target.value)}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
            placeholder="Tell us about your experience..."
            rows={4}
            required
          />
        </div>

        {/* Image Upload */}
        <ReviewImageUpload
          currentImages={formData.images || []}
          onImagesChange={(images) => setFormData(prev => ({ ...prev, images }))}
          maxImages={5}
        />

        {/* Submit Button */}
        <div className="flex items-center justify-end space-x-3">
          {onClose && (
            <button
              type="button"
              onClick={onClose}
              className="px-6 py-3 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors duration-200"
            >
              Cancel
            </button>
          )}
          <button
            type="submit"
            disabled={submitting}
            className="flex items-center space-x-2 bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700 transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {submitting ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                <span>Submitting...</span>
              </>
            ) : (
              <>
                <Send className="h-4 w-4" />
                <span>Submit Review</span>
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
};

export default ReviewForm;



