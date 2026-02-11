/**
 * Alternative Seed Script - Uses Strapi Bootstrap
 *
 * This is a more reliable approach for Strapi v5
 * Copy the seedData() function content into src/index.ts bootstrap if direct seeding doesn't work
 */

// Product Data
const productsData = [
  {
    name: "Eternal Solitaire Ring",
    description: "<p>A timeless masterpiece featuring a stunning 1.5-carat round brilliant lab-grown diamond set in 18K white gold. This classic solitaire design showcases the diamond's exceptional brilliance with a delicate four-prong setting that maximizes light reflection.</p><p>Each diamond is ethically created in our state-of-the-art facility, ensuring conflict-free sourcing and environmental responsibility.</p>",
    price: 5999.00,
    diamond_type: "Lab Grown",
    carat: 1.5,
    shape: "Round Brilliant",
    featured: true,
    isShow: true,
    publishedAt: new Date(),
  },
  {
    name: "Princess Cut Halo Engagement Ring",
    description: "<p>Exquisite princess cut center stone (2.0ct) surrounded by a halo of smaller brilliant diamonds, creating a stunning celestial effect. Set in platinum for ultimate durability and elegance.</p><p>The halo design adds approximately 0.5 carats of accent diamonds, enhancing the overall brilliance and making the center stone appear larger.</p>",
    price: 8499.00,
    diamond_type: "Lab Grown",
    carat: 2.0,
    shape: "Princess",
    featured: true,
    isShow: true,
    publishedAt: new Date(),
  },
  {
    name: "Cushion Cut Three-Stone Ring",
    description: "<p>A romantic three-stone design featuring a 1.8-carat cushion cut center diamond flanked by two matching side stones (0.5ct each). The vintage-inspired setting in rose gold adds warmth and character.</p><p>Symbolizing your past, present, and future together, this timeless design has been cherished for generations.</p>",
    price: 7299.00,
    diamond_type: "Lab Grown",
    carat: 1.8,
    shape: "Cushion",
    featured: true,
    isShow: true,
    publishedAt: new Date(),
  },
  {
    name: "Emerald Cut Eternity Band",
    description: "<p>Sophisticated emerald cut diamonds (total 3.0ct) set in a continuous 18K yellow gold band. Each stone is carefully selected for consistent color and clarity, creating a seamless line of brilliance.</p><p>Perfect as a wedding band or anniversary gift, this eternity band represents never-ending love.</p>",
    price: 6799.00,
    diamond_type: "Lab Grown",
    carat: 3.0,
    shape: "Emerald",
    featured: false,
    isShow: true,
    publishedAt: new Date(),
  },
  {
    name: "Oval Diamond Vintage Ring",
    description: "<p>An exquisite 1.6-carat oval diamond in a vintage-inspired setting with intricate milgrain detailing and delicate filigree work. Set in platinum with accent diamonds on the shoulders.</p><p>This design combines old-world craftsmanship with modern diamond technology, creating a unique heirloom piece.</p>",
    price: 6299.00,
    diamond_type: "Lab Grown",
    carat: 1.6,
    shape: "Oval",
    featured: true,
    isShow: true,
    publishedAt: new Date(),
  },
  {
    name: "Pear Shape Pendant Necklace",
    description: "<p>A stunning 1.2-carat pear-shaped diamond suspended from a delicate 18K white gold chain. The classic teardrop silhouette captures and reflects light beautifully from every angle.</p><p>Simple yet elegant, this pendant is versatile enough for daily wear yet sophisticated enough for special occasions.</p>",
    price: 3899.00,
    diamond_type: "Lab Grown",
    carat: 1.2,
    shape: "Pear",
    featured: false,
    isShow: true,
    publishedAt: new Date(),
  },
  {
    name: "Radiant Cut Cocktail Ring",
    description: "<p>Make a statement with this bold 2.5-carat radiant cut diamond cocktail ring. The emerald-cut style with trimmed corners is set in 18K yellow gold with a split shank design adorned with pavé diamonds.</p><p>Perfect for those who appreciate distinctive, eye-catching jewelry that commands attention.</p>",
    price: 9999.00,
    diamond_type: "Lab Grown",
    carat: 2.5,
    shape: "Radiant",
    featured: false,
    isShow: true,
    publishedAt: new Date(),
  },
  {
    name: "Classic Diamond Stud Earrings",
    description: "<p>Timeless elegance in the form of 1.0-carat total weight (0.5ct each) round brilliant diamond studs. Set in 14K white gold with secure screw-back posts for daily comfort and security.</p><p>A wardrobe essential that complements any outfit, from casual to formal.</p>",
    price: 2999.00,
    diamond_type: "Lab Grown",
    carat: 1.0,
    shape: "Round Brilliant",
    featured: false,
    isShow: true,
    publishedAt: new Date(),
  },
  {
    name: "Marquise Diamond Fashion Ring",
    description: "<p>A unique 1.4-carat marquise diamond set east-west in a modern bezel setting. The 18K rose gold band features subtle accent diamonds leading to the center stone.</p><p>This contemporary design is perfect for the modern woman who appreciates unconventional beauty.</p>",
    price: 5499.00,
    diamond_type: "Lab Grown",
    carat: 1.4,
    shape: "Marquise",
    featured: false,
    isShow: true,
    publishedAt: new Date(),
  },
  {
    name: "Asscher Cut Art Deco Ring",
    description: "<p>Vintage Art Deco inspired design featuring a 1.7-carat asscher cut diamond with geometric step cuts that create a hall-of-mirrors effect. Set in platinum with calibré sapphire accents.</p><p>A tribute to the glamorous 1920s, this ring is for the collector of fine, distinctive jewelry.</p>",
    price: 7899.00,
    diamond_type: "Lab Grown",
    carat: 1.7,
    shape: "Asscher",
    featured: false,
    isShow: true,
    publishedAt: new Date(),
  },
];

// For use in src/index.ts bootstrap function:
async function seedData(strapi) {
  console.log('🌱 Checking if seeding is needed...');

  // Check if data already exists
  const existingProducts = await strapi.db.query('api::product.product').findMany();
  const existingPages = await strapi.db.query('api::page.page').findMany();

  if (existingProducts.length > 0 || existingPages.length > 0) {
    console.log('⚠️  Data already exists. Skipping seed. Delete manually if you want to re-seed.');
    return;
  }

  console.log('📦 No data found. Starting seeding process...\n');

  // Create Products
  console.log('💎 Creating products...');
  const createdProducts = [];

  for (const productData of productsData) {
    const product = await strapi.entityService.create('api::product.product', {
      data: productData,
    });
    createdProducts.push(product);
    console.log(`  ✓ Created: ${productData.name}`);
  }
  console.log(`✅ ${createdProducts.length} products created\n`);

  // Get featured products for linking
  const featuredProducts = createdProducts
    .filter(p => p.featured)
    .slice(0, 4)
    .map(p => p.id);

  // Create Home Page
  console.log('📄 Creating home page...');

  const homePageData = {
    title: "Home",
    seo_title: "Di'aaru - Luxury Lab-Grown Diamonds | Ethical & Sustainable Fine Jewelry",
    seo_description: "Discover Di'aaru's exquisite collection of lab-grown diamonds. Ethically crafted, environmentally sustainable, and brilliantly beautiful.",
    publishedAt: new Date(),
    sections: [
      {
        __component: "shared.hero-section",
        heading: "Timeless Brilliance",
        sub_heading: "LUXURY LAB-GROWN DIAMONDS",
        description: "<p>Ethically crafted, infinitely beautiful. Discover diamonds that reflect not just light, but your values.</p>",
        button_text: "Explore Our Collection",
        button_link: "#products",
        isShow: true,
      },
      {
        __component: "shared.about-section",
        title: "Our Story of Excellence",
        description: "<p>At Di'aaru, we believe that true luxury isn't just about beauty—it's about responsibility, craftsmanship, and timeless value.</p><p>Founded on the principle that exceptional diamonds should be accessible without compromising ethics or the environment, we've pioneered the art of creating laboratory-grown diamonds that are chemically, physically, and optically identical to mined diamonds.</p><p>Every Di'aaru diamond begins as a tiny seed in our state-of-the-art facility, where cutting-edge technology and centuries-old gemological knowledge combine to create stones of extraordinary brilliance.</p>",
        isShow: true,
      },
      {
        __component: "shared.product-section",
        section_title: "Signature Collection",
        products: featuredProducts,
        isShow: true,
      },
      {
        __component: "shared.why-choose-us",
        title: "The Di'aaru Difference",
        isShow: true,
        features: [
          {
            feature_title: "Unmatched Quality",
            feature_description: "Every diamond is certified by leading gemological institutes with grades of D-F color and VS1 or better clarity.",
          },
          {
            feature_title: "Ethically Created",
            feature_description: "100% conflict-free and environmentally sustainable. Our lab-grown diamonds have 1/10th the carbon footprint.",
          },
          {
            feature_title: "Master Craftsmanship",
            feature_description: "Handcrafted by artisans with decades of experience. Each piece is individually inspected.",
          },
          {
            feature_title: "Lifetime Warranty",
            feature_description: "Comprehensive coverage including complimentary cleaning, resizing, and inspection forever.",
          },
          {
            feature_title: "Exceptional Value",
            feature_description: "Lab-grown diamonds cost 40-60% less than mined equivalents, allowing you to choose a larger stone.",
          },
          {
            feature_title: "Personalized Service",
            feature_description: "Dedicated jewelry consultants guide you through every step of your journey.",
          },
        ],
      },
      {
        __component: "shared.testimonial-section",
        section_title: "Stories From Our Clients",
        isShow: true,
        testimonials: [
          {
            customer_name: "Sarah & Michael Thompson",
            review: "<p>We spent months searching for the perfect engagement ring, and Di'aaru exceeded every expectation. The 1.8-carat cushion cut is absolutely breathtaking.</p>",
          },
          {
            customer_name: "Jennifer Martinez",
            review: "<p>As someone who values sustainability, I was thrilled to discover Di'aaru. My anniversary band is exquisite—the craftsmanship is impeccable.</p>",
          },
          {
            customer_name: "David Chen",
            review: "<p>I proposed with a Di'aaru solitaire and my fiancée hasn't stopped admiring it! The brilliance is incredible.</p>",
          },
          {
            customer_name: "Emily Rodriguez",
            review: "<p>Di'aaru helped me design a custom piece incorporating elements from my grandmother's ring. The result is stunning.</p>",
          },
        ],
      },
      {
        __component: "shared.gallery-section",
        title: "Craftsmanship Gallery",
        isShow: true,
      },
      {
        __component: "shared.contact-section",
        title: "Begin Your Journey",
        address: "456 Fifth Avenue, Suite 2800\nNew York, NY 10018\nUnited States",
        phone: "+1 (212) 555-DIAM (3426)",
        email: "concierge@diaaru.com",
        map_link: "https://maps.google.com",
        isShow: true,
      },
    ],
  };

  await strapi.entityService.create('api::page.page', {
    data: homePageData,
  });

  console.log('✅ Home page created\n');
  console.log('✨ SEEDING COMPLETED! ✨');
  console.log(`   • ${createdProducts.length} products`);
  console.log(`   • 7 sections on home page`);
  console.log(`   • 4 featured products linked\n`);
}

module.exports = { seedData, productsData };
