# Di'aaru - Luxury Lab-Grown Diamond Website

A premium, CMS-driven website for Di'aaru luxury lab-grown diamonds, featuring a Strapi backend and a React frontend with sophisticated design.

## 🌟 Overview

Di'aaru showcases lab-grown diamonds through a fully dynamic, admin-controlled website. Every aspect of the site—from hero images to product displays—is manageable through the Strapi CMS, requiring zero code changes for content updates.

### Key Features

- **✨ Luxury Design**: Premium aesthetics inspired by Tiffany, Cartier, and Graff
- **🎨 Fully Dynamic**: All content managed via Strapi CMS
- **📱 Responsive**: Mobile-first, works beautifully on all devices
- **🚀 High Performance**: Optimized loading and smooth animations
- **♿ Accessible**: WCAG-compliant design patterns
- **🔍 SEO Optimized**: Dynamic meta tags and semantic HTML

## 🏗️ Tech Stack

### Backend (Strapi CMS)
- **Strapi 5.35.0**: Headless CMS
- **SQLite**: Development database
- **Node.js 20+**: Runtime environment

### Frontend (React)
- **React 18**: UI framework
- **Vite**: Build tool
- **Framer Motion**: Smooth animations
- **React Router**: Client-side routing
- **Axios**: API communication

## 📦 Quick Start

### Prerequisites

- Node.js 20+ and npm
- Git

### Installation

1. **Clone and setup**:
   ```bash
   git clone <your-repo-url>
   cd Diaaru
   chmod +x setup.sh
   ./setup.sh
   ```

   Or manually:
   ```bash
   # Install backend dependencies
   npm install

   # Install frontend dependencies
   cd frontend
   npm install
   cp .env.example .env
   cd ..
   ```

2. **Start Strapi backend**:
   ```bash
   npm run develop
   ```

   - Access admin panel: http://localhost:1337/admin
   - Create your first admin user

3. **Configure Strapi** (in a new terminal):

   Follow the complete setup guide in [`STRAPI_SETUP_GUIDE.md`](./STRAPI_SETUP_GUIDE.md)

4. **Start frontend** (in another terminal):
   ```bash
   cd frontend
   npm run dev
   ```

   - Frontend runs at: http://localhost:3000

## 📁 Project Structure

```
Diaaru/
├── config/              # Strapi configuration
├── src/
│   ├── api/             # Strapi API endpoints
│   └── components/      # Strapi components (shared)
├── frontend/            # React frontend application
│   ├── src/
│   │   ├── components/  # React components
│   │   │   ├── layout/  # Header, Footer
│   │   │   └── sections/# Dynamic section components
│   │   ├── pages/       # Page components
│   │   ├── utils/       # API utilities
│   │   └── styles/      # Global styles
│   ├── package.json
│   └── vite.config.js
├── public/
│   └── images/          # Static images (logo)
├── STRAPI_SETUP_GUIDE.md # Complete Strapi setup guide
├── setup.sh             # Quick setup script
└── package.json         # Strapi dependencies
```

## 🎨 Available Sections

The frontend dynamically renders these section types from Strapi:

| Section | Description |
|---------|-------------|
| **Hero** | Full-screen hero with image, title, subtitle, CTA |
| **About** | Brand story with features grid |
| **Products** | Product showcase grid (from Strapi relation) |
| **Why Choose Us** | Benefits/reasons grid with icons |
| **Testimonials** | Customer testimonials with ratings |
| **Gallery** | Image gallery with lightbox |
| **Contact** | Contact form with business info |
| **Slider** | Image carousel |
| **Media** | Single image/video display |
| **Rich Text** | Formatted content |
| **Quote** | Highlighted quote block |

## 🔧 Configuration

### Environment Variables

**Frontend** (`frontend/.env`):
```env
VITE_API_URL=http://localhost:1337
```

**Backend**:
See `.env.example` for Strapi configuration.

### Adding New Pages

1. Create page in Strapi Content Manager
2. Add sections via dynamic zone
3. Set slug (e.g., "about-us")
4. Publish
5. Access at: `http://localhost:3000/about-us`

### Managing Products

1. Go to Content Manager → Products
2. Create/edit products
3. Add to product sections via relation field
4. Products with `isShow: false` won't display

## 🚀 Development

### Backend Development
```bash
# Start Strapi in development mode
npm run develop

# Build admin panel
npm run build
```

### Frontend Development
```bash
cd frontend

# Start dev server (with hot reload)
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

## 📱 Responsive Design

- **Mobile**: < 768px (optimized touch interactions)
- **Tablet**: 768px - 1024px (adjusted layouts)
- **Desktop**: > 1024px (full experience)

## 🎯 Design Philosophy

The Di'aaru design embodies:

- **Refined Minimalism**: Clean, uncluttered layouts
- **Subtle Luxury**: Gold accents, generous spacing
- **Premium Typography**: Cormorant Garamond + Montserrat
- **Smooth Interactions**: Framer Motion animations
- **Timeless Elegance**: Classic color palette (cream, black, gold)

## 📚 Documentation

- **[Strapi Setup Guide](./STRAPI_SETUP_GUIDE.md)**: Complete backend configuration
- **[Frontend README](./frontend/README.md)**: Detailed frontend documentation
- **[Strapi Docs](https://docs.strapi.io)**: Official Strapi documentation
- **[React Docs](https://react.dev)**: Official React documentation

## 🐛 Troubleshooting

### Images not loading?
- Check Strapi upload permissions (Public role)
- Verify CORS configuration in `config/middlewares.ts`
- Ensure `VITE_API_URL` is correct in frontend `.env`

### Sections not rendering?
- Verify `isShow: true` in Strapi
- Check component name matches exactly (case-sensitive)
- Ensure all required fields are filled

### API errors?
- Confirm Strapi is running on port 1337
- Check public permissions for Pages and Products
- Review browser console and Strapi server logs

## 🔐 Security Notes

- Never commit `.env` files
- Update Strapi admin credentials in production
- Configure proper CORS for production domain
- Use environment variables for sensitive data

## 📄 License

Proprietary - Di'aaru Brand © 2026

## 🤝 Support

For setup assistance or questions:
1. Check the [STRAPI_SETUP_GUIDE.md](./STRAPI_SETUP_GUIDE.md)
2. Review [frontend/README.md](./frontend/README.md)
3. Check Strapi and browser console logs

---

**Built with precision for luxury. ✨**
