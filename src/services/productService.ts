import { supabase } from '@/integrations/supabase/client';

export interface Category {
  id: string;
  name: string;
  image: string;
  subcategories: string[];
}

export interface Product {
  id: string;
  name: string;
  brand: string;
  category: string;
  subcategory?: string;
  price: number;
  oldPrice?: number;
  description: string;
  rating: number;
  reviews: number;
  images: string[];
  tags?: string[];
  isNew?: boolean;
  isFeatured?: boolean;
  isOnSale?: boolean;
  isBestseller?: boolean;
  stock: number;
}

export interface ProductReview {
  id: string;
  rating: number;
  comment: string;
  date: Date;
  user: {
    name: string;
    avatar: string | null;
  };
}

// Helper function to map database product to Product type
export const mapDatabaseProductToProduct = (dbProduct: any): Product => {
  return {
    id: dbProduct.id,
    name: dbProduct.name,
    brand: dbProduct.brand || "",
    category: dbProduct.category,
    subcategory: dbProduct.category, // Using category as subcategory since we don't have subcategory in DB
    price: dbProduct.price,
    oldPrice: dbProduct.is_sale ? dbProduct.price * (1 + dbProduct.discount_percentage / 100) : undefined,
    description: dbProduct.description || "",
    rating: 5, // Default rating since we don't have ratings yet
    reviews: 0, // Default reviews count
    images: dbProduct.image_url ? [dbProduct.image_url] : [],
    tags: [dbProduct.category, dbProduct.brand].filter(Boolean),
    isNew: dbProduct.is_new,
    isFeatured: dbProduct.is_featured,
    isOnSale: dbProduct.is_sale,
    isBestseller: dbProduct.is_bestseller,
    stock: dbProduct.stock_quantity
  };
};

// Get all categories with proper images from products
export const getAllCategories = async (): Promise<Category[]> => {
  try {
    // Get unique categories from products
    const { data: categoryData, error: categoryError } = await supabase
      .from('products')
      .select('category')
      .order('category');
      
    if (categoryError) throw categoryError;
    
    if (!categoryData || categoryData.length === 0) {
      return [];
    }
    
    // Extract unique categories
    const uniqueCategories = Array.from(new Set(categoryData.map(item => item.category)));
    const categoriesWithImages: Category[] = [];
    
    // For each category, get a representative image from a product in that category
    for (let i = 0; i < uniqueCategories.length; i++) {
      const categoryName = uniqueCategories[i];
      
      // Get one product from this category to use its image
      const { data: productData, error: productError } = await supabase
        .from('products')
        .select('image_url')
        .eq('category', categoryName)
        .limit(1)
        .single();
        
      if (productError) {
        console.error(`Error fetching image for category ${categoryName}:`, productError);
      }
      
      categoriesWithImages.push({
        id: `category-${i + 1}`,
        name: categoryName,
        image: productData?.image_url || `https://placehold.co/600x400?text=${encodeURIComponent(categoryName)}`,
        subcategories: [] // We don't have subcategories yet
      });
    }
    
    return categoriesWithImages;
  } catch (error) {
    console.error("Error fetching categories:", error);
    return [];
  }
};

// Get product count by category - Using actual category name instead of ID
export const getProductCountByCategory = async (categoryId: string): Promise<number> => {
  try {
    // Extract the category name based on the id
    const categories = await getAllCategories();
    const category = categories.find(cat => cat.id === categoryId);
    
    if (!category) {
      return 0;
    }
    
    // Count products with this category name
    const { count, error } = await supabase
      .from('products')
      .select('*', { count: 'exact', head: true })
      .eq('category', category.name);
      
    if (error) throw error;
    
    return count || 0;
  } catch (error) {
    console.error("Error fetching product count:", error);
    return 0;
  }
};

// Get category by ID
export const getCategoryById = async (id: string): Promise<Category | null> => {
  const categories = await getAllCategories();
  return categories.find(category => category.id === id) || null;
};

// Get all products
export const getAllProducts = async (): Promise<Product[]> => {
  try {
    const { data, error } = await supabase
      .from('products')
      .select('*')
      .order('name');
      
    if (error) throw error;
    
    return data.map(mapDatabaseProductToProduct);
  } catch (error) {
    console.error("Error fetching products:", error);
    return [];
  }
};

// Get products by category
export const getProductsByCategory = async (categoryId: string): Promise<Product[]> => {
  try {
    const category = await getCategoryById(categoryId);
    if (!category) return [];
    
    const { data, error } = await supabase
      .from('products')
      .select('*')
      .eq('category', category.name)
      .order('name');
      
    if (error) throw error;
    
    return data.map(mapDatabaseProductToProduct);
  } catch (error) {
    console.error("Error fetching products by category:", error);
    return [];
  }
};

// Get featured products
export const getFeaturedProducts = async (): Promise<Product[]> => {
  try {
    const { data, error } = await supabase
      .from('products')
      .select('*')
      .eq('is_featured', true)
      .order('name');
      
    if (error) throw error;
    
    return data.map(mapDatabaseProductToProduct);
  } catch (error) {
    console.error("Error fetching featured products:", error);
    return [];
  }
};

// Get new products
export const getNewProducts = async (): Promise<Product[]> => {
  try {
    const { data, error } = await supabase
      .from('products')
      .select('*')
      .eq('is_new', true)
      .order('name');
      
    if (error) throw error;
    
    return data.map(mapDatabaseProductToProduct);
  } catch (error) {
    console.error("Error fetching new products:", error);
    return [];
  }
};

// Get bestseller products
export const getBestsellers = async (): Promise<Product[]> => {
  try {
    const { data, error } = await supabase
      .from('products')
      .select('*')
      .eq('is_bestseller', true)
      .order('name');
      
    if (error) throw error;
    
    return data.map(mapDatabaseProductToProduct);
  } catch (error) {
    console.error("Error fetching bestseller products:", error);
    return [];
  }
};

// Get sale products
export const getSaleProducts = async (): Promise<Product[]> => {
  try {
    const { data, error } = await supabase
      .from('products')
      .select('*')
      .eq('is_sale', true)
      .order('name');
      
    if (error) throw error;
    
    return data.map(mapDatabaseProductToProduct);
  } catch (error) {
    console.error("Error fetching sale products:", error);
    return [];
  }
};

// Get product by ID
export const getProductById = async (id: string): Promise<Product | null> => {
  try {
    const { data, error } = await supabase
      .from('products')
      .select('*')
      .eq('id', id)
      .single();
      
    if (error) throw error;

    // Get review count and average rating
    const productData = mapDatabaseProductToProduct(data);
    const reviews = await getProductReviews(id);
    
    if (reviews && reviews.length > 0) {
      const totalRating = reviews.reduce((sum, review) => sum + review.rating, 0);
      productData.rating = totalRating / reviews.length;
      productData.reviews = reviews.length;
    }
    
    return productData;
  } catch (error) {
    console.error("Error fetching product by ID:", error);
    return null;
  }
};

// Get related products
export const getRelatedProducts = async (product: Product): Promise<Product[]> => {
  try {
    const { data, error } = await supabase
      .from('products')
      .select('*')
      .eq('category', product.category)
      .neq('id', product.id)
      .limit(4)
      .order('name');
      
    if (error) throw error;
    
    return data.map(mapDatabaseProductToProduct);
  } catch (error) {
    console.error("Error fetching related products:", error);
    return [];
  }
};

// Search products
export const searchProducts = async (query: string): Promise<Product[]> => {
  try {
    // Tokenize the search query
    const searchTerms = query.toLowerCase().split(/\s+/).filter(Boolean);
    
    if (searchTerms.length === 0) {
      return [];
    }
    
    // Construct the search query for multiple fields
    // Using multiple .or() conditions to search across name, category, description, and brand
    let searchQuery = supabase
      .from('products')
      .select('*');
    
    // Add search conditions for each term
    for (const term of searchTerms) {
      searchQuery = searchQuery.or(
        `name.ilike.%${term}%,category.ilike.%${term}%,description.ilike.%${term}%,brand.ilike.%${term}%`
      );
    }
    
    const { data, error } = await searchQuery.limit(10); // Limit to 10 results
      
    if (error) throw error;
    
    return data.map(mapDatabaseProductToProduct);
  } catch (error) {
    console.error("Error searching products:", error);
    return [];
  }
};

// Get product reviews
export const getProductReviews = async (productId: string): Promise<ProductReview[]> => {
  try {
    const { data: reviews, error } = await supabase
      .from('reviews')
      .select(`
        *,
        profiles (
          first_name,
          last_name,
          avatar_url
        )
      `)
      .eq('product_id', productId)
      .order('created_at', { ascending: false });

    if (error) throw error;

    if (!reviews || reviews.length === 0) return [];

    return reviews.map(review => {
      // Safely check if profiles exists and is an object
      const profiles = review.profiles as any;
      const firstName = profiles && typeof profiles === 'object' ? profiles.first_name || '' : '';
      const lastName = profiles && typeof profiles === 'object' ? profiles.last_name || '' : '';
      const avatarUrl = profiles && typeof profiles === 'object' ? profiles.avatar_url || null : null;
      
      return {
        id: review.id,
        rating: review.rating,
        comment: review.comment,
        date: new Date(review.created_at),
        user: {
          name: `${firstName} ${lastName}`.trim() || 'Anonymous User',
          avatar: avatarUrl
        }
      };
    });
  } catch (error) {
    console.error("Error fetching product reviews:", error);
    return [];
  }
};

// Submit a review
export const submitProductReview = async (
  userId: string, 
  productId: string, 
  rating: number, 
  comment: string
) => {
  try {
    const { data, error } = await supabase
      .from('reviews')
      .insert({
        user_id: userId,
        product_id: productId,
        rating,
        comment
      })
      .select();
    
    if (error) throw error;
    
    return data[0];
  } catch (error) {
    console.error("Error submitting review:", error);
    throw error;
  }
};

// Delete a review
export const deleteProductReview = async (reviewId: string) => {
  try {
    const { error } = await supabase
      .from('reviews')
      .delete()
      .eq('id', reviewId);
    
    if (error) throw error;
    
    return true;
  } catch (error) {
    console.error("Error deleting review:", error);
    throw error;
  }
};

// Get order by ID
export const getOrderById = async (orderId: string) => {
  try {
    const { data: order, error } = await supabase
      .from('orders')
      .select('*')
      .eq('id', orderId)
      .single();
    
    if (error) throw error;
    
    // Get order items
    const { data: items, error: itemsError } = await supabase
      .from('order_items')
      .select(`
        *,
        products (*)
      `)
      .eq('order_id', orderId);
    
    if (itemsError) throw itemsError;
    
    return {
      ...order,
      items: items.map(item => ({
        id: item.id,
        quantity: item.quantity,
        price: item.price_at_purchase,
        product: mapDatabaseProductToProduct(item.products)
      }))
    };
  } catch (error) {
    console.error("Error fetching order:", error);
    throw new Error(`Order not found: ${error.message}`);
  }
};

// Get user orders
export const getUserOrders = async (userId: string) => {
  try {
    const { data: orders, error } = await supabase
      .from('orders')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false });
    
    if (error) throw error;
    
    return orders;
  } catch (error) {
    console.error("Error fetching user orders:", error);
    throw error;
  }
};

// Update order status
export const updateOrderStatus = async (orderId: string, status: string) => {
  try {
    const { data, error } = await supabase
      .from('orders')
      .update({ status })
      .eq('id', orderId)
      .select();
    
    if (error) throw error;
    
    return data[0];
  } catch (error) {
    console.error("Error updating order status:", error);
    throw error;
  }
};
