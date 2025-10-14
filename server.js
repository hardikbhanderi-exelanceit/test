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

// Simple product data (jewelry-like)
const products = [
  {
    id: 1,
    name: "Aurora Pendant",
    price: 79.0,
    image: "/images/pendant.jpg",
    description: "Elegant sterling silver pendant with crystal accents.",
  },
  {
    id: 2,
    name: "Luna Ring",
    price: 129.0,
    image: "/images/ring.jpg",
    description: "Delicate gold-plated ring with moonstone center.",
  },
  {
    id: 3,
    name: "Solstice Bracelet",
    price: 95.0,
    image: "/images/bracelet.jpg",
    description: "Handmade beaded bracelet with mixed metals.",
  },
];

// API endpoint
app.get("/api/products", (req, res) => {
  res.json(products);
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

// Fallback to index.html for client-side routing
app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "index.html"));
});

app.listen(PORT, () => {
  console.log(`Server listening on http://localhost:${PORT}`);
});
