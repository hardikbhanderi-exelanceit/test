import React from 'react';
import { motion } from 'framer-motion';
import { getImageUrl } from '../../utils/api';
import './MediaSection.css';

const MediaSection = ({ data }) => {
  const { file } = data;
  const mediaUrl = getImageUrl(file);

  if (!mediaUrl) return null;

  const isVideo = file?.mime?.startsWith('video/');

  return (
    <section className="media-section">
      <motion.div
        className="media-container"
        initial={{ opacity: 0, scale: 0.95 }}
        whileInView={{ opacity: 1, scale: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8 }}
      >
        {isVideo ? (
          <video
            src={mediaUrl}
            controls
            className="media-video"
          >
            Your browser does not support the video tag.
          </video>
        ) : (
          <img
            src={mediaUrl}
            alt="Media content"
            className="media-image"
          />
        )}
      </motion.div>
    </section>
  );
};

export default MediaSection;
