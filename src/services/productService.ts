
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

// Sample products data
const products: Product[] = [
  {
    id: "prod1",
    name: "Radiance Serum",
    brand: "Glow Essentials",
    category: "Skincare",
    subcategory: "Serums",
    price: 49.99,
    oldPrice: 59.99,
    description: "This powerful serum is enriched with Vitamin C and Hyaluronic Acid to boost skin radiance and reduce the appearance of fine lines.",
    rating: 4.8,
    reviews: 123,
    images: [
      "https://images.unsplash.com/photo-1620916566886-f294754d1acd?q=80&w=800",
      "https://images.unsplash.com/photo-1611088135743-9d7ce3a54605?q=80&w=800"
    ],
    tags: ["anti-aging", "hydrating", "brightening"],
    isNew: true,
    isFeatured: true,
    stock: 45
  },
  {
    id: "prod2",
    name: "Matte Lipstick",
    brand: "Color Pop",
    category: "Makeup",
    subcategory: "Lipstick",
    price: 18.99,
    description: "Long-lasting matte lipstick that doesn't dry out your lips. Available in 12 stunning shades.",
    rating: 4.5,
    reviews: 89,
    images: [
      "https://images.unsplash.com/photo-1586495777744-4413f21062fa?q=80&w=800",
      "https://images.unsplash.com/photo-1617897903246-719242758050?q=80&w=800"
    ],
    tags: ["matte", "long-lasting", "vegan"],
    isFeatured: true,
    stock: 78
  },
  {
    id: "prod3",
    name: "Hydrating Cleanser",
    brand: "Pure Skin",
    category: "Skincare",
    subcategory: "Cleansers",
    price: 24.50,
    description: "Gentle foaming cleanser that removes impurities without stripping the skin of natural oils.",
    rating: 4.7,
    reviews: 215,
    images: [
      "https://images.unsplash.com/photo-1556229010-6c3f2c9ca5f8?q=80&w=800",
      "https://images.unsplash.com/photo-1612532275214-e4ca76d0e4d1?q=80&w=800"
    ],
    tags: ["sensitive skin", "hydrating", "gentle"],
    isOnSale: true,
    stock: 32
  },
  {
    id: "prod4",
    name: "Volume Mascara",
    brand: "Lash Queen",
    category: "Makeup",
    subcategory: "Mascara",
    price: 22.99,
    description: "Volumizing mascara that gives you dramatic lashes without clumps or flaking.",
    rating: 4.4,
    reviews: 178,
    images: [
      "https://images.unsplash.com/photo-1512496015851-a90fb38ba796?q=80&w=800",
      "https://images.unsplash.com/photo-1631730359585-5d3a3f37d6b3?q=80&w=800"
    ],
    tags: ["volumizing", "lengthening", "waterproof"],
    stock: 65
  },
  {
    id: "prod5",
    name: "Repair Hair Mask",
    brand: "Hair Therapy",
    category: "Haircare",
    subcategory: "Hair Masks",
    price: 34.95,
    oldPrice: 42.99,
    description: "Intensive treatment that repairs damaged hair and split ends in just 5 minutes.",
    rating: 4.9,
    reviews: 67,
    images: [
      "https://images.unsplash.com/photo-1526947425960-945c6e72858f?q=80&w=800",
      "https://images.unsplash.com/photo-1559599101-f09722fb4948?q=80&w=800"
    ],
    tags: ["repair", "strengthening", "color-safe"],
    isNew: true,
    stock: 28
  },
  {
    id: "prod6",
    name: "Rose Quartz Roller",
    brand: "Crystal Beauty",
    category: "Tools",
    subcategory: "Face Tools",
    price: 28.00,
    description: "Facial massage tool that reduces puffiness, improves circulation and helps products absorb better.",
    rating: 4.6,
    reviews: 92,
    images: [
      "https://images.unsplash.com/photo-1563804447127-f496a396f79a?q=80&w=800",
      "https://images.unsplash.com/photo-1564221710304-0b37c8b9d729?q=80&w=800"
    ],
    tags: ["facial tools", "massage", "depuffing"],
    isFeatured: true,
    stock: 53
  },
  {
    id: "prod7",
    name: "Silk Pillowcase",
    brand: "Sleep Beauty",
    category: "Tools",
    subcategory: "Hair Care",
    price: 45.00,
    oldPrice: 55.00,
    description: "Silk pillowcase that prevents hair breakage and keeps skin hydrated overnight.",
    rating: 4.8,
    reviews: 41,
    images: [
      "https://images.unsplash.com/photo-1618022351524-308a9c69eb7d?q=80&w=800",
      "https://images.unsplash.com/photo-1584100936595-c0654b55a2e2?q=80&w=800"
    ],
    tags: ["sleep", "hair care", "anti-aging"],
    isOnSale: true,
    stock: 19
  },
  {
    id: "prod8",
    name: "Floral Perfume",
    brand: "Scent Story",
    category: "Fragrance",
    subcategory: "Perfumes",
    price: 68.00,
    description: "Elegant floral fragrance with notes of jasmine, rose and a hint of vanilla.",
    rating: 4.7,
    reviews: 83,
    images: [
      "https://images.unsplash.com/photo-1617897903246-719242758050?q=80&w=800",
      "https://images.unsplash.com/photo-1594035910387-fea47794261f?q=80&w=800"
    ],
    tags: ["floral", "long-lasting", "feminine"],
    stock: 37
  },
  {
    id: "prod9",
    name: "SPF 50 Sunscreen",
    brand: "Sun Shield",
    category: "Skincare",
    subcategory: "Sun Care",
    price: 32.50,
    description: "Lightweight, non-greasy sunscreen that protects against UVA and UVB rays without leaving a white cast.",
    rating: 4.9,
    reviews: 156,
    images: [
      "https://images.unsplash.com/photo-1593560368921-892db01394ce?q=80&w=800",
      "https://images.unsplash.com/photo-1556228841-a3d3b524bffe?q=80&w=800"
    ],
    tags: ["sun protection", "oil-free", "sensitive skin"],
    isFeatured: true,
    stock: 49
  },
  {
    id: "prod10",
    name: "Coconut Body Scrub",
    brand: "Tropical Touch",
    category: "Bath & Body",
    subcategory: "Scrubs",
    price: 19.95,
    oldPrice: 24.95,
    description: "Exfoliating body scrub with coconut oil and sugar crystals to reveal soft, glowing skin.",
    rating: 4.5,
    reviews: 112,
    images: [
      "https://images.unsplash.com/photo-1608248597279-f99d160bfcbc?q=80&w=800",
      "https://images.unsplash.com/photo-1601612628452-9e99ced43524?q=80&w=800"
    ],
    tags: ["exfoliating", "moisturizing", "natural"],
    isOnSale: true,
    stock: 60
  },
  {
    id: "prod11",
    name: "Eye Shadow Palette",
    brand: "Color Pop",
    category: "Makeup",
    subcategory: "Eyeshadow",
    price: 42.00,
    description: "Versatile palette with 12 highly pigmented shades ranging from neutral to bold.",
    rating: 4.6,
    reviews: 74,
    images: [
      "https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?q=80&w=800",
      "https://images.unsplash.com/photo-1583241800698-e8ab01832cf3?q=80&w=800"
    ],
    tags: ["pigmented", "blendable", "versatile"],
    isNew: true,
    stock: 25
  },
  {
    id: "prod12",
    name: "Luxury Bath Bombs Set",
    brand: "Bubble Bliss",
    category: "Bath & Body",
    subcategory: "Bath Bombs",
    price: 29.99,
    description: "Set of 6 colorful bath bombs with different scents and moisturizing properties.",
    rating: 4.8,
    reviews: 63,
    images: [
      "https://images.unsplash.com/photo-1575263066855-17854947e480?q=80&w=800",
      "https://images.unsplash.com/photo-1604771616762-73380020e87d?q=80&w=800"
    ],
    tags: ["relaxing", "gift set", "moisturizing"],
    stock: 42
  }
];

// Get all products
export const getAllProducts = (): Product[] => {
  return products;
};

// Get featured products
export const getFeaturedProducts = (): Product[] => {
  return products.filter(product => product.isFeatured);
};

// Get new products
export const getNewProducts = (): Product[] => {
  return products.filter(product => product.isNew);
};

// Get products on sale
export const getOnSaleProducts = (): Product[] => {
  return products.filter(product => product.isOnSale);
};

// Get product by ID
export const getProductById = (id: string): Product | undefined => {
  return products.find(product => product.id === id);
};

// Get products by category
export const getProductsByCategory = (category: string): Product[] => {
  return products.filter(product => product.category === category);
};

// Get products by subcategory
export const getProductsBySubcategory = (subcategory: string): Product[] => {
  return products.filter(product => product.subcategory === subcategory);
};

// Search products
export const searchProducts = (query: string): Product[] => {
  const lowerCaseQuery = query.toLowerCase();
  return products.filter(product => 
    product.name.toLowerCase().includes(lowerCaseQuery) ||
    product.description.toLowerCase().includes(lowerCaseQuery) ||
    product.brand.toLowerCase().includes(lowerCaseQuery) ||
    product.category.toLowerCase().includes(lowerCaseQuery) ||
    product.subcategory.toLowerCase().includes(lowerCaseQuery) ||
    product.tags.some(tag => tag.toLowerCase().includes(lowerCaseQuery))
  );
};

// Get all categories
export const getAllCategories = (): Category[] => {
  return categories;
};

// Get category by ID
export const getCategoryById = (id: string): Category | undefined => {
  return categories.find(category => category.id === id);
};
