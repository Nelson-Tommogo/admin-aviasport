import React, { useState, useEffect } from "react";
import {
  Box,
  Button,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  TextField,
  MenuItem,
  Select,
  Checkbox,
  Tabs,
  Tab,
} from "@mui/material";
import { Edit, Delete } from "@mui/icons-material";
import axios from "axios";

const API_BASE_URL = "https://mataa-backend.onrender.com";

const Dashboard = () => {
  // State for all tabs
  const [currentTab, setCurrentTab] = useState('products');
  
  // Products state
  const [products, setProducts] = useState([]);
  const [loadingProducts, setLoadingProducts] = useState(true);
  const [productError, setProductError] = useState(null);
  const [openProductDialog, setOpenProductDialog] = useState(false);
  const [productForm, setProductForm] = useState({
    name: "",
    make: "",
    model: "",
    year: "",
    price: "",
    description: "",
    image: null,
  });
  const [isEditing, setIsEditing] = useState(false);
  const [currentProductId, setCurrentProductId] = useState(null);
  const [uploadingProduct, setUploadingProduct] = useState(false);
  const [selectedProducts, setSelectedProducts] = useState([]);

  // Blogs state
  const [blogs, setBlogs] = useState([]);
  const [loadingBlogs, setLoadingBlogs] = useState(false);
  const [openBlogDialog, setOpenBlogDialog] = useState(false);
  const [blogForm, setBlogForm] = useState({
    title: "",
    content: "",
    author: "",
    tags: "",
    image: null
  });
  const [uploadingBlog, setUploadingBlog] = useState(false);

  // Constants
  const makes = [
    "Toyota", "Honda", "Nissan", "Mazda", "Subaru", "Mitsubishi", "Suzuki", "Isuzu",
    "Mercedes-Benz", "BMW", "Audi", "Volkswagen", "Porsche", "Opel",
    "Ford", "Chevrolet", "Dodge", "Jeep", "Tesla", "Cadillac",
    "Hyundai", "Kia", "Genesis",
    "Land Rover", "Jaguar", "Rolls-Royce", "Bentley", "Mini",
    "Ferrari", "Lamborghini", "Maserati", "Alfa Romeo", "Fiat",
    "Peugeot", "Renault", "Citroën", "BYD", "Geely", "Chery", "Haval"
  ];

  const descriptions = [
    "Lighting", "Accessories", "Mirrors", "Body Parts", "Ex-Japan"
  ];

  const currentYear = new Date().getFullYear();
  const years = Array.from({ length: currentYear - 2000 }, (_, i) => 2001 + i);

  // Fetch data when tab changes
  useEffect(() => {
    if (currentTab === 'products') {
      fetchProducts();
    } else if (currentTab === 'blogs') {
      fetchBlogs();
    }
  }, [currentTab]);

  // Product functions
  const fetchProducts = async () => {
    setLoadingProducts(true);
    try {
      const response = await axios.get(`${API_BASE_URL}/products`);
      setProducts(response.data.products || []);
    } catch (error) {
      setProductError("Failed to fetch products");
      console.error("Error fetching products:", error);
    } finally {
      setLoadingProducts(false);
    }
  };

  const handleProductChange = (e) => {
    const { name, value, files } = e.target;
    setProductForm({ ...productForm, [name]: files ? files[0] : value });
  };

  const handleAddProduct = () => {
    setIsEditing(false);
    setCurrentProductId(null);
    setProductForm({
      name: "",
      make: "",
      model: "",
      year: "",
      price: "",
      description: "",
      image: null,
    });
    setOpenProductDialog(true);
  };

  const handleEditProduct = (product) => {
    setIsEditing(true);
    setCurrentProductId(product._id);
    setProductForm({
      name: product.name,
      make: product.make,
      model: product.model,
      year: product.year,
      price: product.price,
      description: product.description,
      image: null, // Don't pre-fill image to avoid security issues
    });
    setOpenProductDialog(true);
  };

  const handleProductSubmit = async () => {
    const formData = new FormData();
    formData.append("name", productForm.name);
    formData.append("make", productForm.make);
    formData.append("model", productForm.model);
    formData.append("year", productForm.year);
    formData.append("price", productForm.price);
    formData.append("description", productForm.description);
    if (productForm.image) {
      formData.append("image", productForm.image);
    }

    setUploadingProduct(true);

    try {
      if (isEditing) {
        formData.append("removeImage", "false"); // Set to true if you want to remove existing image
        const response = await axios.put(`${API_BASE_URL}/api/products/${currentProductId}`, formData);
        setProducts(products.map(p => p._id === currentProductId ? response.data.product : p));
        alert("Product updated successfully!");
      } else {
        const response = await axios.post(`${API_BASE_URL}/upload`, formData);
        setProducts([...products, response.data.product]);
        alert("Product added successfully!");
      }
      setOpenProductDialog(false);
    } catch (error) {
      console.error("Error saving product:", error);
      alert(`Failed to ${isEditing ? 'update' : 'add'} product`);
    } finally {
      setUploadingProduct(false);
    }
  };

  const handleDeleteProduct = async (id) => {
    if (window.confirm("Are you sure you want to delete this product?")) {
      try {
        await axios.delete(`${API_BASE_URL}/api/products/${id}`);
        setProducts(products.filter(product => product._id !== id));
      } catch (error) {
        console.error("Error deleting product:", error);
      }
    }
  };

  const handleDeleteSelectedProducts = async () => {
    if (selectedProducts.length === 0) return;
    if (window.confirm(`Are you sure you want to delete ${selectedProducts.length} products?`)) {
      try {
        await Promise.all(
          selectedProducts.map(id => 
            axios.delete(`${API_BASE_URL}/api/products/${id}`)
          )
        );
        setProducts(products.filter(product => !selectedProducts.includes(product._id)));
        setSelectedProducts([]);
      } catch (error) {
        console.error("Error deleting products:", error);
      }
    }
  };

  // Blog functions
  const fetchBlogs = async () => {
    setLoadingBlogs(true);
    try {
      const response = await axios.get(`${API_BASE_URL}/blogs`);
      setBlogs(response.data.blogs || []);
    } catch (error) {
      console.error("Error fetching blogs:", error);
    } finally {
      setLoadingBlogs(false);
    }
  };

  const handleBlogChange = (e) => {
    const { name, value, files } = e.target;
    setBlogForm({ ...blogForm, [name]: files ? files[0] : value });
  };

  const handleBlogSubmit = async () => {
    const formData = new FormData();
    formData.append("title", blogForm.title);
    formData.append("content", blogForm.content);
    formData.append("author", blogForm.author);
    formData.append("tags", blogForm.tags);
    if (blogForm.image) {
      formData.append("image", blogForm.image);
    }

    setUploadingBlog(true);

    try {
      const response = await axios.post(`${API_BASE_URL}/blogs`, formData);
      setBlogs([...blogs, response.data]);
      setOpenBlogDialog(false);
      alert("Blog created successfully!");
    } catch (error) {
      console.error("Error creating blog:", error);
      alert("Failed to create blog");
    } finally {
      setUploadingBlog(false);
    }
  };

  const handleDeleteBlog = async (id) => {
    if (window.confirm("Are you sure you want to delete this blog?")) {
      try {
        await axios.delete(`${API_BASE_URL}/api/blogs/${id}`);
        setBlogs(blogs.filter(blog => blog._id !== id));
      } catch (error) {
        console.error("Error deleting blog:", error);
      }
    }
  };

  // Common functions
  const handleTabChange = (event, newValue) => {
    setCurrentTab(newValue);
  };

  const toggleProductSelection = (id) => {
    setSelectedProducts(prev =>
      prev.includes(id) 
        ? prev.filter(productId => productId !== id) 
        : [...prev, id]
    );
  };

  const toggleAllProducts = () => {
    if (selectedProducts.length === products.length) {
      setSelectedProducts([]);
    } else {
      setSelectedProducts(products.map(product => product._id));
    }
  };

  return (
    <Box p={3}>
      <Typography variant="h4" gutterBottom>
        Mataa Gari Ventures Dashboard
      </Typography>

      <Tabs value={currentTab} onChange={handleTabChange} sx={{ mb: 3 }}>
        <Tab label="Products" value="products" />
        <Tab label="Blogs" value="blogs" />
      </Tabs>

      {/* Products Tab */}
      {currentTab === 'products' && (
        <Box>
          <Box sx={{ display: 'flex', gap: 2, mb: 3 }}>
            <Button 
              variant="contained" 
              onClick={handleAddProduct}
            >
              Add Product
            </Button>
            <Button
              variant="contained"
              color="error"
              onClick={handleDeleteSelectedProducts}
              disabled={selectedProducts.length === 0}
            >
              Delete Selected ({selectedProducts.length})
            </Button>
          </Box>

          {/* Add/Edit Product Dialog */}
          <Dialog open={openProductDialog} onClose={() => setOpenProductDialog(false)}>
            <DialogTitle>{isEditing ? 'Edit Product' : 'Add New Product'}</DialogTitle>
            <DialogContent>
              <TextField
                name="name"
                label="Product Name"
                value={productForm.name}
                onChange={handleProductChange}
                fullWidth
                margin="dense"
                required
              />
              <Select
                name="make"
                value={productForm.make}
                onChange={handleProductChange}
                fullWidth
                margin="dense"
                required
                displayEmpty
              >
                <MenuItem value="" disabled>Select Make</MenuItem>
                {makes.map(make => (
                  <MenuItem key={make} value={make}>{make}</MenuItem>
                ))}
              </Select>
              <TextField
                name="model"
                label="Model"
                value={productForm.model}
                onChange={handleProductChange}
                fullWidth
                margin="dense"
                required
              />
              <Select
                name="year"
                value={productForm.year}
                onChange={handleProductChange}
                fullWidth
                margin="dense"
                required
                displayEmpty
              >
                <MenuItem value="" disabled>Select Year</MenuItem>
                {years.map(year => (
                  <MenuItem key={year} value={year}>{year}</MenuItem>
                ))}
              </Select>
              <TextField
                name="price"
                label="Price"
                type="number"
                value={productForm.price}
                onChange={handleProductChange}
                fullWidth
                margin="dense"
                required
              />
              <Select
                name="description"
                value={productForm.description}
                onChange={handleProductChange}
                fullWidth
                margin="dense"
                displayEmpty
              >
                <MenuItem value="" disabled>Select Description</MenuItem>
                {descriptions.map(desc => (
                  <MenuItem key={desc} value={desc}>{desc}</MenuItem>
                ))}
              </Select>
              <input
                type="file"
                name="image"
                onChange={handleProductChange}
                accept="image/*"
                style={{ marginTop: '16px' }}
              />
              {isEditing && (
                <Typography variant="caption" display="block" sx={{ mt: 1 }}>
                  Note: Uploading a new image will replace the existing one
                </Typography>
              )}
            </DialogContent>
            <DialogActions>
              <Button onClick={() => setOpenProductDialog(false)}>Cancel</Button>
              <Button 
                onClick={handleProductSubmit} 
                variant="contained"
                disabled={uploadingProduct}
              >
                {uploadingProduct ? <CircularProgress size={24} /> : isEditing ? "Update" : "Add Product"}
              </Button>
            </DialogActions>
          </Dialog>

          {/* Products Table */}
          {loadingProducts ? (
            <CircularProgress />
          ) : productError ? (
            <Typography color="error">{productError}</Typography>
          ) : products.length === 0 ? (
            <Typography>No products found</Typography>
          ) : (
            <TableContainer component={Paper}>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>
                      <Checkbox
                        checked={selectedProducts.length === products.length && products.length > 0}
                        indeterminate={selectedProducts.length > 0 && selectedProducts.length < products.length}
                        onChange={toggleAllProducts}
                      />
                    </TableCell>
                    <TableCell>Name</TableCell>
                    <TableCell>Make</TableCell>
                    <TableCell>Model</TableCell>
                    <TableCell>Year</TableCell>
                    <TableCell>Price</TableCell>
                    <TableCell>Description</TableCell>
                    <TableCell>Image</TableCell>
                    <TableCell>Actions</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {products.map(product => (
                    <TableRow key={product._id}>
                      <TableCell>
                        <Checkbox
                          checked={selectedProducts.includes(product._id)}
                          onChange={() => toggleProductSelection(product._id)}
                        />
                      </TableCell>
                      <TableCell>{product.name}</TableCell>
                      <TableCell>{product.make}</TableCell>
                      <TableCell>{product.model}</TableCell>
                      <TableCell>{product.year}</TableCell>
                      <TableCell>{product.price}</TableCell>
                      <TableCell>{product.description}</TableCell>
                      <TableCell>
                        {product.imageUrl && (
                          <img 
                            src={product.imageUrl} 
                            alt={product.name} 
                            style={{ width: 50, height: 50, objectFit: 'cover' }} 
                          />
                        )}
                      </TableCell>
                      <TableCell>
                        <Button onClick={() => handleEditProduct(product)}>
                          <Edit color="primary" />
                        </Button>
                        <Button onClick={() => handleDeleteProduct(product._id)}>
                          <Delete color="error" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          )}
        </Box>
      )}

      {/* Blogs Tab */}
      {currentTab === 'blogs' && (
        <Box>
          <Button 
            variant="contained" 
            onClick={() => setOpenBlogDialog(true)}
            sx={{ mb: 3 }}
          >
            Create Blog
          </Button>

          {/* Create Blog Dialog */}
          <Dialog open={openBlogDialog} onClose={() => setOpenBlogDialog(false)}>
            <DialogTitle>Create New Blog</DialogTitle>
            <DialogContent>
              <TextField
                name="title"
                label="Title"
                value={blogForm.title}
                onChange={handleBlogChange}
                fullWidth
                margin="dense"
                required
              />
              <TextField
                name="content"
                label="Content"
                value={blogForm.content}
                onChange={handleBlogChange}
                fullWidth
                margin="dense"
                multiline
                rows={4}
                required
              />
              <TextField
                name="author"
                label="Author"
                value={blogForm.author}
                onChange={handleBlogChange}
                fullWidth
                margin="dense"
                required
              />
              <TextField
                name="tags"
                label="Tags (comma separated)"
                value={blogForm.tags}
                onChange={handleBlogChange}
                fullWidth
                margin="dense"
              />
              <input
                type="file"
                name="image"
                onChange={handleBlogChange}
                accept="image/*"
                required
                style={{ marginTop: '16px' }}
              />
            </DialogContent>
            <DialogActions>
              <Button onClick={() => setOpenBlogDialog(false)}>Cancel</Button>
              <Button
                onClick={handleBlogSubmit}
                variant="contained"
                disabled={uploadingBlog}
              >
                {uploadingBlog ? <CircularProgress size={24} /> : "Create"}
              </Button>
            </DialogActions>
          </Dialog>

          {/* Blogs Table */}
          {loadingBlogs ? (
            <CircularProgress />
          ) : blogs.length === 0 ? (
            <Typography>No blogs found</Typography>
          ) : (
            <TableContainer component={Paper}>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>Title</TableCell>
                    <TableCell>Author</TableCell>
                    <TableCell>Content Preview</TableCell>
                    <TableCell>Tags</TableCell>
                    <TableCell>Image</TableCell>
                    <TableCell>Actions</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {blogs.map(blog => (
                    <TableRow key={blog._id}>
                      <TableCell>{blog.title}</TableCell>
                      <TableCell>{blog.author}</TableCell>
                      <TableCell>
                        {blog.content.length > 50 
                          ? `${blog.content.substring(0, 50)}...` 
                          : blog.content}
                      </TableCell>
                      <TableCell>{blog.tags?.join(', ')}</TableCell>
                      <TableCell>
                        {blog.imageUrl && (
                          <img 
                            src={blog.imageUrl} 
                            alt={blog.title} 
                            style={{ width: 50, height: 50, objectFit: 'cover' }} 
                          />
                        )}
                      </TableCell>
                      <TableCell>
                        <Button onClick={() => handleDeleteBlog(blog._id)}>
                          <Delete color="error" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          )}
        </Box>
      )}
    </Box>
  );
};

export default Dashboard;