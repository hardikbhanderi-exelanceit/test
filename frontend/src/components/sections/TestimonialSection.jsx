import React, { useRef, useState, useEffect, useCallback } from 'react';
import { motion } from 'framer-motion';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { getImageUrl } from '../../utils/api';
import './TestimonialSection.css';

const TestimonialSection = ({ data }) => {
  const { section_title, testimonials } = data;
  const sliderRef = useRef(null);
  const [showPrev, setShowPrev] = useState(false);
  const [showNext, setShowNext] = useState(true);

  const checkScrollPoints = useCallback(() => {
    if (sliderRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = sliderRef.current;
      // Allow for small rounding differences (1px)
      setShowPrev(scrollLeft > 5);
      setShowNext(scrollLeft < scrollWidth - clientWidth - 5);
    }
  }, []);

  useEffect(() => {
    checkScrollPoints();
    const currentRef = sliderRef.current;
    if (currentRef) {
      currentRef.addEventListener('scroll', checkScrollPoints);
      window.addEventListener('resize', checkScrollPoints);
    }
    return () => {
      if (currentRef) {
        currentRef.removeEventListener('scroll', checkScrollPoints);
        window.removeEventListener('resize', checkScrollPoints);
      }
    };
  }, [checkScrollPoints]);

  const scroll = (direction) => {
    if (sliderRef.current) {
      const cardWidth = 400; // Width of card
      const gap = 32; // 2rem gap
      const scrollAmount = cardWidth + gap;

      sliderRef.current.scrollBy({
        left: direction === 'left' ? -scrollAmount : scrollAmount,
        behavior: 'smooth'
      });

      // Slight delay to ensure scroll has finished before checking
      setTimeout(checkScrollPoints, 500);
    }
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
      },
    },
  };

  const cardVariants = {
    hidden: { opacity: 0, scale: 0.9 },
    visible: {
      opacity: 1,
      scale: 1,
      transition: { duration: 0.6 },
    },
  };

  return (
    <section className="testimonial-section section" id="testimonials">
      <div className="container">
        <motion.div
          className="section-header"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <div className="section-label">Testimonials</div>
          <h2 className="section-title">
            {section_title || 'What Our Clients Say'}
          </h2>
        </motion.div>

        <div className="testimonial-slider-wrapper">
          {showPrev && (
            <button
              className="testimonial-nav-btn prev"
              onClick={() => scroll('left')}
              aria-label="Previous testimonial"
            >
              <ChevronLeft size={24} />
            </button>
          )}

          <motion.div
            className="testimonials-grid"
            ref={sliderRef}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: '-50px' }}
            variants={containerVariants}
          >
            {testimonials?.map((testimonial, index) => (
              <motion.div
                key={index}
                className="testimonial-card"
                variants={cardVariants}
              >
                <div className="quote-icon">
                  <svg width="40" height="40" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M6 17h3l2-4V7H5v6h3zm8 0h3l2-4V7h-6v6h3z" />
                  </svg>
                </div>

                <div
                  className="testimonial-text"
                  dangerouslySetInnerHTML={{ __html: testimonial.review }}
                />

                <div className="testimonial-author">
                  {testimonial.image && (
                    <img
                      src={getImageUrl(testimonial.image)}
                      alt={testimonial.customer_name}
                      className="author-image"
                    />
                  )}
                  <div className="author-info">
                    <h4 className="author-name">{testimonial.customer_name}</h4>
                    {testimonial.position && (
                      <p className="author-position">{testimonial.position}</p>
                    )}
                  </div>
                </div>

                <div className="rating">
                  {[...Array(5)].map((_, i) => (
                    <svg
                      key={i}
                      width="16"
                      height="16"
                      viewBox="0 0 24 24"
                      fill={i < (testimonial.rating || 5) ? 'currentColor' : 'none'}
                      stroke="currentColor"
                    >
                      <path d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z" />
                    </svg>
                  ))}
                </div>
              </motion.div>
            ))}
          </motion.div>

          {showNext && (
            <button
              className="testimonial-nav-btn next"
              onClick={() => scroll('right')}
              aria-label="Next testimonial"
            >
              <ChevronRight size={24} />
            </button>
          )}
        </div>
      </div>
    </section>
  );
};

export default TestimonialSection;
