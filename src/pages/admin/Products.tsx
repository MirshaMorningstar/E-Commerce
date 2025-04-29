
import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getAllProducts } from '@/services/productService';
import { updateProduct, addProduct, deleteProduct } from '@/services/adminService';
import { Spinner } from '@/components/ui/spinner';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Edit, Trash2, MoreVertical, PlusCircle, Search } from 'lucide-react';

const AdminProducts = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<any>(null);
  const [formData, setFormData] = useState({
    name: '',
    price: '',
    category: '',
    brand: '',
    description: '',
    image_url: '',
    stock_quantity: '',
    is_new: false,
    is_featured: false,
    is_sale: false,
    is_bestseller: false,
    discount_percentage: ''
  });
  
  const queryClient = useQueryClient();
  
  const { data: products, isLoading } = useQuery({
    queryKey: ['admin-products'],
    queryFn: getAllProducts
  });
  
  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: any }) => updateProduct(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-products'] });
      setIsEditDialogOpen(false);
    },
  });
  
  const addMutation = useMutation({
    mutationFn: (data: any) => addProduct(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-products'] });
      setIsAddDialogOpen(false);
      resetForm();
    },
  });
  
  const deleteMutation = useMutation({
    mutationFn: (id: string) => deleteProduct(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-products'] });
      setIsDeleteDialogOpen(false);
    },
  });
  
  const handleEditClick = (product: any) => {
    setSelectedProduct(product);
    setFormData({
      name: product.name,
      price: product.price.toString(),
      category: product.category,
      brand: product.brand || '',
      description: product.description || '',
      image_url: product.images[0] || '',
      stock_quantity: product.stock.toString(),
      is_new: product.isNew || false,
      is_featured: product.isFeatured || false,
      is_sale: product.isOnSale || false,
      is_bestseller: product.isBestseller || false,
      discount_percentage: product.oldPrice ? (((product.oldPrice - product.price) / product.oldPrice) * 100).toFixed(0) : '0'
    });
    setIsEditDialogOpen(true);
  };
  
  const handleAddClick = () => {
    resetForm();
    setIsAddDialogOpen(true);
  };
  
  const handleDeleteClick = (product: any) => {
    setSelectedProduct(product);
    setIsDeleteDialogOpen(true);
  };
  
  const handleSubmitEdit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const productData = {
      name: formData.name,
      price: parseFloat(formData.price),
      category: formData.category,
      brand: formData.brand || null,
      description: formData.description || null,
      image_url: formData.image_url,
      stock_quantity: parseInt(formData.stock_quantity, 10),
      is_new: formData.is_new,
      is_featured: formData.is_featured,
      is_sale: formData.is_sale,
      is_bestseller: formData.is_bestseller,
      discount_percentage: formData.is_sale ? parseFloat(formData.discount_percentage) : 0
    };
    
    updateMutation.mutate({ id: selectedProduct.id, data: productData });
  };
  
  const handleSubmitAdd = (e: React.FormEvent) => {
    e.preventDefault();
    
    const productData = {
      name: formData.name,
      price: parseFloat(formData.price),
      category: formData.category,
      brand: formData.brand || null,
      description: formData.description || null,
      image_url: formData.image_url,
      stock_quantity: parseInt(formData.stock_quantity, 10),
      is_new: formData.is_new,
      is_featured: formData.is_featured,
      is_sale: formData.is_sale,
      is_bestseller: formData.is_bestseller,
      discount_percentage: formData.is_sale ? parseFloat(formData.discount_percentage) : 0
    };
    
    addMutation.mutate(productData);
  };
  
  const handleConfirmDelete = () => {
    if (selectedProduct) {
      deleteMutation.mutate(selectedProduct.id);
    }
  };
  
  const resetForm = () => {
    setFormData({
      name: '',
      price: '',
      category: '',
      brand: '',
      description: '',
      image_url: '',
      stock_quantity: '',
      is_new: false,
      is_featured: false,
      is_sale: false,
      is_bestseller: false,
      discount_percentage: '0'
    });
  };
  
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };
  
  const handleCheckboxChange = (name: string, checked: boolean) => {
    setFormData({ ...formData, [name]: checked });
  };
  
  // Filter products based on search query
  const filteredProducts = products?.filter(product => 
    product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    product.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
    (product.brand && product.brand.toLowerCase().includes(searchQuery.toLowerCase()))
  ) || [];
  
  if (isLoading) {
    return (
      <div className="flex h-96 items-center justify-center">
        <Spinner size="lg" />
      </div>
    );
  }
  
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Products Management</h1>
        <Button onClick={handleAddClick}>
          <PlusCircle className="mr-2 h-4 w-4" />
          Add Product
        </Button>
      </div>
      
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Search products..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="pl-10"
        />
      </div>
      
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Image</TableHead>
              <TableHead>Name</TableHead>
              <TableHead>Category</TableHead>
              <TableHead>Price</TableHead>
              <TableHead>Stock</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredProducts.map((product) => (
              <TableRow key={product.id}>
                <TableCell>
                  <img
                    src={product.images[0]}
                    alt={product.name}
                    className="h-10 w-10 rounded-md object-cover"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src = "https://placehold.co/100x100?text=Product";
                    }}
                  />
                </TableCell>
                <TableCell className="font-medium">{product.name}</TableCell>
                <TableCell>{product.category}</TableCell>
                <TableCell>
                  ${product.price.toFixed(2)}
                  {product.oldPrice && (
                    <span className="ml-2 line-through text-muted-foreground text-sm">
                      ${product.oldPrice.toFixed(2)}
                    </span>
                  )}
                </TableCell>
                <TableCell>
                  <span className={product.stock <= 5 ? 'text-red-600 font-medium' : ''}>
                    {product.stock}
                  </span>
                </TableCell>
                <TableCell>
                  <div className="flex flex-wrap gap-1">
                    {product.isNew && (
                      <span className="px-2 py-0.5 bg-blue-100 text-blue-800 rounded-full text-xs">New</span>
                    )}
                    {product.isFeatured && (
                      <span className="px-2 py-0.5 bg-purple-100 text-purple-800 rounded-full text-xs">Featured</span>
                    )}
                    {product.isOnSale && (
                      <span className="px-2 py-0.5 bg-red-100 text-red-800 rounded-full text-xs">Sale</span>
                    )}
                    {product.isBestseller && (
                      <span className="px-2 py-0.5 bg-amber-100 text-amber-800 rounded-full text-xs">Bestseller</span>
                    )}
                  </div>
                </TableCell>
                <TableCell className="text-right">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon">
                        <MoreVertical className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem onClick={() => handleEditClick(product)}>
                        <Edit className="mr-2 h-4 w-4" />
                        Edit
                      </DropdownMenuItem>
                      <DropdownMenuItem 
                        onClick={() => handleDeleteClick(product)}
                        className="text-red-600"
                      >
                        <Trash2 className="mr-2 h-4 w-4" />
                        Delete
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            ))}
            
            {filteredProducts.length === 0 && (
              <TableRow>
                <TableCell colSpan={7} className="text-center h-24">
                  No products found
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
      
      {/* Edit Product Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Edit Product</DialogTitle>
            <DialogDescription>
              Make changes to the product details.
            </DialogDescription>
          </DialogHeader>
          
          <form onSubmit={handleSubmitEdit} className="space-y-6 py-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="name">Product Name *</Label>
                <Input
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  required
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="price">Price *</Label>
                <Input
                  id="price"
                  name="price"
                  type="number"
                  step="0.01"
                  value={formData.price}
                  onChange={handleInputChange}
                  required
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="category">Category *</Label>
                <Input
                  id="category"
                  name="category"
                  value={formData.category}
                  onChange={handleInputChange}
                  required
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="brand">Brand</Label>
                <Input
                  id="brand"
                  name="brand"
                  value={formData.brand}
                  onChange={handleInputChange}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="stock_quantity">Stock Quantity *</Label>
                <Input
                  id="stock_quantity"
                  name="stock_quantity"
                  type="number"
                  value={formData.stock_quantity}
                  onChange={handleInputChange}
                  required
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="image_url">Image URL *</Label>
                <Input
                  id="image_url"
                  name="image_url"
                  value={formData.image_url}
                  onChange={handleInputChange}
                  required
                />
              </div>
              
              <div className="space-y-2 md:col-span-2">
                <Label htmlFor="description">Description</Label>
                <Input
                  id="description"
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                />
              </div>
              
              <div className="grid grid-cols-2 gap-4 md:col-span-2">
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="is_new"
                    checked={formData.is_new}
                    onCheckedChange={(checked) => handleCheckboxChange('is_new', !!checked)}
                  />
                  <Label htmlFor="is_new">New Arrival</Label>
                </div>
                
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="is_featured"
                    checked={formData.is_featured}
                    onCheckedChange={(checked) => handleCheckboxChange('is_featured', !!checked)}
                  />
                  <Label htmlFor="is_featured">Featured</Label>
                </div>
                
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="is_bestseller"
                    checked={formData.is_bestseller}
                    onCheckedChange={(checked) => handleCheckboxChange('is_bestseller', !!checked)}
                  />
                  <Label htmlFor="is_bestseller">Bestseller</Label>
                </div>
                
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="is_sale"
                    checked={formData.is_sale}
                    onCheckedChange={(checked) => handleCheckboxChange('is_sale', !!checked)}
                  />
                  <Label htmlFor="is_sale">On Sale</Label>
                </div>
              </div>
              
              {formData.is_sale && (
                <div className="space-y-2">
                  <Label htmlFor="discount_percentage">Discount Percentage *</Label>
                  <Input
                    id="discount_percentage"
                    name="discount_percentage"
                    type="number"
                    min="1"
                    max="99"
                    value={formData.discount_percentage}
                    onChange={handleInputChange}
                    required={formData.is_sale}
                  />
                </div>
              )}
            </div>
            
            <DialogFooter>
              <Button 
                type="button" 
                variant="outline" 
                onClick={() => setIsEditDialogOpen(false)}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={updateMutation.isPending}>
                {updateMutation.isPending ? <Spinner size="sm" className="mr-2" /> : null}
                Save Changes
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
      
      {/* Add Product Dialog */}
      <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Add New Product</DialogTitle>
            <DialogDescription>
              Enter the details for the new product.
            </DialogDescription>
          </DialogHeader>
          
          <form onSubmit={handleSubmitAdd} className="space-y-6 py-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="add-name">Product Name *</Label>
                <Input
                  id="add-name"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  required
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="add-price">Price *</Label>
                <Input
                  id="add-price"
                  name="price"
                  type="number"
                  step="0.01"
                  value={formData.price}
                  onChange={handleInputChange}
                  required
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="add-category">Category *</Label>
                <Input
                  id="add-category"
                  name="category"
                  value={formData.category}
                  onChange={handleInputChange}
                  required
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="add-brand">Brand</Label>
                <Input
                  id="add-brand"
                  name="brand"
                  value={formData.brand}
                  onChange={handleInputChange}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="add-stock_quantity">Stock Quantity *</Label>
                <Input
                  id="add-stock_quantity"
                  name="stock_quantity"
                  type="number"
                  value={formData.stock_quantity}
                  onChange={handleInputChange}
                  required
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="add-image_url">Image URL *</Label>
                <Input
                  id="add-image_url"
                  name="image_url"
                  value={formData.image_url}
                  onChange={handleInputChange}
                  required
                />
              </div>
              
              <div className="space-y-2 md:col-span-2">
                <Label htmlFor="add-description">Description</Label>
                <Input
                  id="add-description"
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                />
              </div>
              
              <div className="grid grid-cols-2 gap-4 md:col-span-2">
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="add-is_new"
                    checked={formData.is_new}
                    onCheckedChange={(checked) => handleCheckboxChange('is_new', !!checked)}
                  />
                  <Label htmlFor="add-is_new">New Arrival</Label>
                </div>
                
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="add-is_featured"
                    checked={formData.is_featured}
                    onCheckedChange={(checked) => handleCheckboxChange('is_featured', !!checked)}
                  />
                  <Label htmlFor="add-is_featured">Featured</Label>
                </div>
                
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="add-is_bestseller"
                    checked={formData.is_bestseller}
                    onCheckedChange={(checked) => handleCheckboxChange('is_bestseller', !!checked)}
                  />
                  <Label htmlFor="add-is_bestseller">Bestseller</Label>
                </div>
                
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="add-is_sale"
                    checked={formData.is_sale}
                    onCheckedChange={(checked) => handleCheckboxChange('is_sale', !!checked)}
                  />
                  <Label htmlFor="add-is_sale">On Sale</Label>
                </div>
              </div>
              
              {formData.is_sale && (
                <div className="space-y-2">
                  <Label htmlFor="add-discount_percentage">Discount Percentage *</Label>
                  <Input
                    id="add-discount_percentage"
                    name="discount_percentage"
                    type="number"
                    min="1"
                    max="99"
                    value={formData.discount_percentage}
                    onChange={handleInputChange}
                    required={formData.is_sale}
                  />
                </div>
              )}
            </div>
            
            <DialogFooter>
              <Button 
                type="button" 
                variant="outline" 
                onClick={() => setIsAddDialogOpen(false)}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={addMutation.isPending}>
                {addMutation.isPending ? <Spinner size="sm" className="mr-2" /> : null}
                Add Product
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
      
      {/* Delete Confirmation Dialog */}
      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirm Deletion</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete this product? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button 
              type="button" 
              variant="outline" 
              onClick={() => setIsDeleteDialogOpen(false)}
            >
              Cancel
            </Button>
            <Button 
              variant="destructive" 
              onClick={handleConfirmDelete}
              disabled={deleteMutation.isPending}
            >
              {deleteMutation.isPending ? <Spinner size="sm" className="mr-2" /> : null}
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default AdminProducts;
