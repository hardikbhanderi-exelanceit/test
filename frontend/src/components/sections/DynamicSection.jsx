import React from 'react';
import HeroSection from './HeroSection';
import AboutSection from './AboutSection';
import ProductSection from './ProductSection';
import WhyChooseUs from './WhyChooseUs';
import TestimonialSection from './TestimonialSection';
import GallerySection from './GallerySection';
import ContactSection from './ContactSection';
import SliderSection from './SliderSection';
import MediaSection from './MediaSection';
import RichTextSection from './RichTextSection';
import QuoteSection from './QuoteSection';
import ScrollTextSection from './ScrollTextSection';

const componentMap = {
  'shared.hero-section': HeroSection,
  'shared.about-section': AboutSection,
  'shared.product-section': ProductSection,
  'shared.why-choose-us': WhyChooseUs,
  'shared.testimonial-section': TestimonialSection,
  'shared.gallery-section': GallerySection,
  'shared.contact-section': ContactSection,
  'shared.slider': SliderSection,
  'shared.media': MediaSection,
  'shared.rich-text': RichTextSection,
  'shared.quote': QuoteSection,
  'shared.scroll-text-section': ScrollTextSection,
};

const DynamicSection = ({ section, index }) => {
  const { __component, isShow } = section;

  // Don't render if isShow is false
  if (isShow === false) {
    return null;
  }

  const Component = componentMap[__component];

  if (!Component) {
    console.warn(`Component not found for: ${__component}`);
    return null;
  }

  return <Component data={section} index={index} />;
};

export default DynamicSection;
