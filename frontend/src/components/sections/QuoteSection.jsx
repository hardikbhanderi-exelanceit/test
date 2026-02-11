import React from 'react';
import { motion } from 'framer-motion';
import './QuoteSection.css';

const QuoteSection = ({ data }) => {
  const { quote, author, role } = data;

  if (!quote) return null;

  return (
    <section className="quote-section section">
      <div className="container">
        <motion.div
          className="quote-container"
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
        >
          <div className="quote-icon">
            <svg width="60" height="60" viewBox="0 0 24 24" fill="currentColor">
              <path d="M6 17h3l2-4V7H5v6h3zm8 0h3l2-4V7h-6v6h3z" />
            </svg>
          </div>

          <blockquote className="quote-text">
            "{quote}"
          </blockquote>

          {(author || role) && (
            <div className="quote-attribution">
              {author && <p className="quote-author">{author}</p>}
              {role && <p className="quote-role">{role}</p>}
            </div>
          )}
        </motion.div>
      </div>
    </section>
  );
};

export default QuoteSection;
