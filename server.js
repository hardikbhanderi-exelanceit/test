const express = require("express");
const path = require("path");
const cors = require("cors");
require("dotenv").config();

const app = express();
const PORT = process.env.PORT || process.env.APP_PORT || 3000;

app.use(cors());
app.use(express.json());

// Serve static frontend
app.use(express.static(path.join(__dirname, "public")));

// Enhanced product data for Aurora Jewelry
const products = [
  {
    id: 1,
    name: "Aurora Pendant",
    price: 79.0,
    image: "/images/pendant.jpg",
    description:
      "Elegant sterling silver pendant with crystal accents that capture light beautifully.",
    category: "necklaces",
    materials: "Sterling silver, crystal",
    inStock: true,
  },
  {
    id: 2,
    name: "Luna Ring",
    price: 129.0,
    image: "/images/ring.jpg",
    description:
      "Delicate gold-plated ring with moonstone center, perfect for everyday elegance.",
    category: "rings",
    materials: "Gold-plated silver, moonstone",
    inStock: true,
  },
  {
    id: 3,
    name: "Solstice Bracelet",
    price: 95.0,
    image: "/images/bracelet.jpg",
    description:
      "Handmade beaded bracelet with mixed metals and natural stone accents.",
    category: "bracelets",
    materials: "Mixed metals, natural stones",
    inStock: true,
  },
  {
    id: 4,
    name: "Celestial Earrings",
    price: 65.0,
    image: "/images/earrings.jpg",
    description:
      "Star-inspired drop earrings in sterling silver with subtle sparkle.",
    category: "earrings",
    materials: "Sterling silver, cubic zirconia",
    inStock: true,
  },
  {
    id: 5,
    name: "Infinity Necklace",
    price: 110.0,
    image: "/images/necklace.jpg",
    description:
      "Modern infinity symbol necklace in rose gold with diamond accents.",
    category: "necklaces",
    materials: "Rose gold, diamonds",
    inStock: true,
  },
  {
    id: 6,
    name: "Cosmic Ring Set",
    price: 180.0,
    image: "/images/ring-set.jpg",
    description:
      "Set of three stackable rings inspired by planetary movements.",
    category: "rings",
    materials: "Mixed metals, gemstones",
    inStock: true,
  },
  {
    id: 7,
    name: "Stardust Choker",
    price: 85.0,
    image: "/images/choker.jpg",
    description:
      "Delicate choker necklace with tiny star charms and adjustable chain.",
    category: "necklaces",
    materials: "Sterling silver, star charms",
    inStock: true,
  },
  {
    id: 8,
    name: "Galaxy Cuff",
    price: 145.0,
    image: "/images/cuff.jpg",
    description:
      "Bold cuff bracelet with swirling patterns reminiscent of distant galaxies.",
    category: "bracelets",
    materials: "Sterling silver, oxidized finish",
    inStock: true,
  },
];

// API endpoint - Get all products
app.get("/api/products", (req, res) => {
  res.json(products);
});

// API endpoint - Get single product
app.get("/api/products/:id", (req, res) => {
  const productId = parseInt(req.params.id);
  const product = products.find((p) => p.id === productId);

  if (!product) {
    return res.status(404).json({ error: "Product not found" });
  }

  res.json(product);
});

// API endpoint - Get products by category
app.get("/api/products/category/:category", (req, res) => {
  const category = req.params.category.toLowerCase();
  const categoryProducts = products.filter((p) => p.category === category);
  res.json(categoryProducts);
});

// API endpoint - Search products
app.get("/api/search", (req, res) => {
  const query = req.query.q?.toLowerCase();

  if (!query) {
    return res.json(products);
  }

  const searchResults = products.filter(
    (product) =>
      product.name.toLowerCase().includes(query) ||
      product.description.toLowerCase().includes(query) ||
      product.category.toLowerCase().includes(query)
  );

  res.json(searchResults);
});

// API endpoint - Contact form submission
app.post("/api/contact", (req, res) => {
  const { name, email, subject, message } = req.body;

  // Basic validation
  if (!name || !email || !subject || !message) {
    return res.status(400).json({
      error: "All fields are required",
    });
  }

  // Email validation
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return res.status(400).json({
      error: "Invalid email address",
    });
  }

  // In a real application, you would save this to a database
  // or send an email notification
  console.log("Contact form submission:", { name, email, subject, message });

  res.json({
    success: true,
    message: "Thank you for your message! We'll get back to you soon.",
  });
});

// API endpoint - Newsletter subscription
app.post("/api/newsletter", (req, res) => {
  const { email } = req.body;

  if (!email) {
    return res.status(400).json({
      error: "Email is required",
    });
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return res.status(400).json({
      error: "Invalid email address",
    });
  }

  // In a real application, you would save this to a database
  console.log("Newsletter subscription:", email);

  res.json({
    success: true,
    message: "Thank you for subscribing to our newsletter!",
  });
});

// API endpoint - Get featured products
app.get("/api/featured", (req, res) => {
  const featured = products.slice(0, 3); // First 3 products as featured
  res.json(featured);
});

// Safe env endpoint - returns a whitelist of non-sensitive env vars
app.get("/api/env", (req, res) => {
  // Whitelist env variables we consider safe to expose to clients
  const whitelist = ["NODE_ENV", "APP_NAME", "APP_PORT"];
  const result = {};
  whitelist.forEach((key) => {
    if (process.env[key]) result[key] = process.env[key];
  });
  res.json(result);
});

// Health check endpoint
app.get("/api/health", (req, res) => {
  res.json({
    status: "healthy",
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
  });
});

// API info endpoint
app.get("/api", (req, res) => {
  res.json({
    name: "Aurora Jewelry API",
    version: "1.0.0",
    description: "API for Aurora Jewelry store",
    endpoints: {
      "GET /api/products": "Get all products",
      "GET /api/products/:id": "Get single product",
      "GET /api/products/category/:category": "Get products by category",
      "GET /api/search?q=query": "Search products",
      "GET /api/featured": "Get featured products",
      "POST /api/contact": "Submit contact form",
      "POST /api/newsletter": "Subscribe to newsletter",
      "GET /api/health": "Health check",
      "GET /api/env": "Get safe environment variables",
    },
  });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({
    error: "Something went wrong!",
    message: process.env.NODE_ENV === "development" ? err.message : undefined,
  });
});

// 404 handler for API routes
app.use("/api/*", (req, res) => {
  res.status(404).json({
    error: "API endpoint not found",
    availableEndpoints: "/api",
  });
});

// Fallback to index.html for client-side routing
app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "index.html"));
});

app.listen(PORT, () => {
  console.log(`🚀 Aurora Jewelry Server listening on http://localhost:${PORT}`);
  console.log(`📱 API available at http://localhost:${PORT}/api`);
  console.log(`💎 Environment: ${process.env.NODE_ENV || "development"}`);
});
