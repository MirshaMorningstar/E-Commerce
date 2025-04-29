
import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useWishlist } from '@/contexts/WishlistContext';
import { useCart } from '@/contexts/CartContext';
import { useToast } from '@/components/ui/use-toast';
import { Heart, Trash2, ShoppingBag } from 'lucide-react';
import Layout from '@/components/Layout';

const Wishlist = () => {
  const { wishlist, removeFromWishlist } = useWishlist();
  const { addToCart } = useCart();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Simulate loading time
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 500);
    
    return () => clearTimeout(timer);
  }, []);

  const handleRemoveFromWishlist = async (productId: string) => {
    try {
      await removeFromWishlist(productId);
      toast({
        title: "Removed from wishlist",
        description: "Item has been removed from your wishlist.",
      });
    } catch (error) {
      console.error('Error removing from wishlist:', error);
      toast({
        title: "Error",
        description: "Failed to remove item from wishlist.",
        variant: "destructive",
      });
    }
  };

  const handleAddToCart = async (product: any) => {
    try {
      await addToCart(product);
      toast({
        title: "Added to cart",
        description: `${product.name} has been added to your cart.`,
      });
    } catch (error) {
      console.error('Error adding to cart:', error);
      toast({
        title: "Error",
        description: "Failed to add item to cart.",
        variant: "destructive",
      });
    }
  };

  if (isLoading) {
    return (
      <Layout>
        <div className="container mx-auto py-16 px-4">
          <div className="max-w-6xl mx-auto">
            <div className="mb-8 text-center">
              <h1 className="text-3xl font-bold text-sage-900 mb-2">Loading your wishlist...</h1>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="animate-pulse">
                  <div className="bg-gray-200 h-64 rounded-md mb-4"></div>
                  <div className="bg-gray-200 h-5 w-3/4 rounded mb-2"></div>
                  <div className="bg-gray-200 h-4 w-1/2 rounded"></div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="container mx-auto py-16 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="mb-8 text-center">
            <h1 className="text-3xl font-bold text-sage-900 mb-2">Your Wishlist</h1>
            <p className="text-gray-600">Products you've saved for later</p>
          </div>

          {wishlist.items.length === 0 ? (
            <Card className="text-center py-16">
              <CardContent>
                <div className="flex justify-center mb-4">
                  <Heart className="h-16 w-16 text-gray-300" />
                </div>
                <h2 className="text-2xl font-bold mb-4">Your Wishlist is Empty</h2>
                <p className="text-gray-600 mb-8">Explore our collections and add your favorite products to your wishlist.</p>
                <Link to="/shop">
                  <Button>Explore Products</Button>
                </Link>
              </CardContent>
            </Card>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {wishlist.items.map((item) => (
                <Card key={item.productId} className="overflow-hidden group h-full flex flex-col relative">
                  <div className="absolute top-2 right-2 z-10">
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8 rounded-full bg-white hover:bg-red-50 text-red-500 shadow-sm"
                      onClick={() => handleRemoveFromWishlist(item.productId)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>

                  <Link to={`/product/${item.productId}`} className="block group-hover:opacity-90 transition-opacity">
                    <div className="aspect-square overflow-hidden">
                      <img
                        src={item.product.images[0]}
                        alt={item.product.name}
                        className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                      />
                    </div>
                  </Link>

                  <div className="flex flex-col flex-grow p-4">
                    <Link to={`/product/${item.productId}`} className="hover:underline">
                      <h3 className="font-medium mb-1 line-clamp-1">{item.product.name}</h3>
                    </Link>
                    
                    <p className="text-sm text-gray-500 mb-2">{item.product.category}</p>
                    
                    <div className="flex items-center mt-auto">
                      <div className="flex-grow">
                        <div className="flex items-center gap-2">
                          <span className="font-medium">${item.product.price.toFixed(2)}</span>
                          {item.product.oldPrice && (
                            <span className="text-sm text-gray-500 line-through">
                              ${item.product.oldPrice.toFixed(2)}
                            </span>
                          )}
                        </div>
                      </div>
                      
                      <Button
                        variant="outline"
                        size="sm"
                        className="rounded-full flex items-center gap-1"
                        onClick={() => handleAddToCart(item.product)}
                      >
                        <ShoppingBag className="h-3.5 w-3.5" />
                        <span>Add</span>
                      </Button>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
};

export default Wishlist;
