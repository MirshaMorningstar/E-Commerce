
-- Enable Row Level Security for orders table
ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;

-- Create RLS policy to allow authenticated users to select their own orders
CREATE POLICY "Users can view their own orders" 
  ON public.orders 
  FOR SELECT 
  USING (auth.uid() = user_id);

-- Create RLS policy to allow authenticated users to insert their own orders
CREATE POLICY "Users can insert their own orders" 
  ON public.orders 
  FOR INSERT 
  WITH CHECK (auth.uid() = user_id);

-- Create RLS policy to allow authenticated users to update their own orders
CREATE POLICY "Users can update their own orders" 
  ON public.orders 
  FOR UPDATE 
  USING (auth.uid() = user_id);

-- Enable Row Level Security for order_items table
ALTER TABLE public.order_items ENABLE ROW LEVEL SECURITY;

-- Create RLS policy to allow authenticated users to select their own order items
CREATE POLICY "Users can view their own order items" 
  ON public.order_items 
  FOR SELECT 
  USING (
    order_id IN (
      SELECT id FROM public.orders WHERE user_id = auth.uid()
    )
  );

-- Create RLS policy to allow authenticated users to insert their own order items
CREATE POLICY "Users can insert their own order items" 
  ON public.order_items 
  FOR INSERT 
  WITH CHECK (
    order_id IN (
      SELECT id FROM public.orders WHERE user_id = auth.uid()
    )
  );
