import React, { useState } from 'react';
import { Star, Edit, Trash2, Check, X, Eye, EyeOff, ArrowLeft, MessageSquare, TrendingUp, Users, StarIcon, Image as ImageIcon } from 'lucide-react';
import { useReviews } from '../hooks/useReviews';
import { Review } from '../types';

interface ReviewManagerProps {
  onBack: () => void;
}

const ReviewManager: React.FC<ReviewManagerProps> = ({ onBack }) => {
  const {
    reviews,
    loading,
    error,
    deleteReview,
    approveReview,
    unapproveReview,
    featureReview,
    unfeatureReview,
    getFeaturedReviews,
    getApprovedReviews,
    getPendingReviews,
    getAverageRating
  } = useReviews();

  const [selectedReview, setSelectedReview] = useState<Review | null>(null);
  const [showReviewModal, setShowReviewModal] = useState(false);
  const [filter, setFilter] = useState<'all' | 'approved' | 'pending' | 'featured'>('all');

  const handleDeleteReview = async (id: string) => {
    if (confirm('Are you sure you want to delete this review? This action cannot be undone.')) {
      try {
        await deleteReview(id);
      } catch (error) {
        alert('Failed to delete review. Please try again.');
      }
    }
  };

  const handleApproveReview = async (id: string) => {
    try {
      await approveReview(id);
    } catch (error) {
      alert('Failed to approve review. Please try again.');
    }
  };

  const handleUnapproveReview = async (id: string) => {
    try {
      await unapproveReview(id);
    } catch (error) {
      alert('Failed to unapprove review. Please try again.');
    }
  };

  const handleFeatureReview = async (id: string) => {
    try {
      await featureReview(id);
    } catch (error) {
      alert('Failed to feature review. Please try again.');
    }
  };

  const handleUnfeatureReview = async (id: string) => {
    try {
      await unfeatureReview(id);
    } catch (error) {
      alert('Failed to unfeature review. Please try again.');
    }
  };

  const handleViewReview = (review: Review) => {
    setSelectedReview(review);
    setShowReviewModal(true);
  };

  const getFilteredReviews = () => {
    switch (filter) {
      case 'approved':
        return getApprovedReviews();
      case 'pending':
        return getPendingReviews();
      case 'featured':
        return getFeaturedReviews();
      default:
        return reviews;
    }
  };

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star
        key={i}
        className={`h-4 w-4 ${
          i < rating ? 'text-yellow-400 fill-current' : 'text-gray-300'
        }`}
      />
    ));
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-black mx-auto mb-4"></div>
          <p className="text-gray-600">Loading reviews...</p>
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
              <h1 className="text-2xl font-playfair font-semibold text-black">Review Management</h1>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8">
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
            <p className="text-red-600">{error}</p>
          </div>
        )}

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-xl shadow-sm p-6">
            <div className="flex items-center">
              <div className="p-2 bg-blue-600 rounded-lg">
                <MessageSquare className="h-6 w-6 text-white" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Total Reviews</p>
                <p className="text-2xl font-semibold text-gray-900">{reviews.length}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm p-6">
            <div className="flex items-center">
              <div className="p-2 bg-green-600 rounded-lg">
                <Check className="h-6 w-6 text-white" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Approved</p>
                <p className="text-2xl font-semibold text-gray-900">{getApprovedReviews().length}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm p-6">
            <div className="flex items-center">
              <div className="p-2 bg-yellow-600 rounded-lg">
                <Eye className="h-6 w-6 text-white" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Pending</p>
                <p className="text-2xl font-semibold text-gray-900">{getPendingReviews().length}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm p-6">
            <div className="flex items-center">
              <div className="p-2 bg-purple-600 rounded-lg">
                <StarIcon className="h-6 w-6 text-white" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Average Rating</p>
                <p className="text-2xl font-semibold text-gray-900">{getAverageRating()}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Filter Tabs */}
        <div className="bg-white rounded-xl shadow-sm mb-6">
          <div className="border-b border-gray-200">
            <nav className="flex space-x-8 px-6">
              {[
                { key: 'all', label: 'All Reviews', count: reviews.length },
                { key: 'approved', label: 'Approved', count: getApprovedReviews().length },
                { key: 'pending', label: 'Pending', count: getPendingReviews().length },
                { key: 'featured', label: 'Featured', count: getFeaturedReviews().length }
              ].map((tab) => (
                <button
                  key={tab.key}
                  onClick={() => setFilter(tab.key as any)}
                  className={`py-4 px-1 border-b-2 font-medium text-sm ${
                    filter === tab.key
                      ? 'border-black text-black'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  {tab.label} ({tab.count})
                </button>
              ))}
            </nav>
          </div>
        </div>

        {/* Reviews List */}
        <div className="bg-white rounded-xl shadow-sm overflow-hidden">
          {getFilteredReviews().length === 0 ? (
            <div className="text-center py-12">
              <MessageSquare className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No reviews found</h3>
              <p className="text-gray-500">
                {filter === 'all' 
                  ? 'No reviews have been submitted yet.'
                  : `No ${filter} reviews found.`
                }
              </p>
            </div>
          ) : (
            <div className="divide-y divide-gray-200">
              {getFilteredReviews().map((review) => (
                <div key={review.id} className="p-6 hover:bg-gray-50">
                  <div className="flex items-start justify-between">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center space-x-3 mb-2">
                        <h3 className="text-lg font-medium text-gray-900 truncate">
                          {review.title}
                        </h3>
                        <div className="flex items-center space-x-1">
                          {renderStars(review.rating)}
                        </div>
                        {review.featured && (
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-purple-100 text-purple-800">
                            Featured
                          </span>
                        )}
                        {review.approved ? (
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                            Approved
                          </span>
                        ) : (
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                            Pending
                          </span>
                        )}
                      </div>
                      
                      <p className="text-gray-600 mb-3 line-clamp-2">{review.content}</p>
                      
                      {/* Review Images */}
                      {review.images && review.images.length > 0 && (
                        <div className="flex items-center space-x-2 mb-3">
                          <div className="flex items-center space-x-2">
                            <ImageIcon className="h-4 w-4 text-gray-400" />
                            <span className="text-sm text-gray-500">
                              {review.images.length} photo{review.images.length > 1 ? 's' : ''}
                            </span>
                          </div>
                        </div>
                      )}
                      
                      <div className="flex items-center space-x-4 text-sm text-gray-500">
                        <span>By {review.customer_name}</span>
                        <span>•</span>
                        <span>{formatDate(review.created_at)}</span>
                        {review.customer_email && (
                          <>
                            <span>•</span>
                            <span>{review.customer_email}</span>
                          </>
                        )}
                      </div>
                    </div>
                    
                    <div className="flex items-center space-x-2 ml-4">
                      <button
                        onClick={() => handleViewReview(review)}
                        className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded transition-colors duration-200"
                        title="View Review"
                      >
                        <Eye className="h-4 w-4" />
                      </button>
                      
                      {review.approved ? (
                        <button
                          onClick={() => handleUnapproveReview(review.id)}
                          className="p-2 text-green-400 hover:text-green-600 hover:bg-green-50 rounded transition-colors duration-200"
                          title="Unapprove Review"
                        >
                          <EyeOff className="h-4 w-4" />
                        </button>
                      ) : (
                        <button
                          onClick={() => handleApproveReview(review.id)}
                          className="p-2 text-yellow-400 hover:text-yellow-600 hover:bg-yellow-50 rounded transition-colors duration-200"
                          title="Approve Review"
                        >
                          <Check className="h-4 w-4" />
                        </button>
                      )}
                      
                      {review.featured ? (
                        <button
                          onClick={() => handleUnfeatureReview(review.id)}
                          className="p-2 text-purple-400 hover:text-purple-600 hover:bg-purple-50 rounded transition-colors duration-200"
                          title="Remove from Featured"
                        >
                          <Star className="h-4 w-4" />
                        </button>
                      ) : (
                        <button
                          onClick={() => handleFeatureReview(review.id)}
                          className="p-2 text-gray-400 hover:text-purple-600 hover:bg-purple-50 rounded transition-colors duration-200"
                          title="Feature Review"
                        >
                          <Star className="h-4 w-4" />
                        </button>
                      )}
                      
                      <button
                        onClick={() => handleDeleteReview(review.id)}
                        className="p-2 text-red-400 hover:text-red-600 hover:bg-red-50 rounded transition-colors duration-200"
                        title="Delete Review"
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

      {/* Review Modal */}
      {showReviewModal && selectedReview && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-semibold text-gray-900">Review Details</h2>
                <button
                  onClick={() => setShowReviewModal(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <X className="h-6 w-6" />
                </button>
              </div>
              
              <div className="space-y-4">
                <div>
                  <h3 className="text-lg font-medium text-gray-900 mb-2">{selectedReview.title}</h3>
                  <div className="flex items-center space-x-2 mb-2">
                    {renderStars(selectedReview.rating)}
                    <span className="text-sm text-gray-500">({selectedReview.rating}/5)</span>
                  </div>
                </div>
                
                <div>
                  <p className="text-gray-700">{selectedReview.content}</p>
                </div>
                
                {/* Review Images */}
                {selectedReview.images && selectedReview.images.length > 0 && (
                  <div>
                    <h4 className="text-sm font-medium text-gray-900 mb-2 flex items-center">
                      <ImageIcon className="h-4 w-4 mr-2" />
                      Customer Photos ({selectedReview.images.length})
                    </h4>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                      {selectedReview.images.map((imageUrl, index) => (
                        <img
                          key={index}
                          src={imageUrl}
                          alt={`Review photo ${index + 1}`}
                          className="w-full h-32 object-cover rounded-lg border border-gray-200 cursor-pointer hover:opacity-90 transition-opacity"
                          onClick={() => window.open(imageUrl, '_blank')}
                        />
                      ))}
                    </div>
                  </div>
                )}
                
                <div className="border-t border-gray-200 pt-4">
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <span className="font-medium text-gray-900">Customer:</span>
                      <span className="ml-2 text-gray-600">{selectedReview.customer_name}</span>
                    </div>
                    <div>
                      <span className="font-medium text-gray-900">Email:</span>
                      <span className="ml-2 text-gray-600">{selectedReview.customer_email || 'Not provided'}</span>
                    </div>
                    <div>
                      <span className="font-medium text-gray-900">Date:</span>
                      <span className="ml-2 text-gray-600">{formatDate(selectedReview.created_at)}</span>
                    </div>
                    <div>
                      <span className="font-medium text-gray-900">Status:</span>
                      <span className={`ml-2 ${
                        selectedReview.approved ? 'text-green-600' : 'text-yellow-600'
                      }`}>
                        {selectedReview.approved ? 'Approved' : 'Pending'}
                      </span>
                    </div>
                    {selectedReview.images && selectedReview.images.length > 0 && (
                      <div>
                        <span className="font-medium text-gray-900">Photos:</span>
                        <span className="ml-2 text-gray-600">{selectedReview.images.length} image{selectedReview.images.length > 1 ? 's' : ''}</span>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ReviewManager;

