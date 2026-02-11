import React from 'react';
import { motion } from 'framer-motion';
import './WhyChooseUs.css';

const WhyChooseUs = ({ data }) => {
  const { title, subtitle, features } = data;

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

  const icons = {
    quality: (
      <path d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z" />
    ),
    ethical: (
      <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
    ),
    craftsmanship: (
      <path d="M22.7 19l-9.1-9.1c.9-2.3.4-5-1.5-6.9-2-2-5-2.4-7.4-1.3L9 6 6 9 1.6 4.7C.4 7.1.9 10.1 2.9 12.1c1.9 1.9 4.6 2.4 6.9 1.5l9.1 9.1c.4.4 1 .4 1.4 0l2.3-2.3c.5-.4.5-1.1.1-1.4z" />
    ),
    warranty: (
      <path d="M12 1L3 5v6c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V5l-9-4z" />
    ),
  };

  return (
    <section className="why-choose-us section" id="why-choose-us">
      <div className="why-background"></div>

      <div className="container">
        <motion.div
          className="section-header"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <div className="section-label">{subtitle || 'Excellence'}</div>
          <h2 className="section-title">
            {title || 'Why Choose Di\'aaru'}
          </h2>
        </motion.div>

        <motion.div
          className="reasons-grid"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-100px' }}
          variants={containerVariants}
        >
          {features?.map((feature, index) => (
            <motion.div
              key={index}
              className="reason-card"
              variants={itemVariants}
            >
              <div className="reason-icon">
                {/* if odd number of features, use primary color, else use accent color */}
                <svg width="40" height="40" viewBox="0 0 24 24" fill={index % 2 === 0 ? 'var(--color-primary)' : 'var(--color-accent)'}>
                  {icons[feature.icon] || icons.quality}
                </svg>
              </div>

              <h3 className="reason-title">{feature.feature_title}</h3>
              <p className="reason-description">{feature.feature_description}</p>

              <div className="reason-accent"></div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
};

export default WhyChooseUs;
