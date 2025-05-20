
import React, { useState, useEffect } from 'react';
import { Star, Trash } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/contexts/AuthContext';
import { getProductReviews, submitProductReview, deleteProductReview } from '@/services/productService';

interface ProductReviewsProps {
  productId: string;
  onReviewsUpdated: () => void;
}

interface Review {
  id: string;
  rating: number;
  comment: string;
  date: Date;
  user: {
    name: string;
    avatar: string | null;
  };
  userId?: string;
}

const ProductReviews = ({ productId, onReviewsUpdated }: ProductReviewsProps) => {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [userRating, setUserRating] = useState(5);
  const [reviewText, setReviewText] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isDeleting, setIsDeleting] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();
  const { user, isAuthenticated } = useAuth();

  const loadReviews = async () => {
    try {
      setLoading(true);
      const productReviews = await getProductReviews(productId);
      
      // Add userId to reviews for current user's reviews
      const enhancedReviews = productReviews.map(review => {
        // Get user_id from the database response if available
        const userId = (review as any).user_id;
        return {
          ...review,
          userId
        };
      });
      
      setReviews(enhancedReviews);
    } catch (error) {
      console.error('Error loading reviews:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadReviews();
  }, [productId]);

  const handleRatingChange = (rating: number) => {
    setUserRating(rating);
  };

  const handleSubmitReview = async () => {
    if (!isAuthenticated || !user) {
      toast({
        title: "Authentication Required",
        description: "Please sign in to leave a review.",
        variant: "destructive",
      });
      return;
    }

    if (userRating === 0) {
      toast({
        title: "Rating Required",
        description: "Please select a star rating.",
        variant: "destructive",
      });
      return;
    }

    if (!reviewText.trim()) {
      toast({
        title: "Review Required",
        description: "Please enter your review comments.",
        variant: "destructive",
      });
      return;
    }

    try {
      setIsSubmitting(true);
      await submitProductReview(user.id, productId, userRating, reviewText);
      
      toast({
        title: "Review Submitted",
        description: "Thank you for your feedback!",
      });
      
      // Clear form
      setUserRating(5);
      setReviewText('');
      
      // Reload reviews and update product rating
      await loadReviews();
      onReviewsUpdated();
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to submit review.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteReview = async (reviewId: string) => {
    if (!isAuthenticated || !user) {
      toast({
        title: "Authentication Required",
        description: "Please sign in to delete a review.",
        variant: "destructive",
      });
      return;
    }

    try {
      setIsDeleting(reviewId);
      await deleteProductReview(reviewId);
      
      toast({
        title: "Review Deleted",
        description: "Your review has been removed.",
      });
      
      // Reload reviews and update product rating
      await loadReviews();
      onReviewsUpdated();
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to delete review.",
        variant: "destructive",
      });
    } finally {
      setIsDeleting(null);
    }
  };

  const getAverageRating = () => {
    if (reviews.length === 0) return 0;
    const total = reviews.reduce((sum, review) => sum + review.rating, 0);
    return total / reviews.length;
  };

  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    }).format(date);
  };

  const userHasReview = user && reviews.some(review => review.userId === user.id);

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <div className="flex">
          {[...Array(5)].map((_, i) => (
            <Star
              key={i}
              className={`h-5 w-5 ${
                i < Math.round(getAverageRating())
                  ? 'text-amber-400 fill-amber-400'
                  : 'text-gray-300'
              }`}
            />
          ))}
        </div>
        <span className="text-xl font-medium">{getAverageRating().toFixed(1)}</span>
        <span className="text-gray-500">Based on {reviews.length} {reviews.length === 1 ? 'review' : 'reviews'}</span>
      </div>
      
      {isAuthenticated && !userHasReview && (
        <div className="border rounded-lg p-6 bg-gray-50">
          <h3 className="font-semibold mb-4">Write a Review</h3>
          <div className="mb-4">
            <div className="flex items-center gap-1">
              <div className="flex">
                {[...Array(5)].map((_, i) => (
                  <button
                    key={i}
                    type="button"
                    onClick={() => handleRatingChange(i + 1)}
                    className="focus:outline-none"
                  >
                    <Star
                      className={`h-6 w-6 transition-colors ${
                        i < userRating ? 'text-amber-400 fill-amber-400' : 'text-gray-300'
                      }`}
                    />
                  </button>
                ))}
              </div>
              <span className="ml-2 text-sm text-gray-500">
                {userRating === 1 ? 'Poor' : 
                  userRating === 2 ? 'Fair' :
                  userRating === 3 ? 'Good' :
                  userRating === 4 ? 'Very Good' : 'Excellent'}
              </span>
            </div>
          </div>
          <div className="mb-4">
            <Textarea
              placeholder="Share your thoughts about this product..."
              className="min-h-[100px]"
              value={reviewText}
              onChange={(e) => setReviewText(e.target.value)}
            />
          </div>
          <Button 
            onClick={handleSubmitReview}
            disabled={isSubmitting}
            className="bg-sage-600 hover:bg-sage-700"
          >
            {isSubmitting ? "Submitting..." : "Submit Review"}
          </Button>
        </div>
      )}

      {!isAuthenticated && (
        <div className="text-center py-4 border rounded-lg bg-gray-50">
          <p className="text-gray-600">Please <a href="/auth" className="text-sage-600 font-medium">sign in</a> to leave a review.</p>
        </div>
      )}
      
      <div className="border-t pt-6">
        {loading ? (
          <div className="space-y-4 animate-pulse">
            {[...Array(2)].map((_, i) => (
              <div key={i} className="p-4 border rounded-lg">
                <div className="flex justify-between mb-2">
                  <div className="w-32 h-5 bg-gray-200 rounded"></div>
                  <div className="w-24 h-4 bg-gray-200 rounded"></div>
                </div>
                <div className="w-full h-4 bg-gray-200 rounded mb-1"></div>
                <div className="w-2/3 h-4 bg-gray-200 rounded"></div>
              </div>
            ))}
          </div>
        ) : (
          <div className="space-y-4">
            {reviews.length > 0 ? (
              reviews.map((review) => (
                <div key={review.id} className="p-4 border rounded-lg">
                  <div className="flex justify-between mb-2">
                    <div>
                      <span className="font-medium">{review.user.name}</span>
                      <div className="flex mt-1">
                        {[...Array(5)].map((_, i) => (
                          <Star
                            key={i}
                            className={`h-4 w-4 ${
                              i < review.rating ? 'text-amber-400 fill-amber-400' : 'text-gray-300'
                            }`}
                          />
                        ))}
                      </div>
                    </div>
                    <div className="flex items-start gap-2">
                      <div className="text-sm text-gray-500">{formatDate(review.date)}</div>
                      {user && review.userId === user.id && (
                        <Button 
                          variant="outline" 
                          size="icon" 
                          className="h-7 w-7 text-red-500 hover:text-red-600"
                          onClick={() => handleDeleteReview(review.id)}
                          disabled={isDeleting === review.id}
                        >
                          <Trash size={14} />
                        </Button>
                      )}
                    </div>
                  </div>
                  <p className="text-gray-600">
                    {review.comment}
                  </p>
                </div>
              ))
            ) : (
              <p className="text-gray-500">No reviews yet. Be the first to review this product!</p>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default ProductReviews;
