
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle,
  CardFooter
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { 
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/components/ui/use-toast";
import Layout from '@/components/Layout';
import { Package, CheckCircle, Clock, Truck, AlertCircle } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';

type OrderStatus = 'processing' | 'shipped' | 'delivered' | 'cancelled';

type OrderItem = {
  id: string;
  productId: string;
  name: string;
  price: number;
  quantity: number;
  image: string;
};

type Order = {
  id: string;
  orderNumber: string;
  date: string;
  status: OrderStatus;
  total: number;
  items: OrderItem[];
  trackingNumber?: string;
  estimatedDelivery?: string;
};

const mockOrders: Order[] = [
  {
    id: "1",
    orderNumber: "ORD-2025-001",
    date: "2025-04-25",
    status: "delivered",
    total: 124.95,
    items: [
      {
        id: "item1",
        productId: "prod1",
        name: "Organic Face Serum",
        price: 49.95,
        quantity: 1,
        image: "https://sfxdyshvyjjalfgcipnd.supabase.co/storage/v1/object/public/products/serum2.jpg"
      },
      {
        id: "item2", 
        productId: "prod2",
        name: "Eco-friendly Bamboo Brush Set",
        price: 75.00,
        quantity: 1,
        image: "https://sfxdyshvyjjalfgcipnd.supabase.co/storage/v1/object/public/products/brush-set.jpg"
      }
    ],
    trackingNumber: "TRK4586237",
    estimatedDelivery: "2025-04-30"
  },
  {
    id: "2",
    orderNumber: "ORD-2025-002",
    date: "2025-04-27",
    status: "shipped",
    total: 65.99,
    items: [
      {
        id: "item3",
        productId: "prod3",
        name: "Vegan Lip Balm Collection",
        price: 32.99,
        quantity: 1,
        image: "https://sfxdyshvyjjalfgcipnd.supabase.co/storage/v1/object/public/products/lip-balm.jpg"
      },
      {
        id: "item4",
        productId: "prod4",
        name: "Natural Exfoliating Scrub",
        price: 33.00,
        quantity: 1,
        image: "https://sfxdyshvyjjalfgcipnd.supabase.co/storage/v1/object/public/products/scrub.jpg"
      }
    ],
    trackingNumber: "TRK7891234",
    estimatedDelivery: "2025-05-04"
  }
];

const TrackOrder = () => {
  const [orderNumber, setOrderNumber] = useState("");
  const [email, setEmail] = useState("");
  const [orders, setOrders] = useState<Order[]>([]);
  const [showTrackForm, setShowTrackForm] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [returnReason, setReturnReason] = useState("");
  const [returnDescription, setReturnDescription] = useState("");
  const [returnProducts, setReturnProducts] = useState<string[]>([]);
  
  const { user, isAuthenticated } = useAuth();
  const { toast } = useToast();

  useEffect(() => {
    if (isAuthenticated && user) {
      // In a real app, fetch orders from supabase here
      // For now, we'll use the mock data
      setOrders(mockOrders);
      setEmail(user.email || '');
      // If user is logged in, no need to show the track form
      setShowTrackForm(false);
    }
  }, [isAuthenticated, user]);

  const handleTrackOrder = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    // In a real app, this would call an API to fetch the order
    setTimeout(() => {
      if (orderNumber === "ORD-2025-001" || orderNumber === "ORD-2025-002") {
        const foundOrder = mockOrders.find(order => order.orderNumber === orderNumber);
        if (foundOrder) {
          setOrders([foundOrder]);
          setShowTrackForm(false);
          toast({
            title: "Order Found",
            description: `Found order #${orderNumber}`,
          });
        }
      } else {
        toast({
          title: "Order Not Found",
          description: "No order found with the provided information.",
          variant: "destructive",
        });
      }
      setIsLoading(false);
    }, 1500);
  };
  
  const handleReturnSubmit = (orderId: string) => {
    if (returnProducts.length === 0) {
      toast({
        title: "Error",
        description: "Please select at least one product to return",
        variant: "destructive",
      });
      return;
    }
    
    if (!returnReason) {
      toast({
        title: "Error",
        description: "Please select a reason for your return",
        variant: "destructive",
      });
      return;
    }
    
    toast({
      title: "Return Requested",
      description: "Your return request has been submitted. We will process it within 2-3 business days.",
    });
    
    setReturnReason("");
    setReturnDescription("");
    setReturnProducts([]);
    setSelectedOrder(null);
  };
  
  const toggleReturnProduct = (productId: string) => {
    if (returnProducts.includes(productId)) {
      setReturnProducts(returnProducts.filter(id => id !== productId));
    } else {
      setReturnProducts([...returnProducts, productId]);
    }
  };
  
  const getStatusIcon = (status: OrderStatus) => {
    switch (status) {
      case 'processing':
        return <Clock className="h-5 w-5 text-amber-500" />;
      case 'shipped':
        return <Truck className="h-5 w-5 text-blue-500" />;
      case 'delivered':
        return <CheckCircle className="h-5 w-5 text-green-500" />;
      case 'cancelled':
        return <AlertCircle className="h-5 w-5 text-red-500" />;
      default:
        return <Package className="h-5 w-5 text-gray-500" />;
    }
  };
  
  const getStatusText = (status: OrderStatus) => {
    switch (status) {
      case 'processing':
        return 'Processing';
      case 'shipped':
        return 'Shipped';
      case 'delivered':
        return 'Delivered';
      case 'cancelled':
        return 'Cancelled';
      default:
        return status;
    }
  };
  
  const getProgressStep = (status: OrderStatus) => {
    switch (status) {
      case 'processing':
        return 1;
      case 'shipped':
        return 2;
      case 'delivered':
        return 3;
      case 'cancelled':
        return 0;
      default:
        return 0;
    }
  };

  return (
    <Layout>
      <div className="container mx-auto py-16 px-4">
        <div className="max-w-4xl mx-auto">
          <div className="mb-8 text-center">
            <h1 className="text-3xl font-bold text-sage-900 mb-2">Track Your Order</h1>
            <p className="text-gray-600">Check the status of your order or initiate a return</p>
          </div>
          
          {showTrackForm ? (
            <Card>
              <CardHeader>
                <CardTitle>Track Your Order</CardTitle>
                <CardDescription>
                  Enter your order number and email to track your order
                </CardDescription>
              </CardHeader>
              <form onSubmit={handleTrackOrder}>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="order-number">Order Number</Label>
                    <Input 
                      id="order-number" 
                      placeholder="e.g. ORD-2025-001"
                      value={orderNumber}
                      onChange={(e) => setOrderNumber(e.target.value)}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="email">Email Address</Label>
                    <Input 
                      id="email" 
                      type="email"
                      placeholder="The email used for your order"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                    />
                  </div>
                </CardContent>
                <CardFooter>
                  <Button 
                    type="submit"
                    className="w-full"
                    disabled={isLoading}
                  >
                    {isLoading ? "Searching..." : "Track Order"}
                  </Button>
                </CardFooter>
              </form>
            </Card>
          ) : (
            <>
              <div className="space-y-6">
                {orders.length > 0 ? (
                  orders.map((order) => (
                    <Card key={order.id} className="overflow-hidden">
                      <CardHeader className="bg-slate-50 border-b">
                        <div className="flex justify-between items-center">
                          <div>
                            <CardTitle>Order #{order.orderNumber}</CardTitle>
                            <CardDescription>
                              Placed on {new Date(order.date).toLocaleDateString()}
                            </CardDescription>
                          </div>
                          <div className="flex items-center gap-2">
                            {getStatusIcon(order.status)}
                            <span className="font-medium">
                              {getStatusText(order.status)}
                            </span>
                          </div>
                        </div>
                      </CardHeader>
                      <CardContent className="pt-6">
                        {/* Progress Bar */}
                        <div className="mb-8">
                          <div className="flex justify-between mb-2 text-sm">
                            <span>Processing</span>
                            <span>Shipped</span>
                            <span>Delivered</span>
                          </div>
                          <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                            <div 
                              className="h-full bg-sage-600 transition-all duration-500"
                              style={{ width: `${getProgressStep(order.status) * 33.33}%` }}
                            />
                          </div>
                        </div>
                        
                        {/* Order Details */}
                        <div className="space-y-4">
                          {order.trackingNumber && (
                            <div className="p-4 bg-sage-50 rounded-md flex items-start gap-3">
                              <Truck className="h-6 w-6 text-sage-700 mt-1" />
                              <div>
                                <h3 className="font-medium">Tracking Information</h3>
                                <p className="text-sm text-gray-600">Tracking Number: <span className="font-medium">{order.trackingNumber}</span></p>
                                {order.estimatedDelivery && (
                                  <p className="text-sm text-gray-600">
                                    Estimated Delivery: <span className="font-medium">
                                      {new Date(order.estimatedDelivery).toLocaleDateString()}
                                    </span>
                                  </p>
                                )}
                              </div>
                            </div>
                          )}
                          
                          <h3 className="font-medium">Items in this order</h3>
                          <div className="space-y-4">
                            {order.items.map((item) => (
                              <div key={item.id} className="flex items-center gap-4">
                                <img 
                                  src={item.image} 
                                  alt={item.name} 
                                  className="w-16 h-16 object-cover rounded-md" 
                                />
                                <div className="flex-grow">
                                  <h4 className="font-medium">{item.name}</h4>
                                  <p className="text-sm text-gray-600">Qty: {item.quantity}</p>
                                </div>
                                <div className="text-right">
                                  <p className="font-medium">${item.price.toFixed(2)}</p>
                                </div>
                              </div>
                            ))}
                          </div>
                          
                          <div className="border-t pt-4 mt-4">
                            <div className="flex justify-between font-medium">
                              <span>Total</span>
                              <span>${order.total.toFixed(2)}</span>
                            </div>
                          </div>
                        </div>
                      </CardContent>
                      <CardFooter className="flex justify-between border-t pt-6">
                        <Button 
                          variant="outline"
                          onClick={() => {
                            if (showTrackForm) {
                              setShowTrackForm(false);
                            } else {
                              setShowTrackForm(true);
                            }
                          }}
                        >
                          {showTrackForm ? "View Orders" : "Track Another Order"}
                        </Button>
                        
                        {order.status === 'delivered' && (
                          <Button 
                            variant="secondary"
                            onClick={() => setSelectedOrder(order)}
                          >
                            Return Items
                          </Button>
                        )}
                      </CardFooter>
                    </Card>
                  ))
                ) : (
                  <Card>
                    <CardContent className="py-8 text-center">
                      <p className="text-gray-500">No orders found.</p>
                      <Button 
                        variant="link" 
                        onClick={() => setShowTrackForm(true)}
                      >
                        Track an Order
                      </Button>
                    </CardContent>
                  </Card>
                )}
              </div>
              
              {/* Return Form Modal */}
              {selectedOrder && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
                  <div className="bg-white rounded-lg max-w-lg w-full max-h-[90vh] overflow-y-auto">
                    <div className="p-4 border-b">
                      <h2 className="text-xl font-semibold">Return Items from Order #{selectedOrder.orderNumber}</h2>
                    </div>
                    <div className="p-6 space-y-6">
                      <div className="space-y-4">
                        <h3 className="font-medium">Select items to return:</h3>
                        {selectedOrder.items.map((item) => (
                          <div key={item.id} className="flex items-center gap-4">
                            <input 
                              type="checkbox" 
                              id={`return-${item.id}`} 
                              checked={returnProducts.includes(item.productId)}
                              onChange={() => toggleReturnProduct(item.productId)}
                              className="h-4 w-4 rounded border-gray-300 text-sage-600"
                            />
                            <label htmlFor={`return-${item.id}`} className="flex items-center gap-4 flex-grow cursor-pointer">
                              <img 
                                src={item.image} 
                                alt={item.name} 
                                className="w-12 h-12 object-cover rounded-md" 
                              />
                              <div className="flex-grow">
                                <h4 className="font-medium">{item.name}</h4>
                                <p className="text-sm text-gray-600">Qty: {item.quantity}</p>
                              </div>
                            </label>
                          </div>
                        ))}
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="return-reason">Reason for return</Label>
                        <Select value={returnReason} onValueChange={setReturnReason}>
                          <SelectTrigger>
                            <SelectValue placeholder="Select a reason" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="damaged">Item arrived damaged</SelectItem>
                            <SelectItem value="defective">Item is defective</SelectItem>
                            <SelectItem value="wrong-item">Received wrong item</SelectItem>
                            <SelectItem value="changed-mind">Changed my mind</SelectItem>
                            <SelectItem value="allergic">Allergic reaction</SelectItem>
                            <SelectItem value="other">Other</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="return-description">Additional details</Label>
                        <Textarea 
                          id="return-description" 
                          placeholder="Please provide more details about the return reason"
                          value={returnDescription}
                          onChange={(e) => setReturnDescription(e.target.value)}
                          rows={4}
                        />
                      </div>
                    </div>
                    <div className="p-4 border-t flex justify-end gap-2">
                      <Button 
                        variant="outline"
                        onClick={() => {
                          setSelectedOrder(null);
                          setReturnProducts([]);
                          setReturnReason("");
                          setReturnDescription("");
                        }}
                      >
                        Cancel
                      </Button>
                      <Button 
                        onClick={() => handleReturnSubmit(selectedOrder.id)}
                      >
                        Submit Return Request
                      </Button>
                    </div>
                  </div>
                </div>
              )}
            </>
          )}
          
          <div className="mt-8">
            <Accordion type="single" collapsible className="w-full">
              <AccordionItem value="order-help">
                <AccordionTrigger className="text-left">Need help with your order?</AccordionTrigger>
                <AccordionContent>
                  <p className="mb-4">If you need assistance with your order or have any questions, you can contact our customer service team:</p>
                  <ul className="list-disc pl-5 space-y-2">
                    <li>Email: <a href="mailto:support@ecoglow.com" className="text-sage-600 hover:underline">support@ecoglow.com</a></li>
                    <li>Phone: (555) 123-4567</li>
                    <li>Hours: Monday - Friday, 9am - 5pm EST</li>
                  </ul>
                </AccordionContent>
              </AccordionItem>
              <AccordionItem value="return-policy">
                <AccordionTrigger className="text-left">Return Policy</AccordionTrigger>
                <AccordionContent>
                  <p className="mb-4">Our return policy allows you to return items within 30 days of delivery, provided they are in their original condition.</p>
                  <p>For more information, please visit our <Link to="/returns-exchanges" className="text-sage-600 hover:underline">Returns & Exchanges</Link> page.</p>
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default TrackOrder;
