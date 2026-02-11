import React from 'react';
import { motion } from 'framer-motion';
import './RichTextSection.css';

const RichTextSection = ({ data }) => {
  const { content } = data;

  if (!content) return null;

  return (
    <section className="richtext-section section">
      <motion.div
        className="container richtext-container"
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
      >
        <div
          className="richtext-content"
          dangerouslySetInnerHTML={{ __html: content }}
        />
      </motion.div>
    </section>
  );
};

export default RichTextSection;
