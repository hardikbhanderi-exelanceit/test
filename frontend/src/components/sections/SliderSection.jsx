import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { getImageUrl } from '../../utils/api';
import './SliderSection.css';

const SliderSection = ({ data }) => {
  const { files } = data;
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % files.length);
    }, 5000);

    return () => clearInterval(interval);
  }, [files]);

  const nextSlide = () => {
    setCurrentIndex((prev) => (prev + 1) % files.length);
  };

  const prevSlide = () => {
    setCurrentIndex((prev) => (prev - 1 + files.length) % files.length);
  };

  if (!files || files.length === 0) return null;

  return (
    <section className="slider-section">
      <div className="slider-container">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentIndex}
            className="slide"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.7 }}
          >
            <img
              src={getImageUrl(files[currentIndex])}
              alt={`Slide ${currentIndex + 1}`}
              className="slide-image"
            />
            <div className="slide-overlay"></div>
          </motion.div>
        </AnimatePresence>

        <button className="slider-btn prev" onClick={prevSlide}>
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor">
            <polyline points="15 18 9 12 15 6"></polyline>
          </svg>
        </button>

        <button className="slider-btn next" onClick={nextSlide}>
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor">
            <polyline points="9 18 15 12 9 6"></polyline>
          </svg>
        </button>

        <div className="slider-dots">
          {files.map((_, index) => (
            <button
              key={index}
              className={`dot ${index === currentIndex ? 'active' : ''}`}
              onClick={() => setCurrentIndex(index)}
            />
          ))}
        </div>
      </div>
    </section>
  );
};

export default SliderSection;
