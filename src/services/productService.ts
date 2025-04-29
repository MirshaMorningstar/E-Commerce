
import { supabase } from "@/integrations/supabase/client";

export type Product = {
  id: string;
  name: string;
  brand: string;
  category: string;
  subcategory: string;
  price: number;
  oldPrice?: number;
  description: string;
  rating: number;
  reviews: number;
  images: string[];
  tags: string[];
  isNew?: boolean;
  isFeatured?: boolean;
  isOnSale?: boolean;
  stock: number;
};

export type Category = {
  id: string;
  name: string;
  image: string;
  subcategories: string[];
};

// Map categories with images
const categories: Category[] = [
  {
    id: "cat1",
    name: "Skincare",
    image: "https://images.unsplash.com/photo-1571875257727-256c39da42af?q=80&w=800",
    subcategories: ["Cleansers", "Moisturizers", "Serums", "Face Masks", "Eye Care"]
  },
  {
    id: "cat2",
    name: "Makeup",
    image: "https://images.unsplash.com/photo-1596704017254-9b121068fb31?q=80&w=800",
    subcategories: ["Foundation", "Lipstick", "Mascara", "Eyeshadow", "Blush"]
  },
  {
    id: "cat3",
    name: "Haircare",
    image: "https://images.unsplash.com/photo-1527799820374-dcf8d9d4a388?q=80&w=800",
    subcategories: ["Shampoo", "Conditioner", "Hair Masks", "Styling", "Hair Color"]
  },
  {
    id: "cat4",
    name: "Fragrance",
    image: "https://images.unsplash.com/photo-1617897903246-719242758050?q=80&w=800",
    subcategories: ["Perfumes", "Body Mists", "Colognes", "Gift Sets"]
  },
  {
    id: "cat5",
    name: "Bath & Body",
    image: "https://images.unsplash.com/photo-1570194065650-d682c124132b?q=80&w=800",
    subcategories: ["Body Wash", "Lotion", "Scrubs", "Bath Bombs", "Hand Care"]
  },
  {
    id: "cat6",
    name: "Tools",
    image: "https://images.unsplash.com/photo-1522338242992-e1a54906a8da?q=80&w=800",
    subcategories: ["Brushes", "Sponges", "Curlers", "Hair Dryers", "Face Tools"]
  }
];

// Utility function to map database product to Product type
const mapDatabaseProductToProduct = (dbProduct: any): Product => {
  return {
    id: dbProduct.id,
    name: dbProduct.name,
    brand: dbProduct.brand || "",
    category: dbProduct.category,
    subcategory: dbProduct.category, // Using category as subcategory 
    price: dbProduct.price,
    oldPrice: dbProduct.is_sale ? dbProduct.price * (1 + dbProduct.discount_percentage / 100) : undefined,
    description: dbProduct.description || "",
    rating: 4.5, // Default rating
    reviews: 0, // Default reviews count
    images: [dbProduct.image_url],
    tags: [dbProduct.category, dbProduct.brand].filter(Boolean),
    isNew: dbProduct.is_new,
    isFeatured: dbProduct.is_featured,
    isOnSale: dbProduct.is_sale,
    stock: dbProduct.stock_quantity
  };
};

// Get all products
export const getAllProducts = async (): Promise<Product[]> => {
  try {
    const { data, error } = await supabase
      .from('products')
      .select('*');
      
    if (error) {
      console.error("Error fetching products:", error);
      return [];
    }
    
    return data.map(mapDatabaseProductToProduct);
  } catch (err) {
    console.error("Error in getAllProducts:", err);
    return [];
  }
};

// Get featured products
export const getFeaturedProducts = async (): Promise<Product[]> => {
  try {
    const { data, error } = await supabase
      .from('products')
      .select('*')
      .eq('is_featured', true);
      
    if (error) {
      console.error("Error fetching featured products:", error);
      return [];
    }
    
    return data.map(mapDatabaseProductToProduct);
  } catch (err) {
    console.error("Error in getFeaturedProducts:", err);
    return [];
  }
};

// Get new products
export const getNewProducts = async (): Promise<Product[]> => {
  try {
    const { data, error } = await supabase
      .from('products')
      .select('*')
      .eq('is_new', true);
      
    if (error) {
      console.error("Error fetching new products:", error);
      return [];
    }
    
    return data.map(mapDatabaseProductToProduct);
  } catch (err) {
    console.error("Error in getNewProducts:", err);
    return [];
  }
};

// Get products on sale
export const getOnSaleProducts = async (): Promise<Product[]> => {
  try {
    const { data, error } = await supabase
      .from('products')
      .select('*')
      .eq('is_sale', true);
      
    if (error) {
      console.error("Error fetching sale products:", error);
      return [];
    }
    
    return data.map(mapDatabaseProductToProduct);
  } catch (err) {
    console.error("Error in getOnSaleProducts:", err);
    return [];
  }
};

// Get product by ID
export const getProductById = async (id: string): Promise<Product | undefined> => {
  try {
    const { data, error } = await supabase
      .from('products')
      .select('*')
      .eq('id', id)
      .single();
      
    if (error) {
      console.error("Error fetching product by ID:", error);
      return undefined;
    }
    
    return mapDatabaseProductToProduct(data);
  } catch (err) {
    console.error("Error in getProductById:", err);
    return undefined;
  }
};

// Get products by category
export const getProductsByCategory = async (category: string): Promise<Product[]> => {
  try {
    const { data, error } = await supabase
      .from('products')
      .select('*')
      .eq('category', category);
      
    if (error) {
      console.error("Error fetching products by category:", error);
      return [];
    }
    
    return data.map(mapDatabaseProductToProduct);
  } catch (err) {
    console.error("Error in getProductsByCategory:", err);
    return [];
  }
};

// Get products by subcategory (using category since we don't have subcategory in DB)
export const getProductsBySubcategory = async (subcategory: string): Promise<Product[]> => {
  // Since we don't have subcategories in our database, we're using category
  return getProductsByCategory(subcategory);
};

// Search products
export const searchProducts = async (query: string): Promise<Product[]> => {
  try {
    const lowerCaseQuery = query.toLowerCase();
    const { data, error } = await supabase
      .from('products')
      .select('*')
      .or(`name.ilike.%${lowerCaseQuery}%,description.ilike.%${lowerCaseQuery}%,brand.ilike.%${lowerCaseQuery}%,category.ilike.%${lowerCaseQuery}%`);
      
    if (error) {
      console.error("Error searching products:", error);
      return [];
    }
    
    return data.map(mapDatabaseProductToProduct);
  } catch (err) {
    console.error("Error in searchProducts:", err);
    return [];
  }
};

// Get all categories
export const getAllCategories = (): Category[] => {
  return categories;
};

// Get category by ID
export const getCategoryById = (id: string): Category | undefined => {
  return categories.find(category => category.id === id);
};
