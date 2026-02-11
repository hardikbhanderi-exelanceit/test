import React, { useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import { getImageUrl } from '../../utils/api';
import './GallerySection.css';

const GallerySection = ({ data }) => {
  const { title, images } = data;

  // Map Strapi images to the structure expected by the component
  const galleryItems = images?.map((image, index) => {
    // Determine size based on index to create a deterministic masonry layout
    // Pattern: Big, Small, Tall, Small, Small, Wide
    const patternPos = index % 6;
    let sizeClass = '';

    if (patternPos === 0) sizeClass = 'big';
    else if (patternPos === 2) sizeClass = 'tall';
    else if (patternPos === 5) sizeClass = 'wide';

    return {
      id: image.id || Math.random(),
      url: getImageUrl(image),
      title: image.alternativeText || 'Timeless Elegance',
      sizeClass,
      originalImage: image
    };
  }) || [];

  return (
    <section className="gallery-section section" id="gallery">
      <div className="container">
        <motion.div
          className="section-header"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <div className="section-label">Our Craft</div>
          <h2 className="section-title">
            {title || 'Artistry in Light'}
          </h2>
        </motion.div>

        <div className="gallery-grid-masonry">
          {galleryItems.map((item, index) => (
            <ImageItem
              key={item.id}
              item={item}
              index={index}
            />
          ))}
        </div>
      </div>
    </section>
  );
};

const ImageItem = ({ item, index }) => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-50px" });

  return (
    <motion.figure
      initial="hidden"
      animate={isInView ? "visible" : "hidden"}
      ref={ref}
      className={`gallery-item-wrapper ${item.sizeClass}`}
      variants={{
        hidden: { opacity: 0, y: 50, scale: 0.95 },
        visible: {
          opacity: 1,
          y: 0,
          scale: 1,
          transition: { duration: 0.6, delay: index * 0.05, ease: "easeOut" }
        }
      }}
      whileHover={{ y: -5, transition: { duration: 0.3 } }}
    >
      <motion.img
        layoutId={`card-${item.id}`}
        src={item.url}
        alt={item.title}
        className="gallery-image"
      />
    </motion.figure>
  );
};

export default GallerySection;
