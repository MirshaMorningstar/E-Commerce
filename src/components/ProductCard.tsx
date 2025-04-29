
import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Heart, ShoppingBag, Star } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Product } from '@/services/productService';
import { useCart } from '@/contexts/CartContext';
import { useWishlist } from '@/contexts/WishlistContext';

interface ProductCardProps {
  product: Product;
}

const ProductCard = ({ product }: ProductCardProps) => {
  const { addToCart } = useCart();
  const { addToWishlist, removeFromWishlist, isInWishlist } = useWishlist();
  const [isLiked, setIsLiked] = useState(isInWishlist(product.id));

  const handleWishlist = () => {
    if (isInWishlist(product.id)) {
      removeFromWishlist(product.id);
      setIsLiked(false);
    } else {
      addToWishlist(product);
      setIsLiked(true);
    }
  };

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    addToCart(product);
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2
    }).format(price);
  };

  return (
    <div className="product-card group bg-white rounded-lg overflow-hidden shadow-sm hover:shadow-md">
      <div className="relative product-image-container">
        <Link to={`/product/${product.id}`}>
          <img
            src={product.images[0]}
            alt={product.name}
            className="w-full h-64 object-cover"
          />
        </Link>
        
        {/* Quick action buttons */}
        <div className="absolute top-2 right-2 flex flex-col gap-2">
          <Button 
            size="icon"
            variant="secondary"
            className="rounded-full bg-white/80 backdrop-blur-sm hover:bg-white"
            onClick={handleWishlist}
          >
            <Heart 
              className={`h-4 w-4 ${isLiked ? 'fill-cosmetic-500 text-cosmetic-500' : 'text-gray-600'}`} 
            />
          </Button>
          <Button 
            size="icon"
            variant="secondary"
            className="rounded-full bg-white/80 backdrop-blur-sm hover:bg-white"
            onClick={handleAddToCart}
          >
            <ShoppingBag className="h-4 w-4 text-gray-600" />
          </Button>
        </div>
        
        {/* Product badges */}
        <div className="absolute top-2 left-2 flex flex-col gap-1">
          {product.isNew && (
            <Badge className="bg-emerald-500 hover:bg-emerald-600">New</Badge>
          )}
          {product.isOnSale && (
            <Badge className="bg-cosmetic-500 hover:bg-cosmetic-600">Sale</Badge>
          )}
          {product.isFeatured && (
            <Badge className="bg-amber-500 hover:bg-amber-600">Featured</Badge>
          )}
        </div>
      </div>

      <div className="p-4">
        <Link to={`/product/${product.id}`}>
          <div className="text-xs text-gray-500 mb-1">{product.brand}</div>
          <h3 className="font-medium text-gray-800 mb-1 hover:text-cosmetic-600 transition-colors">
            {product.name}
          </h3>
          
          <div className="flex items-center gap-1 mb-2">
            <div className="flex">
              {[...Array(5)].map((_, i) => (
                <Star
                  key={i}
                  className={`h-3 w-3 ${
                    i < Math.floor(product.rating)
                      ? 'text-amber-400 fill-amber-400'
                      : 'text-gray-300'
                  }`}
                />
              ))}
            </div>
            <span className="text-xs text-gray-500">({product.reviews})</span>
          </div>
          
          <div className="flex items-center gap-2">
            <span className="font-semibold">{formatPrice(product.price)}</span>
            {product.oldPrice && (
              <span className="text-sm text-gray-400 line-through">
                {formatPrice(product.oldPrice)}
              </span>
            )}
          </div>
        </Link>

        <div className="mt-3">
          <Button 
            onClick={handleAddToCart}
            variant="default" 
            className="w-full bg-cosmetic-600 hover:bg-cosmetic-700"
          >
            Add to Cart
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
