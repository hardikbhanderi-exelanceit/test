import React from 'react';
import { motion } from 'framer-motion';
import './ExcellenceSection.css';

const ExcellenceSection = ({ data }) => {
  const {
    title = 'Our Excellence',
    subtitle = 'Commitment to Perfection',
    description = 'We believe in delivering nothing but the finest quality in every aspect',
    items = [
      {
        number: '01',
        title: 'Exceptional Quality',
        description: 'Meticulously crafted with the finest materials and precision'
      },
      {
        number: '02',
        title: 'Timeless Design',
        description: 'Elegant aesthetics that endure through generations'
      },
      {
        number: '03',
        title: 'Expert Craftsmanship',
        description: 'Skilled artisans dedicated to perfection in every detail'
      },
      {
        number: '04',
        title: 'Sustainable Practice',
        description: 'Ethical sourcing and environmentally conscious methods'
      }
    ]
  } = data || {};

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15,
        delayChildren: 0.2,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.6, ease: 'easeOut' },
    },
  };

  const cardVariants = {
    hidden: { opacity: 0, scale: 0.95 },
    visible: {
      opacity: 1,
      scale: 1,
      transition: { duration: 0.6, ease: 'easeOut' },
    },
    hover: {
      y: -8,
      transition: { duration: 0.3 },
    },
  };

  return (
    <section className="excellence-section section" id="excellence">
      <div className="container">
        {/* Header */}
        <motion.div
          className="excellence-header"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-100px' }}
          variants={containerVariants}
        >
          <motion.div className="section-label" variants={itemVariants}>
            {subtitle}
          </motion.div>

          <motion.h2 className="excellence-title" variants={itemVariants}>
            {title}
          </motion.h2>

          <motion.p className="excellence-description" variants={itemVariants}>
            {description}
          </motion.p>

          {/* Decorative Line */}
          <motion.div
            className="excellence-line"
            variants={itemVariants}
            style={{ originX: 0 }}
          />
        </motion.div>

        {/* Cards Grid */}
        <motion.div
          className="excellence-grid"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-100px' }}
          variants={containerVariants}
        >
          {items.map((item, index) => (
            <motion.div
              key={index}
              className="excellence-card"
              variants={cardVariants}
              whileHover="hover"
            >
              <div className="card-accent" />
              
              <div className="card-number">{item.number}</div>
              
              <div className="card-content">
                <h3 className="card-title">{item.title}</h3>
                <p className="card-text">{item.description}</p>
              </div>

              <div className="card-border" />
            </motion.div>
          ))}
        </motion.div>

        {/* Bottom Accent */}
        <motion.div
          className="excellence-accent"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-100px' }}
          variants={itemVariants}
        />
      </div>
    </section>
  );
};

export default ExcellenceSection;
