
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

// Get all categories
export const getAllCategories = async (): Promise<Category[]> => {
  try {
    // Get unique categories from products
    const { data, error } = await supabase
      .from('products')
      .select('category')
      .order('category');
      
    if (error) throw error;
    
    // Extract unique categories
    const uniqueCategories = Array.from(new Set(data.map(item => item.category)));
    
    // Create category objects
    return uniqueCategories.map((category, index) => ({
      id: `category-${index + 1}`,
      name: category,
      image: `https://i.pravatar.cc/300?img=${index + 20}`, // Placeholder image
      subcategories: [] // We don't have subcategories yet
    }));
  } catch (error) {
    console.error("Error fetching categories:", error);
    
    // Return mock categories if we couldn't fetch from the database
    return [
      {
        id: "skincare",
        name: "Skincare",
        image: "https://i.pravatar.cc/300?img=20",
        subcategories: ["Cleansers", "Moisturizers", "Serums"]
      },
      {
        id: "makeup",
        name: "Makeup",
        image: "https://i.pravatar.cc/300?img=21",
        subcategories: ["Face", "Eyes", "Lips"]
      },
      {
        id: "haircare",
        name: "Haircare",
        image: "https://i.pravatar.cc/300?img=22",
        subcategories: ["Shampoo", "Conditioner", "Styling"]
      },
      {
        id: "fragrances",
        name: "Fragrances",
        image: "https://i.pravatar.cc/300?img=23",
        subcategories: ["Perfumes", "Body Sprays", "Gift Sets"]
      },
      {
        id: "tools",
        name: "Tools",
        image: "https://i.pravatar.cc/300?img=24",
        subcategories: ["Brushes", "Sponges", "Accessories"]
      },
      {
        id: "bath-body",
        name: "Bath & Body",
        image: "https://i.pravatar.cc/300?img=25",
        subcategories: ["Shower Gels", "Body Lotions", "Hand Care"]
      }
    ];
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
    
    return mapDatabaseProductToProduct(data);
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
    const { data, error } = await supabase
      .from('products')
      .select('*')
      .ilike('name', `%${query}%`);
      
    if (error) throw error;
    
    return data.map(mapDatabaseProductToProduct);
  } catch (error) {
    console.error("Error searching products:", error);
    return [];
  }
};
