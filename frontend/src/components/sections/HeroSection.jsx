import React from 'react';
import { motion } from 'framer-motion';
import { getImageUrl } from '../../utils/api';
import './HeroSection.css';

const HeroSection = ({ data }) => {
  const { heading, sub_heading, description, background_image, button_text, button_link } = data;
  const imageUrl = getImageUrl(background_image);

  return (
    <section className="hero-section" id="hero">
      <div className="hero-background">
        <div className="hero-overlay-static"></div>
        {imageUrl && (
          <motion.div
            className="hero-image-wrapper"
            initial={{ scale: 1.1, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 1.2, ease: 'easeOut' }}
          >
            <img src={imageUrl} alt={heading} className="hero-image" />
          </motion.div>
        )}
      </div>

      <div className="hero-content">
        <motion.div
          className="hero-text"
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.3 }}
        >
          {sub_heading && (
            <motion.p
              className="hero-subtitle"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.8, delay: 0.5 }}
            >
              {sub_heading}
            </motion.p>
          )}

          <motion.h1
            className="hero-title"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.6 }}
          >
            {heading || "Timeless Brilliance"}
          </motion.h1>

          {description && (
            <motion.div
              className="hero-description"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.7 }}
              dangerouslySetInnerHTML={{ __html: description }}
            />
          )}

          {button_text && (
            <motion.div
              className="hero-cta"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.9 }}
            >
              <a href={button_link || '#products'} className="btn-primary">
                {button_text}
              </a>
            </motion.div>
          )}
        </motion.div>

        <motion.div
          className="hero-scroll"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 1.2 }}
        >
        </motion.div>
      </div>
    </section>
  );
};

export default HeroSection;
