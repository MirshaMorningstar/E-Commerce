
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Layout from '@/components/Layout';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Separator } from '@/components/ui/separator';
import { Trash2, Plus, Minus, ArrowRight, CheckCircle } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';
import { useCart } from '@/contexts/CartContext';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';

type CheckoutStep = 'cart' | 'shipping' | 'payment' | 'confirmation';

const Cart = () => {
  const { cart, updateQuantity, removeFromCart, clearCart } = useCart();
  const { isAuthenticated } = useAuth();
  const [currentStep, setCurrentStep] = useState<CheckoutStep>('cart');
  const [couponCode, setCouponCode] = useState<string>('');
  const [couponApplied, setCouponApplied] = useState<boolean>(false);
  const [discount, setDiscount] = useState<number>(0);
  const [isProcessing, setIsProcessing] = useState<boolean>(false);
  
  // Shipping form state
  const [shippingInfo, setShippingInfo] = useState({
    fullName: '',
    address: '',
    city: '',
    state: '',
    zipCode: '',
    country: 'USA',
    phoneNumber: '',
  });
  
  // Payment form state
  const [paymentInfo, setPaymentInfo] = useState({
    cardNumber: '',
    cardName: '',
    expiry: '',
    cvv: '',
  });
  
  // Shipping method
  const [shippingMethod, setShippingMethod] = useState<'standard' | 'express'>('standard');
  
  const shipping = shippingMethod === 'standard' ? 4.99 : 9.99;
  const subtotal = cart.subtotal;
  const total = subtotal + shipping - discount;
  
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const handleApplyCoupon = () => {
    // In a real app, this would validate the coupon from the database
    if (couponCode.toUpperCase() === 'ECO20') {
      const discountAmount = subtotal * 0.2;
      setDiscount(parseFloat(discountAmount.toFixed(2)));
      setCouponApplied(true);
      toast({
        title: "Coupon Applied",
        description: "20% discount has been applied to your order.",
      });
    } else if (couponCode.toUpperCase() === 'FREESHIP') {
      const discountAmount = shipping;
      setDiscount(parseFloat(discountAmount.toFixed(2)));
      setCouponApplied(true);
      toast({
        title: "Coupon Applied",
        description: "Free shipping has been applied to your order.",
      });
    } else {
      toast({
        title: "Invalid Coupon",
        description: "The coupon code you entered is invalid or expired.",
        variant: "destructive",
      });
    }
  };
  
  const handleQuantityChange = (productId: string, newQuantity: number) => {
    if (newQuantity < 1) return;
    updateQuantity(productId, newQuantity);
  };
  
  const handleRemoveItem = (productId: string) => {
    removeFromCart(productId);
    toast({
      title: "Item Removed",
      description: "The item has been removed from your cart.",
    });
  };
  
  const handleShippingSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Simple validation
    for (const [key, value] of Object.entries(shippingInfo)) {
      if (!value) {
        toast({
          title: "Missing Information",
          description: `Please fill in your ${key.replace(/([A-Z])/g, ' $1').toLowerCase()}`,
          variant: "destructive",
        });
        return;
      }
    }
    
    setCurrentStep('payment');
  };
  
  const handlePaymentSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Simple validation
    for (const [key, value] of Object.entries(paymentInfo)) {
      if (!value) {
        toast({
          title: "Missing Information",
          description: `Please fill in your ${key.replace(/([A-Z])/g, ' $1').toLowerCase()}`,
          variant: "destructive",
        });
        return;
      }
    }
    
    setIsProcessing(true);
    
    // Simulate payment processing
    setTimeout(() => {
      setIsProcessing(false);
      setCurrentStep('confirmation');
      
      // In a real app, we would save the order to the database here
      clearCart();
    }, 2000);
  };
  
  const handleShippingMethodChange = (value: string) => {
    setShippingMethod(value as 'standard' | 'express');
  };
  
  const handleShippingInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setShippingInfo(prev => ({
      ...prev,
      [name]: value,
    }));
  };
  
  const handlePaymentInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    
    if (name === 'cardNumber') {
      // Format card number with spaces after every 4 digits
      const formatted = value
        .replace(/[^\d]/g, '')
        .slice(0, 16)
        .replace(/(.{4})/g, '$1 ')
        .trim();
      
      setPaymentInfo(prev => ({
        ...prev,
        [name]: formatted,
      }));
    } else if (name === 'expiry') {
      // Format expiry as MM/YY
      const formatted = value
        .replace(/[^\d]/g, '')
        .slice(0, 4)
        .replace(/(.{2})(.*)/, '$1/$2');
      
      setPaymentInfo(prev => ({
        ...prev,
        [name]: formatted,
      }));
    } else if (name === 'cvv') {
      // Only allow 3 or 4 digits
      const formatted = value.replace(/[^\d]/g, '').slice(0, 4);
      
      setPaymentInfo(prev => ({
        ...prev,
        [name]: formatted,
      }));
    } else {
      setPaymentInfo(prev => ({
        ...prev,
        [name]: value,
      }));
    }
  };
  
  // Render different content based on the current step
  const renderStepContent = () => {
    switch (currentStep) {
      case 'cart':
        return renderCartStep();
      case 'shipping':
        return renderShippingStep();
      case 'payment':
        return renderPaymentStep();
      case 'confirmation':
        return renderConfirmationStep();
      default:
        return renderCartStep();
    }
  };
  
  const renderCartStep = () => {
    if (cart.items.length === 0) {
      return (
        <div className="text-center py-16">
          <h2 className="text-2xl font-bold mb-4">Your Cart is Empty</h2>
          <p className="text-gray-600 mb-8">Looks like you haven't added any products to your cart yet.</p>
          <Link to="/shop">
            <Button>Continue Shopping</Button>
          </Link>
        </div>
      );
    }
    
    return (
      <div className="grid md:grid-cols-3 gap-6">
        <div className="md:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle>Shopping Cart ({cart.totalItems} items)</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {cart.items.map((item) => (
                <div key={item.productId} className="flex items-center gap-4 pb-4 border-b">
                  <img 
                    src={item.product.images[0]} 
                    alt={item.product.name} 
                    className="w-20 h-20 object-cover rounded-md" 
                  />
                  <div className="flex-grow">
                    <Link to={`/product/${item.productId}`} className="hover:underline">
                      <h3 className="font-medium">{item.product.name}</h3>
                    </Link>
                    <p className="text-sm text-gray-500">{item.product.category}</p>
                    
                    <div className="flex justify-between items-center mt-2">
                      <div className="flex items-center space-x-2">
                        <Button 
                          variant="outline" 
                          size="icon" 
                          className="h-7 w-7"
                          onClick={() => handleQuantityChange(item.productId, item.quantity - 1)}
                        >
                          <Minus className="h-3 w-3" />
                        </Button>
                        <span className="text-sm w-5 text-center">{item.quantity}</span>
                        <Button 
                          variant="outline" 
                          size="icon" 
                          className="h-7 w-7"
                          onClick={() => handleQuantityChange(item.productId, item.quantity + 1)}
                        >
                          <Plus className="h-3 w-3" />
                        </Button>
                      </div>
                      
                      <Button 
                        variant="ghost" 
                        size="icon" 
                        className="h-7 w-7 text-red-500"
                        onClick={() => handleRemoveItem(item.productId)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-medium">${(item.product.price * item.quantity).toFixed(2)}</p>
                    
                    {item.product.oldPrice && (
                      <p className="text-sm text-gray-500 line-through">
                        ${(item.product.oldPrice * item.quantity).toFixed(2)}
                      </p>
                    )}
                  </div>
                </div>
              ))}
            </CardContent>
            <CardFooter className="flex justify-between">
              <Button variant="outline" onClick={() => navigate('/shop')}>
                Continue Shopping
              </Button>
              <Button variant="destructive" onClick={() => clearCart()}>
                Clear Cart
              </Button>
            </CardFooter>
          </Card>
        </div>
        
        <div>
          <Card>
            <CardHeader>
              <CardTitle>Order Summary</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex justify-between">
                <span>Subtotal</span>
                <span>${subtotal.toFixed(2)}</span>
              </div>
              
              <div>
                <Label htmlFor="coupon">Coupon Code</Label>
                <div className="flex gap-2 mt-1">
                  <Input
                    id="coupon"
                    value={couponCode}
                    onChange={(e) => setCouponCode(e.target.value)}
                    placeholder="Enter coupon code"
                    disabled={couponApplied}
                  />
                  <Button 
                    onClick={handleApplyCoupon}
                    disabled={couponApplied || !couponCode}
                  >
                    Apply
                  </Button>
                </div>
                {couponApplied && (
                  <p className="text-sm text-green-600 mt-1">Coupon applied!</p>
                )}
              </div>
              
              {discount > 0 && (
                <div className="flex justify-between text-green-600">
                  <span>Discount</span>
                  <span>-${discount.toFixed(2)}</span>
                </div>
              )}
              
              <Separator />
              
              <div className="flex justify-between font-bold">
                <span>Total</span>
                <span>${total.toFixed(2)}</span>
              </div>
            </CardContent>
            <CardFooter>
              <Button 
                className="w-full" 
                onClick={() => {
                  if (isAuthenticated) {
                    setCurrentStep('shipping');
                  } else {
                    navigate('/auth');
                    toast({
                      title: "Login Required",
                      description: "Please login or register to continue checkout.",
                    });
                  }
                }}
              >
                Proceed to Checkout
              </Button>
            </CardFooter>
          </Card>
        </div>
      </div>
    );
  };
  
  const renderShippingStep = () => {
    return (
      <div className="grid md:grid-cols-3 gap-6">
        <div className="md:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle>Shipping Information</CardTitle>
            </CardHeader>
            <form onSubmit={handleShippingSubmit}>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="fullName">Full Name</Label>
                  <Input 
                    id="fullName"
                    name="fullName"
                    value={shippingInfo.fullName}
                    onChange={handleShippingInputChange}
                    required
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="address">Address</Label>
                  <Input 
                    id="address"
                    name="address"
                    value={shippingInfo.address}
                    onChange={handleShippingInputChange}
                    required
                  />
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="city">City</Label>
                    <Input 
                      id="city"
                      name="city"
                      value={shippingInfo.city}
                      onChange={handleShippingInputChange}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="state">State</Label>
                    <Input 
                      id="state"
                      name="state"
                      value={shippingInfo.state}
                      onChange={handleShippingInputChange}
                      required
                    />
                  </div>
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="zipCode">ZIP Code</Label>
                    <Input 
                      id="zipCode"
                      name="zipCode"
                      value={shippingInfo.zipCode}
                      onChange={handleShippingInputChange}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="country">Country</Label>
                    <Input 
                      id="country"
                      name="country"
                      value={shippingInfo.country}
                      onChange={handleShippingInputChange}
                      required
                    />
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="phoneNumber">Phone Number</Label>
                  <Input 
                    id="phoneNumber"
                    name="phoneNumber"
                    value={shippingInfo.phoneNumber}
                    onChange={handleShippingInputChange}
                    required
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="shippingMethod">Shipping Method</Label>
                  <Select
                    value={shippingMethod}
                    onValueChange={handleShippingMethodChange}
                  >
                    <SelectTrigger id="shippingMethod">
                      <SelectValue placeholder="Select shipping method" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="standard">Standard Shipping ($4.99) - 5-7 business days</SelectItem>
                      <SelectItem value="express">Express Shipping ($9.99) - 2-3 business days</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </CardContent>
              <CardFooter className="flex justify-between">
                <Button 
                  variant="outline" 
                  type="button"
                  onClick={() => setCurrentStep('cart')}
                >
                  Back to Cart
                </Button>
                <Button type="submit">Continue to Payment</Button>
              </CardFooter>
            </form>
          </Card>
        </div>
        
        <div>
          <Card>
            <CardHeader>
              <CardTitle>Order Summary</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <p className="font-medium mb-2">Items</p>
                <div className="space-y-2">
                  {cart.items.map(item => (
                    <div key={item.productId} className="flex justify-between text-sm">
                      <span className="truncate max-w-[180px]">
                        {item.product.name} (x{item.quantity})
                      </span>
                      <span>${(item.product.price * item.quantity).toFixed(2)}</span>
                    </div>
                  ))}
                </div>
              </div>
              
              <Separator />
              
              <div className="flex justify-between">
                <span>Subtotal</span>
                <span>${subtotal.toFixed(2)}</span>
              </div>
              
              <div className="flex justify-between">
                <span>Shipping ({shippingMethod === 'standard' ? 'Standard' : 'Express'})</span>
                <span>${shipping.toFixed(2)}</span>
              </div>
              
              {discount > 0 && (
                <div className="flex justify-between text-green-600">
                  <span>Discount</span>
                  <span>-${discount.toFixed(2)}</span>
                </div>
              )}
              
              <Separator />
              
              <div className="flex justify-between font-bold">
                <span>Total</span>
                <span>${total.toFixed(2)}</span>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  };
  
  const renderPaymentStep = () => {
    return (
      <div className="grid md:grid-cols-3 gap-6">
        <div className="md:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle>Payment Information</CardTitle>
            </CardHeader>
            <form onSubmit={handlePaymentSubmit}>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="cardNumber">Card Number</Label>
                  <Input 
                    id="cardNumber"
                    name="cardNumber"
                    value={paymentInfo.cardNumber}
                    onChange={handlePaymentInputChange}
                    placeholder="1234 5678 9012 3456"
                    required
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="cardName">Name on Card</Label>
                  <Input 
                    id="cardName"
                    name="cardName"
                    value={paymentInfo.cardName}
                    onChange={handlePaymentInputChange}
                    required
                  />
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="expiry">Expiry Date</Label>
                    <Input 
                      id="expiry"
                      name="expiry"
                      value={paymentInfo.expiry}
                      onChange={handlePaymentInputChange}
                      placeholder="MM/YY"
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="cvv">CVV</Label>
                    <Input 
                      id="cvv"
                      name="cvv"
                      value={paymentInfo.cvv}
                      onChange={handlePaymentInputChange}
                      placeholder="123"
                      required
                    />
                  </div>
                </div>
                
                <div className="pt-4 text-sm text-gray-500">
                  <p>This is a simulation. No actual payment will be processed.</p>
                  <p>For testing, you can use any valid-looking card information.</p>
                </div>
              </CardContent>
              <CardFooter className="flex justify-between">
                <Button 
                  variant="outline"
                  type="button"
                  onClick={() => setCurrentStep('shipping')}
                >
                  Back to Shipping
                </Button>
                <Button 
                  type="submit"
                  disabled={isProcessing}
                >
                  {isProcessing ? 'Processing...' : 'Complete Order'}
                </Button>
              </CardFooter>
            </form>
          </Card>
        </div>
        
        <div>
          <Card>
            <CardHeader>
              <CardTitle>Order Summary</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <p className="font-medium mb-2">Items</p>
                <div className="space-y-2">
                  {cart.items.map(item => (
                    <div key={item.productId} className="flex justify-between text-sm">
                      <span className="truncate max-w-[180px]">
                        {item.product.name} (x{item.quantity})
                      </span>
                      <span>${(item.product.price * item.quantity).toFixed(2)}</span>
                    </div>
                  ))}
                </div>
              </div>
              
              <div>
                <p className="font-medium mb-2">Shipping Address</p>
                <address className="text-sm not-italic">
                  {shippingInfo.fullName}<br />
                  {shippingInfo.address}<br />
                  {shippingInfo.city}, {shippingInfo.state} {shippingInfo.zipCode}<br />
                  {shippingInfo.country}
                </address>
              </div>
              
              <Separator />
              
              <div className="flex justify-between">
                <span>Subtotal</span>
                <span>${subtotal.toFixed(2)}</span>
              </div>
              
              <div className="flex justify-between">
                <span>Shipping ({shippingMethod === 'standard' ? 'Standard' : 'Express'})</span>
                <span>${shipping.toFixed(2)}</span>
              </div>
              
              {discount > 0 && (
                <div className="flex justify-between text-green-600">
                  <span>Discount</span>
                  <span>-${discount.toFixed(2)}</span>
                </div>
              )}
              
              <Separator />
              
              <div className="flex justify-between font-bold">
                <span>Total</span>
                <span>${total.toFixed(2)}</span>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  };
  
  const renderConfirmationStep = () => {
    return (
      <div className="max-w-2xl mx-auto">
        <Card>
          <CardContent className="pt-6 text-center">
            <div className="rounded-full bg-green-100 p-3 w-fit mx-auto mb-4">
              <CheckCircle className="h-8 w-8 text-green-600" />
            </div>
            <h2 className="text-2xl font-bold mb-2">Thank You for Your Order!</h2>
            <p className="text-gray-600 mb-6">Your order has been placed successfully.</p>
            
            <div className="bg-sage-50 rounded-md p-4 text-left mb-6">
              <h3 className="font-medium mb-2">Order #EG-{Math.floor(Math.random() * 10000).toString().padStart(4, '0')}</h3>
              <p className="text-sm mb-1">A confirmation email has been sent to your email address.</p>
              <p className="text-sm">You can track your order status in the "Track Order" section.</p>
            </div>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button 
                variant="outline"
                onClick={() => navigate('/track-order')}
              >
                Track Your Order
              </Button>
              <Button 
                onClick={() => navigate('/')}
              >
                Continue Shopping
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  };

  return (
    <Layout>
      <div className="container mx-auto py-16 px-4">
        {/* Checkout Steps */}
        {currentStep !== 'confirmation' && (
          <div className="max-w-4xl mx-auto mb-8">
            <div className="flex items-center justify-between">
              <div className={`flex items-center ${currentStep === 'cart' ? 'text-sage-800 font-medium' : 'text-gray-500'}`}>
                <div className={`h-8 w-8 rounded-full flex items-center justify-center mr-2 ${currentStep === 'cart' ? 'bg-sage-500 text-white' : 'bg-gray-200'}`}>
                  1
                </div>
                <span>Cart</span>
              </div>
              <div className="h-px bg-gray-300 flex-1 mx-4"></div>
              <div className={`flex items-center ${currentStep === 'shipping' ? 'text-sage-800 font-medium' : 'text-gray-500'}`}>
                <div className={`h-8 w-8 rounded-full flex items-center justify-center mr-2 ${currentStep === 'shipping' ? 'bg-sage-500 text-white' : 'bg-gray-200'}`}>
                  2
                </div>
                <span>Shipping</span>
              </div>
              <div className="h-px bg-gray-300 flex-1 mx-4"></div>
              <div className={`flex items-center ${currentStep === 'payment' ? 'text-sage-800 font-medium' : 'text-gray-500'}`}>
                <div className={`h-8 w-8 rounded-full flex items-center justify-center mr-2 ${currentStep === 'payment' ? 'bg-sage-500 text-white' : 'bg-gray-200'}`}>
                  3
                </div>
                <span>Payment</span>
              </div>
            </div>
          </div>
        )}
        
        {renderStepContent()}
      </div>
    </Layout>
  );
};

export default Cart;
