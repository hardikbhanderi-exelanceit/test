import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { fetchProducts, getImageUrl } from '../../utils/api';
import './ProductSection.css';

const ProductSection = ({ data }) => {
  const { section_title, description, products: productRelation } = data;
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadProducts = async () => {
      try {
        // In v5, productRelation might be an array of strings (documentIds) or objects
        const productIds = productRelation?.map((p) => typeof p === 'string' ? p : p.documentId || p.id) || [];
        const productData = await fetchProducts(productIds.length > 0 ? productIds : null);
        setProducts(productData);
      } catch (error) {
        console.error('Error loading products:', error);
      } finally {
        setLoading(false);
      }
    };

    loadProducts();
  }, [productRelation]);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15,
      },
    },
  };

  const cardVariants = {
    hidden: { opacity: 0, y: 40 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.6 },
    },
  };

  return (
    <section className="product-section section" id="products">
      <div className="container">
        <motion.div
          className="section-header"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <div className="section-label">Our Collections</div>
          <h2 className="section-title">
            {section_title || 'Exquisite Diamonds'}
          </h2>
          {description && <p className="section-description">{description}</p>}
          <button className="btn-view-collection">View Full Collection</button>
        </motion.div>

        {loading ? (
          <div className="products-loading">
            <div className="spinner"></div>
          </div>
        ) : (
          <motion.div
            className="products-grid"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: '-50px' }}
            variants={containerVariants}
          >
            {products.map((product) => (
              <ProductCard key={product.id} product={product} variants={cardVariants} />
            ))}
          </motion.div>
        )}
      </div>
    </section>
  );
};

const ProductCard = ({ product, variants }) => {
  const { name, price, diamond_type, carat, shape, images } = product;
  const imageUrl = getImageUrl(images);

  return (
    <motion.div className="product-card" variants={variants}>
      <div className="product-image-wrapper">
        {imageUrl ? (
          <img src={imageUrl} alt={name} className="product-image" />
        ) : (
          <div className="product-placeholder">
            <svg width="60" height="60" viewBox="0 0 24 24" fill="none">
              <path
                d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z"
                fill="currentColor"
              />
            </svg>
          </div>
        )}
      </div>

      <div className="product-info">
        <h3 className="product-name">{name}</h3>

        <div className="product-details">
          {diamond_type && <span className="detail-badge">{diamond_type}</span>}
          {carat && <span className="detail-badge">{carat} ct</span>}
          {shape && <span className="detail-badge">{shape}</span>}
        </div>

        {price && (
          <p className="product-price">
            ₹{parseFloat(price).toLocaleString('en-US', {
              minimumFractionDigits: 2,
              maximumFractionDigits: 2,
            })}
          </p>
        )}
      </div>
    </motion.div>
  );
};

export default ProductSection;
