# Di'aaru - Luxury Diamond Website Frontend

A premium, fully dynamic React frontend for the Di'aaru luxury lab-grown diamond brand, powered by Strapi CMS.

## ✨ Features

- **Fully Dynamic CMS-Driven**: All content managed through Strapi
- **Luxury Design**: Premium aesthetics inspired by high-end jewelry brands
- **Responsive**: Mobile-first, fully responsive design
- **Smooth Animations**: Framer Motion for elegant transitions
- **SEO Optimized**: Dynamic meta tags from CMS
- **Modular Architecture**: Scalable component system

## 🏗️ Architecture

### Dynamic Section Rendering

The frontend automatically renders sections based on your Strapi dynamic zone:

```
Page Data → Dynamic Section Loader → Component Renderer
```

Sections are rendered only if `isShow: true` in Strapi.

### Available Components

- **hero-section**: Full-screen hero with image, title, CTA
- **about-section**: Story section with features
- **product-section**: Product grid with Strapi relation
- **why-choose-us**: Reasons/benefits grid
- **testimonial-section**: Customer testimonials
- **gallery-section**: Image gallery with lightbox
- **contact-section**: Contact form with info
- **slider**: Image carousel
- **media**: Single image/video display
- **rich-text**: Formatted text content
- **quote**: Highlighted quote block

## 🚀 Setup Instructions

### Prerequisites

- Node.js 18+ and npm
- Strapi backend running (default: http://localhost:1337)

### Installation

1. **Navigate to frontend directory**:
   ```bash
   cd frontend
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Configure environment**:
   ```bash
   cp .env.example .env
   ```

   Edit `.env` if your Strapi runs on a different URL:
   ```
   VITE_API_URL=http://localhost:1337
   ```

4. **Start development server**:
   ```bash
   npm run dev
   ```

5. **Open browser**:
   ```
   http://localhost:3000
   ```

## 📁 Project Structure

```
frontend/
├── src/
│   ├── components/
│   │   ├── layout/
│   │   │   ├── Header.jsx
│   │   │   └── Footer.jsx
│   │   └── sections/
│   │       ├── DynamicSection.jsx
│   │       ├── HeroSection.jsx
│   │       ├── AboutSection.jsx
│   │       ├── ProductSection.jsx
│   │       ├── WhyChooseUs.jsx
│   │       ├── TestimonialSection.jsx
│   │       ├── GallerySection.jsx
│   │       ├── ContactSection.jsx
│   │       ├── SliderSection.jsx
│   │       ├── MediaSection.jsx
│   │       ├── RichTextSection.jsx
│   │       └── QuoteSection.jsx
│   ├── pages/
│   │   └── DynamicPage.jsx
│   ├── utils/
│   │   └── api.js
│   ├── styles/
│   │   └── global.css
│   ├── App.jsx
│   └── main.jsx
├── index.html
├── vite.config.js
└── package.json
```

## 🎨 Design System

### Colors

- **Primary**: #0A0A0A (Deep Black)
- **Secondary**: #F8F6F3 (Warm White)
- **Accent**: #C9A961 (Luxury Gold)
- **Cream**: #FAF9F7 (Background)

### Typography

- **Headings**: Cormorant Garamond (Elegant Serif)
- **Body**: Montserrat (Clean Sans-Serif)

### Spacing Scale

- XS: 0.5rem
- SM: 1rem
- MD: 2rem
- LG: 4rem
- XL: 6rem
- 2XL: 8rem
- 3XL: 12rem

## 🔌 Strapi Integration

### API Endpoints Used

- `GET /api/pages?filters[slug][$eq]=<slug>&populate=*`
  - Fetches page data with all sections

- `GET /api/products?populate=*&filters[isShow][$eq]=true`
  - Fetches visible products

### Expected Strapi Schema

#### Pages Collection

```javascript
{
  title: String,
  slug: UID,
  seo_title: String,
  seo_description: Text,
  sections: DynamicZone[
    // All section types with isShow boolean
  ]
}
```

#### Products Collection

```javascript
{
  name: String,
  slug: UID,
  description: Text,
  price: Decimal,
  diamond_type: String,
  carat: Decimal,
  shape: String,
  images: Media,
  featured: Boolean,
  isShow: Boolean
}
```

## 🛠️ Customization

### Adding a New Section Component

1. Create component file:
   ```javascript
   // src/components/sections/MySection.jsx
   import React from 'react';
   import './MySection.css';

   const MySection = ({ data }) => {
     return (
       <section className="my-section">
         {/* Your content */}
       </section>
     );
   };

   export default MySection;
   ```

2. Register in DynamicSection.jsx:
   ```javascript
   import MySection from './MySection';

   const componentMap = {
     // ...
     'sections.my-section': MySection,
   };
   ```

3. Create corresponding Strapi component in CMS

## 📱 Responsive Breakpoints

- Mobile: < 768px
- Tablet: 768px - 1024px
- Desktop: > 1024px

## 🚢 Production Build

```bash
npm run build
```

Output in `dist/` directory.

## 🎯 Performance Features

- Lazy loading images
- Code splitting
- Optimized animations
- Minimal bundle size
- Fast page loads

## 📄 License

Proprietary - Di'aaru Brand

## 🤝 Support

For questions or support, contact the development team.
