import React from 'react';
import { motion } from 'framer-motion';
import { getImageUrl } from '../../utils/api';
import './AboutSection.css';

const AboutSection = ({ data, index }) => {
  const { title, description, image, features } = data;
  const imageUrl = getImageUrl(image);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.6 },
    },
  };

  return (
    <section className="about-section section" id="about">
      <div className="container">
        <div className="about-grid">
          <motion.div
            className="about-content"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: '-100px' }}
            variants={containerVariants}
          >
            <motion.div className="section-label" variants={itemVariants}>
              Our Story
            </motion.div>

            <motion.h2 className="about-title" variants={itemVariants}>
              {title || 'Crafting Timeless Elegance'}
            </motion.h2>

            <motion.div
              className="about-description"
              variants={itemVariants}
              dangerouslySetInnerHTML={{ __html: description }}
            />

            {features && features.length > 0 && (
              <motion.div className="about-features" variants={containerVariants}>
                {features.map((feature, idx) => (
                  <motion.div
                    key={idx}
                    className="feature-item"
                    variants={itemVariants}
                  >
                    <div className="feature-icon">
                      <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                        <path
                          d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z"
                          fill="currentColor"
                        />
                      </svg>
                    </div>
                    <h4>{feature.title}</h4>
                    <p>{feature.description}</p>
                  </motion.div>
                ))}
              </motion.div>
            )}
          </motion.div>

          {imageUrl && (
            <motion.div
              className="about-image-wrapper"
              initial={{ opacity: 0, x: 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
            >
              <div className="image-frame">
                <img src={imageUrl} alt={title} className="about-image" />  
              </div>
            </motion.div>
          )}
        </div>
      </div>
    </section>
  );
};

export default AboutSection;
