
import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import Layout from '@/components/Layout';
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { toast } from "@/components/ui/use-toast";
import { useAuth } from '@/contexts/AuthContext';
import { getOrderById, updateOrderStatus } from '@/services/productService';
import { format } from 'date-fns';
import { CheckCheck, Package, Truck, Home, Clock, X } from 'lucide-react';
import { Json } from '@/integrations/supabase/types';

interface OrderItem {
  id: string;
  quantity: number;
  price: number;
  product: {
    id: string;
    name: string;
    images: string[];
    price: number;
  };
}

interface Order {
  id: string;
  user_id: string;
  status: string;
  created_at: string;
  updated_at: string;
  total_amount: number;
  items: OrderItem[];
  shipping_address?: Json | null; // Updated to accept Json type from Supabase
}

// Interface to strongly type shipping address properties
interface ShippingAddress {
  name?: string;
  address?: string;
  city?: string;
  state?: string;
  zip?: string;
  country?: string;
}

const TrackOrder = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [orderId, setOrderId] = useState(searchParams.get('id') || '');
  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [updatingStatus, setUpdatingStatus] = useState(false);
  const { user } = useAuth();

  useEffect(() => {
    if (orderId) {
      fetchOrder(orderId);
    }
  }, [orderId]);

  const fetchOrder = async (id: string) => {
    setLoading(true);
    setError(null);
    
    try {
      const orderData = await getOrderById(id);
      setOrder(orderData as Order); // Ensure we cast to the Order type
      
      // Update the URL with the order ID
      if (!searchParams.has('id')) {
        setSearchParams({ id });
      }
    } catch (error: any) {
      console.error("Order fetch error:", error);
      setError(error.message || 'Failed to fetch order details');
      toast({
        title: "Error",
        description: error.message || 'Failed to fetch order details',
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  // Helper function to safely extract shipping address properties
  const getShippingAddressProperty = (address: Json | null | undefined, property: keyof ShippingAddress): string => {
    if (!address || typeof address !== 'object' || Array.isArray(address)) {
      return '';
    }

    // Safe access to property using bracket notation
    const typedAddress = address as Record<string, Json>;
    return typedAddress[property]?.toString() || '';
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!orderId.trim()) {
      toast({
        title: "Error",
        description: "Please enter an order ID",
        variant: "destructive",
      });
      return;
    }
    fetchOrder(orderId);
  };

  const handleCancelOrder = async () => {
    if (!order) return;
    
    setUpdatingStatus(true);
    try {
      await updateOrderStatus(order.id, 'cancelled');
      setOrder({ ...order, status: 'cancelled' });
      toast({
        title: "Order Cancelled",
        description: "Your order has been successfully cancelled.",
      });
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || 'Failed to cancel order',
        variant: "destructive",
      });
    } finally {
      setUpdatingStatus(false);
    }
  };

  const formatDate = (dateString: string) => {
    return format(new Date(dateString), 'MMM d, yyyy h:mm a');
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(price);
  };

  const getStatusIcon = (status: string) => {
    switch (status.toLowerCase()) {
      case 'pending':
        return <Clock size={24} className="text-yellow-500" />;
      case 'processing':
        return <Package size={24} className="text-blue-500" />;
      case 'shipped':
        return <Truck size={24} className="text-purple-500" />;
      case 'delivered':
        return <Home size={24} className="text-green-500" />;
      case 'cancelled':
        return <X size={24} className="text-red-500" />;
      default:
        return <Clock size={24} className="text-gray-500" />;
    }
  };

  const getStatusStepCompleted = (orderStatus: string, step: string) => {
    const statuses = ['pending', 'processing', 'shipped', 'delivered'];
    const orderIndex = statuses.indexOf(orderStatus.toLowerCase());
    const stepIndex = statuses.indexOf(step.toLowerCase());
    
    if (orderStatus.toLowerCase() === 'cancelled') {
      return false;
    }
    
    return orderIndex >= stepIndex;
  };

  const canBeCancelled = (status: string) => {
    return ['pending', 'processing'].includes(status.toLowerCase());
  };

  const renderOrderTimeline = (status: string) => {
    const steps = [
      { label: 'Order Placed', status: 'pending' },
      { label: 'Processing', status: 'processing' },
      { label: 'Shipped', status: 'shipped' },
      { label: 'Delivered', status: 'delivered' },
    ];

    if (status.toLowerCase() === 'cancelled') {
      return (
        <div className="flex items-center justify-center p-4 mt-4 border rounded-lg bg-red-50">
          <X size={24} className="text-red-500 mr-2" /> 
          <span className="font-medium text-red-700">Order has been cancelled</span>
        </div>
      );
    }

    return (
      <div className="mt-8">
        <div className="relative flex justify-between mb-2">
          {steps.map((step, index) => {
            const isCompleted = getStatusStepCompleted(status, step.status);
            return (
              <div key={index} className="flex flex-col items-center text-center w-1/4">
                <div
                  className={`w-10 h-10 rounded-full flex items-center justify-center mb-2 ${
                    isCompleted
                      ? 'bg-green-500 text-white'
                      : 'bg-gray-200 text-gray-500'
                  }`}
                >
                  {isCompleted ? <CheckCheck size={18} /> : index + 1}
                </div>
                <div className="text-sm font-medium">{step.label}</div>
              </div>
            );
          })}
          {/* Horizontal connecting line */}
          <div className="absolute top-5 left-0 right-0 h-0.5 bg-gray-200 -z-10"></div>
        </div>
      </div>
    );
  };

  return (
    <Layout>
      <div className="container mx-auto px-4 py-16">
        <h1 className="text-3xl font-semibold mb-8 text-center">Track Your Order</h1>

        <div className="max-w-2xl mx-auto mb-10">
          <form onSubmit={handleSubmit} className="flex gap-2">
            <Input
              placeholder="Enter your order ID"
              value={orderId}
              onChange={(e) => setOrderId(e.target.value)}
              className="flex-1"
            />
            <Button type="submit" disabled={loading}>
              {loading ? "Tracking..." : "Track"}
            </Button>
          </form>
        </div>

        {loading ? (
          <div className="flex justify-center py-10">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-sage-600"></div>
          </div>
        ) : error ? (
          <Card>
            <CardContent className="flex flex-col items-center py-10">
              <div className="text-red-500 mb-4">
                <X size={48} />
              </div>
              <h2 className="text-xl font-semibold mb-2">Order Not Found</h2>
              <p className="text-gray-500">
                We couldn't find an order with the ID you provided.
                Please check the ID and try again.
              </p>
            </CardContent>
          </Card>
        ) : order ? (
          <div className="space-y-8">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle>Order Status</CardTitle>
                <Badge className={`text-sm ${
                  order.status.toLowerCase() === 'delivered' ? 'bg-green-500' :
                  order.status.toLowerCase() === 'shipped' ? 'bg-purple-500' :
                  order.status.toLowerCase() === 'processing' ? 'bg-blue-500' :
                  order.status.toLowerCase() === 'cancelled' ? 'bg-red-500' :
                  'bg-yellow-500'
                }`}>
                  {order.status}
                </Badge>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h3 className="font-medium mb-2">Order Details</h3>
                    <div className="space-y-2 text-sm">
                      <p><span className="font-medium">Order ID:</span> {order.id}</p>
                      <p><span className="font-medium">Date:</span> {formatDate(order.created_at)}</p>
                      <p><span className="font-medium">Total:</span> {formatPrice(order.total_amount)}</p>
                    </div>
                  </div>
                  
                  {order.shipping_address && (
                    <div>
                      <h3 className="font-medium mb-2">Shipping Address</h3>
                      <div className="space-y-1 text-sm">
                        <p>{getShippingAddressProperty(order.shipping_address, 'name')}</p>
                        <p>{getShippingAddressProperty(order.shipping_address, 'address')}</p>
                        <p>
                          {getShippingAddressProperty(order.shipping_address, 'city')}, {getShippingAddressProperty(order.shipping_address, 'state')} {getShippingAddressProperty(order.shipping_address, 'zip')}
                        </p>
                        <p>{getShippingAddressProperty(order.shipping_address, 'country')}</p>
                      </div>
                    </div>
                  )}
                </div>
                
                {renderOrderTimeline(order.status)}
                
                {canBeCancelled(order.status) && order.user_id === user?.id && (
                  <div className="mt-6">
                    <Button
                      variant="outline"
                      className="border-red-300 text-red-600 hover:bg-red-50 hover:text-red-700"
                      onClick={handleCancelOrder}
                      disabled={updatingStatus}
                    >
                      <X size={16} className="mr-1" /> 
                      {updatingStatus ? "Cancelling..." : "Cancel Order"}
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>Order Items</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {order.items && order.items.length > 0 ? (
                    order.items.map((item) => (
                      <div key={item.id} className="flex items-center gap-4 py-2 border-b last:border-none">
                        <div className="w-16 h-16 bg-gray-100 rounded overflow-hidden">
                          {item.product.images && item.product.images.length > 0 ? (
                            <img 
                              src={item.product.images[0]}
                              alt={item.product.name}
                              className="w-full h-full object-cover"
                              onError={(e) => {
                                const target = e.target as HTMLImageElement;
                                target.src = "/placeholder.svg";
                              }}
                            />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center bg-gray-200">
                              <span className="text-xs text-gray-500">No image</span>
                            </div>
                          )}
                        </div>
                        <div className="flex-1">
                          <h4 className="font-medium">{item.product.name}</h4>
                          <div className="flex justify-between text-sm text-gray-500 mt-1">
                            <span>Qty: {item.quantity}</span>
                            <span>{formatPrice(item.price)}</span>
                          </div>
                        </div>
                      </div>
                    ))
                  ) : (
                    <p className="text-center py-4 text-gray-500">No items found in this order.</p>
                  )}
                  
                  <div className="pt-4 flex justify-between font-medium">
                    <span>Total</span>
                    <span>{formatPrice(order.total_amount)}</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        ) : null}
      </div>
    </Layout>
  );
};

export default TrackOrder;
