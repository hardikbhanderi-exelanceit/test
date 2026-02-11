import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import './Header.css';

const Header = ({ sections = [] }) => {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToSection = (sectionId) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
      setMenuOpen(false);
    }
  };

  // Map section types to navigation items
  const navigationMap = {
    'shared.hero-section': { id: 'hero', label: 'Home' },
    'shared.about-section': { id: 'about', label: 'Our Story' },
    'shared.product-section': { id: 'products', label: 'Collections' },
    'shared.why-choose-us': { id: 'why-choose-us', label: 'Excellence' },
    'shared.gallery-section': { id: 'gallery', label: 'Gallery' },
    'shared.testimonial-section': { id: 'testimonials', label: 'Testimonials' },
    'shared.contact-section': { id: 'contact', label: 'Contact' },
  };

  // Get available navigation items based on sections from Strapi
  const availableNavItems = sections
    .filter(section => {
      // Explicitly check for isShow: false
      // If isShow is true, null, or undefined, we show the section
      const isVisible = section.isShow !== false;
      return isVisible && navigationMap[section.__component];
    })
    .map(section => navigationMap[section.__component])
    .filter((item, index, self) =>
      // Remove duplicates based on ID
      item && index === self.findIndex(t => t.id === item.id)
    );

  return (
    <header className={`header ${scrolled ? 'scrolled' : ''}`}>
      <div className="header-top">
        <div className="header-top-container">
          <div className="header-top-left">
            <span>Welcome to Di'aaru Luxury Lab-Grown Diamonds</span>
          </div>
          <div className="header-top-right">
            <a href="tel:+12125553426" className="top-info-link">
              <span className="info-icon">📞</span> +1 (212) 555-DIAM
            </a>
            <a href="mailto:concierge@diaaru.com" className="top-info-link">
              <span className="info-icon">✉️</span> concierge@diaaru.com
            </a>
          </div>
        </div>
      </div>
      <div className="header-container">
        <a href="/" className="logo">
          <span className="logo-text">Di'aaru</span>
        </a>

        <nav className={`nav ${menuOpen ? 'active' : ''}`}>
          {availableNavItems.length > 0 ? (
            availableNavItems.map((item) => (
              <button
                key={item.id}
                onClick={() => scrollToSection(item.id)}
                className="nav-link"
              >
                {item.label}
              </button>
            ))
          ) : (
            // Fallback navigation if no sections provided
            <>
              {/* <button onClick={() => scrollToSection('hero')} className="nav-link">Home</button>
              <button onClick={() => scrollToSection('about')} className="nav-link">Our Story</button>
              <button onClick={() => scrollToSection('products')} className="nav-link">Collections</button>
              <button onClick={() => scrollToSection('why-choose-us')} className="nav-link">Excellence</button>
              <button onClick={() => scrollToSection('gallery')} className="nav-link">Gallery</button>
              <button onClick={() => scrollToSection('contact')} className="nav-link">Contact</button> */}
            </>
          )}
        </nav>

        <button
          className={`menu-toggle ${menuOpen ? 'active' : ''}`}
          onClick={() => setMenuOpen(!menuOpen)}
          aria-label="Toggle menu"
        >
          <span></span>
          <span></span>
          <span></span>
        </button>
      </div>
    </header>
  );
};

export default Header;
