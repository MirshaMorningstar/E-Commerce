
import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import Layout from '@/components/Layout';
import { Product, getProductById, getRelatedProducts } from '@/services/productService';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Star } from 'lucide-react';
import { useCart } from '@/contexts/CartContext';
import { useWishlist } from '@/contexts/WishlistContext';
import { Heart } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import ProductGrid from '@/components/ProductGrid';
import { useToast } from '@/hooks/use-toast';

const ProductDetail = () => {
  const { id } = useParams<{ id: string }>();
  const [product, setProduct] = useState<Product | null>(null);
  const [quantity, setQuantity] = useState(1);
  const [loading, setLoading] = useState(true);
  const [selectedImage, setSelectedImage] = useState(0);
  const [relatedProducts, setRelatedProducts] = useState<Product[]>([]);
  const { addToCart } = useCart();
  const { addToWishlist, isInWishlist, removeFromWishlist } = useWishlist();
  const [isLiked, setIsLiked] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    const loadProduct = async () => {
      if (!id) return;
      
      try {
        setLoading(true);
        const productData = await getProductById(id);
        
        if (productData) {
          setProduct(productData);
          setSelectedImage(0);
          
          // Check if product is in wishlist
          const inWishlist = await isInWishlist(productData.id);
          setIsLiked(inWishlist);
          
          // Load related products
          const related = await getRelatedProducts(productData);
          setRelatedProducts(related);
        }
      } catch (error) {
        console.error("Error loading product:", error);
      } finally {
        setLoading(false);
      }
    };

    loadProduct();
  }, [id, isInWishlist]);

  const handleQuantityChange = (change: number) => {
    setQuantity(prev => Math.max(1, Math.min(prev + change, product?.stock || 10)));
  };

  const handleAddToCart = () => {
    if (!product) return;
    
    addToCart(product, quantity);
    toast({
      title: "Added to Cart",
      description: `${product.name} (x${quantity}) added to your cart`,
    });
  };

  const handleWishlist = async () => {
    if (!product) return;
    
    if (isLiked) {
      await removeFromWishlist(product.id);
      setIsLiked(false);
      toast({
        title: "Removed from Wishlist",
        description: `${product.name} removed from your wishlist`,
      });
    } else {
      await addToWishlist(product);
      setIsLiked(true);
      toast({
        title: "Added to Wishlist",
        description: `${product.name} added to your wishlist`,
      });
    }
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2
    }).format(price);
  };

  if (loading) {
    return (
      <Layout>
        <div className="container mx-auto px-4 py-16">
          <div className="animate-pulse">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="bg-gray-200 h-96 rounded-lg"></div>
              <div className="space-y-4">
                <div className="h-8 bg-gray-200 rounded w-3/4"></div>
                <div className="h-6 bg-gray-200 rounded w-1/2"></div>
                <div className="h-10 bg-gray-200 rounded w-1/4"></div>
                <div className="h-20 bg-gray-200 rounded"></div>
                <div className="h-10 bg-gray-200 rounded w-1/3"></div>
              </div>
            </div>
          </div>
        </div>
      </Layout>
    );
  }

  if (!product) {
    return (
      <Layout>
        <div className="container mx-auto px-4 py-16 text-center">
          <h1 className="text-2xl font-bold">Product not found</h1>
          <p className="mt-4">The product you're looking for doesn't exist or has been removed.</p>
          <Button asChild className="mt-6">
            <a href="/shop">Continue Shopping</a>
          </Button>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="container mx-auto px-4 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Product Images */}
          <div>
            <div className="overflow-hidden rounded-lg mb-4 border">
              <img
                src={product.images[selectedImage]}
                alt={product.name}
                className="w-full h-96 object-contain"
              />
            </div>
            
            {/* Thumbnail Gallery */}
            {product.images.length > 1 && (
              <div className="grid grid-cols-5 gap-2">
                {product.images.map((image, index) => (
                  <div
                    key={index}
                    onClick={() => setSelectedImage(index)}
                    className={`cursor-pointer border rounded-md overflow-hidden ${
                      selectedImage === index ? 'border-cosmetic-600 ring-2 ring-cosmetic-200' : 'border-gray-200'
                    }`}
                  >
                    <img src={image} alt={`${product.name} thumbnail ${index + 1}`} className="w-full h-16 object-contain" />
                  </div>
                ))}
              </div>
            )}
          </div>
          
          {/* Product Details */}
          <div>
            <div className="text-sm text-gray-500">{product.brand}</div>
            <h1 className="text-3xl font-bold mb-2">{product.name}</h1>
            
            {/* Badges */}
            <div className="flex gap-2 mb-4">
              {product.isNew && <Badge className="bg-emerald-500">New</Badge>}
              {product.isOnSale && <Badge className="bg-cosmetic-500">Sale</Badge>}
              {product.isFeatured && <Badge className="bg-amber-500">Featured</Badge>}
            </div>
            
            {/* Ratings */}
            <div className="flex items-center mb-4">
              <div className="flex">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    className={`h-4 w-4 ${
                      i < Math.floor(product.rating)
                        ? 'text-amber-400 fill-amber-400'
                        : 'text-gray-300'
                    }`}
                  />
                ))}
              </div>
              <span className="ml-2 text-sm text-gray-500">({product.reviews} reviews)</span>
            </div>
            
            {/* Price */}
            <div className="mb-6">
              <div className="flex items-end gap-2">
                <span className="text-2xl font-bold">{formatPrice(product.price)}</span>
                {product.oldPrice && (
                  <span className="text-lg text-gray-400 line-through">{formatPrice(product.oldPrice)}</span>
                )}
                {product.isOnSale && (
                  <span className="text-cosmetic-600 font-semibold">Save {Math.round(((product.oldPrice || 0) - product.price) / (product.oldPrice || 1) * 100)}%</span>
                )}
              </div>
            </div>
            
            {/* Description */}
            <p className="text-gray-600 mb-6">{product.description}</p>
            
            {/* Quantity Selector */}
            <div className="flex items-center gap-4 mb-6">
              <label htmlFor="quantity" className="text-gray-700">Quantity:</label>
              <div className="flex items-center">
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => handleQuantityChange(-1)}
                  disabled={quantity <= 1}
                  className="h-10 w-10 rounded-r-none"
                >
                  -
                </Button>
                <div className="h-10 w-12 flex items-center justify-center border-y">
                  {quantity}
                </div>
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => handleQuantityChange(1)}
                  disabled={quantity >= (product.stock || 10)}
                  className="h-10 w-10 rounded-l-none"
                >
                  +
                </Button>
              </div>
              <span className="text-sm text-gray-500">
                {product.stock > 0 ? `${product.stock} available` : 'Out of stock'}
              </span>
            </div>
            
            {/* Add to Cart and Wishlist */}
            <div className="flex gap-4">
              <Button
                onClick={handleAddToCart}
                className="flex-1 bg-cosmetic-600 hover:bg-cosmetic-700"
                disabled={product.stock <= 0}
              >
                Add to Cart
              </Button>
              <Button 
                variant="outline" 
                size="icon"
                onClick={handleWishlist}
                className="h-10 w-10"
              >
                <Heart className={`h-5 w-5 ${isLiked ? 'fill-cosmetic-500 text-cosmetic-500' : ''}`} />
              </Button>
            </div>
            
            {/* Product Meta */}
            <div className="mt-8 space-y-2 text-sm text-gray-500">
              {product.category && (
                <div>
                  <span className="font-medium text-gray-700">Category:</span> {product.category}
                </div>
              )}
              {product.tags && product.tags.length > 0 && (
                <div>
                  <span className="font-medium text-gray-700">Tags:</span> {product.tags.join(', ')}
                </div>
              )}
              <div>
                <span className="font-medium text-gray-700">SKU:</span> {product.id.slice(0, 8)}
              </div>
            </div>
          </div>
        </div>
        
        {/* Product Tabs */}
        <div className="mt-16">
          <Tabs defaultValue="description">
            <TabsList className="w-full justify-start">
              <TabsTrigger value="description">Description</TabsTrigger>
              <TabsTrigger value="details">Details</TabsTrigger>
              <TabsTrigger value="reviews">Reviews</TabsTrigger>
            </TabsList>
            <TabsContent value="description" className="py-6">
              <p className="text-gray-700">{product.description}</p>
            </TabsContent>
            <TabsContent value="details" className="py-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h3 className="font-semibold mb-2">Product Details</h3>
                  <ul className="space-y-2 text-gray-600">
                    <li><span className="font-medium">Brand:</span> {product.brand}</li>
                    <li><span className="font-medium">Category:</span> {product.category}</li>
                    {product.subcategory && (
                      <li><span className="font-medium">Type:</span> {product.subcategory}</li>
                    )}
                  </ul>
                </div>
                <div>
                  <h3 className="font-semibold mb-2">Shipping Information</h3>
                  <ul className="space-y-2 text-gray-600">
                    <li><span className="font-medium">Weight:</span> 0.5 kg</li>
                    <li><span className="font-medium">Dimensions:</span> 15 × 10 × 5 cm</li>
                    <li><span className="font-medium">Shipping:</span> Free shipping on orders over $50</li>
                  </ul>
                </div>
              </div>
            </TabsContent>
            <TabsContent value="reviews" className="py-6">
              <div className="space-y-6">
                <div className="flex items-center gap-4">
                  <div className="flex">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        className={`h-5 w-5 ${
                          i < Math.floor(product.rating)
                            ? 'text-amber-400 fill-amber-400'
                            : 'text-gray-300'
                        }`}
                      />
                    ))}
                  </div>
                  <span className="text-xl font-medium">{product.rating.toFixed(1)}</span>
                  <span className="text-gray-500">Based on {product.reviews} reviews</span>
                </div>
                
                <div className="border-t pt-6">
                  {product.reviews > 0 ? (
                    <div className="space-y-4">
                      <div className="p-4 border rounded-lg">
                        <div className="flex justify-between mb-2">
                          <div>
                            <span className="font-medium">Jane Doe</span>
                            <div className="flex mt-1">
                              {[...Array(5)].map((_, i) => (
                                <Star
                                  key={i}
                                  className={`h-4 w-4 ${
                                    i < 5 ? 'text-amber-400 fill-amber-400' : 'text-gray-300'
                                  }`}
                                />
                              ))}
                            </div>
                          </div>
                          <div className="text-sm text-gray-500">2 weeks ago</div>
                        </div>
                        <p className="text-gray-600">
                          This product exceeded my expectations! The quality is amazing, and it works exactly as described.
                        </p>
                      </div>
                    </div>
                  ) : (
                    <p className="text-gray-500">No reviews yet. Be the first to review this product!</p>
                  )}
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </div>
        
        {/* Related Products */}
        {relatedProducts.length > 0 && (
          <div className="mt-16">
            <h2 className="text-2xl font-bold mb-6">You May Also Like</h2>
            <ProductGrid products={relatedProducts} columns={4} />
          </div>
        )}
      </div>
    </Layout>
  );
};

export default ProductDetail;
