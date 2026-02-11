"use strict";

const fs = require("fs-extra");
const path = require("path");
const mime = require("mime-types");

// Data from diamond-products.json
const extraProducts = [
  {
    name: "1.5 Carat Brilliant Round Lab Grown Diamond",
    description:
      "Exquisite 1.5 carat round brilliant cut lab grown diamond. This stone features exceptional VVS1 clarity and E color grade, offering maximum fire and brilliance. Perfect for an engagement ring or a timeless pendant.",
    price: 2400.0,
    diamond_type: "Lab Grown",
    carat: 1.5,
    shape: "Round",
    images: ["diamond-round.png"],
    featured: true,
    isShow: true,
  },
  {
    name: "2.0 Carat Princess Cut Lab Grown Diamond",
    description:
      "Stunning 2.0 carat princess cut lab grown diamond. Known for its modern look and sharp geometric lines, this IF clarity stone has a D color grade, representing the pinnacle of lab-grown quality.",
    price: 4200.0,
    diamond_type: "Lab Grown",
    carat: 2.0,
    shape: "Princess",
    images: ["diamond-princess.png"],
    featured: true,
    isShow: true,
  },
  {
    name: "1.2 Carat Emerald Cut Lab Grown Diamond",
    description:
      "Elegant 1.2 carat emerald cut diamond with long, step-cut facets that create a unique 'hall of mirrors' effect. VS1 clarity and F color grade. A sophisticated choice for classic jewelry.",
    price: 1850.0,
    diamond_type: "Lab Grown",
    carat: 1.2,
    shape: "Emerald",
    images: ["diamond-3.jpg"],
    featured: false,
    isShow: true,
  },
  {
    name: "1.75 Carat Oval Cut Lab Grown Diamond",
    description:
      "Beautiful 1.75 carat oval cut diamond that offers an elongated appearance, making it look larger than a round diamond of the same weight. VVS2 clarity and G color.",
    price: 2900.0,
    diamond_type: "Lab Grown",
    carat: 1.75,
    shape: "Oval",
    images: ["diamond-4.jpg"],
    featured: true,
    isShow: true,
  },
  {
    name: "2.5 Carat Cushion Cut Lab Grown Diamond",
    description:
      "Luxurious 2.5 carat cushion cut diamond with rounded corners and larger facets for increased sparkle. Ideal for vintage-inspired settings. VS2 clarity, H color.",
    price: 5100.0,
    diamond_type: "Lab Grown",
    carat: 2.5,
    shape: "Cushion",
    images: ["diamond-5.jpg"],
    featured: true,
    isShow: true,
  },
  {
    name: "1.0 Carat Pear Cut Lab Grown Diamond",
    description:
      "Unique 1.0 carat pear-shaped lab grown diamond, also known as a teardrop. Perfect for a pendant or a distinctive engagement ring. VVS1 clarity, E color.",
    price: 1600.0,
    diamond_type: "Lab Grown",
    carat: 1.0,
    shape: "Pear",
    images: ["diamond-6.jpg"],
    featured: false,
    isShow: true,
  },
  {
    name: "1.3 Carat Heart Shape Lab Grown Diamond",
    description:
      "Romantic 1.3 carat heart-shaped lab diamond. A symbol of love and affection, this stone is cut to perfection. IF clarity, D color.",
    price: 2100.0,
    diamond_type: "Lab Grown",
    carat: 1.3,
    shape: "Heart",
    images: ["diamond-7.jpg"],
    featured: true,
    isShow: true,
  },
  {
    name: "3.0 Carat Radiant Cut Lab Grown Diamond",
    description:
      "Impressive 3.0 carat radiant cut lab diamond, combining the cut of an emerald with the brilliance of a round diamond. VS1 clarity, F color.",
    price: 7500.0,
    diamond_type: "Lab Grown",
    carat: 3.0,
    shape: "Radiant",
    images: ["diamond-8.jpg"],
    featured: true,
    isShow: true,
  },
  {
    name: "1.1 Carat Marquise Cut Lab Grown Diamond",
    description:
      "Distinctive 1.1 carat marquise cut diamond with pointed ends and a boat-like shape. Provides a dramatic and elegant look. VVS2 clarity, G color.",
    price: 1750.0,
    diamond_type: "Lab Grown",
    carat: 1.1,
    shape: "Marquise",
    images: ["diamond-9.jpg"],
    featured: false,
    isShow: true,
  },
  {
    name: "2.2 Carat Asscher Cut Lab Grown Diamond",
    description:
      "Classic 2.2 carat Asscher cut diamond with a square shape and high crown. This art deco style stone offers timeless elegance. VS1 clarity, E color.",
    price: 4800.0,
    diamond_type: "Lab Grown",
    carat: 2.2,
    shape: "Asscher",
    images: ["diamond-10.jpg"],
    featured: true,
    isShow: true,
  },
];

// Data from database/seed.js
const initialProducts = [
  {
    name: "Eternal Solitaire Ring",
    description:
      "<p>A timeless masterpiece featuring a stunning 1.5-carat round brilliant lab-grown diamond set in 18K white gold. This classic solitaire design showcases the diamond's exceptional brilliance with a delicate four-prong setting that maximizes light reflection.</p><p>Each diamond is ethically created in our state-of-the-art facility, ensuring conflict-free sourcing and environmental responsibility.</p>",
    price: 5999.0,
    diamond_type: "Lab Grown",
    carat: 1.5,
    shape: "Round Brilliant",
    images: ["diamond-round-ring.png"],
    featured: true,
    isShow: true,
  },
  {
    name: "Princess Cut Halo Engagement Ring",
    description:
      "<p>Exquisite princess cut center stone (2.0ct) surrounded by a halo of smaller brilliant diamonds, creating a stunning celestial effect. Set in platinum for ultimate durability and elegance.</p><p>The halo design adds approximately 0.5 carats of accent diamonds, enhancing the overall brilliance and making the center stone appear larger.</p>",
    price: 8499.0,
    diamond_type: "Lab Grown",
    carat: 2.0,
    shape: "Princess",
    images: ["diamond-princess-ring.png"],
    featured: true,
    isShow: true,
  },
  {
    name: "Cushion Cut Three-Stone Ring",
    description:
      "<p>A romantic three-stone design featuring a 1.8-carat cushion cut center diamond flanked by two matching side stones (0.5ct each). The vintage-inspired setting in rose gold adds warmth and character.</p><p>Symbolizing your past, present, and future together, this timeless design has been cherished for generations.</p>",
    price: 7299.0,
    diamond_type: "Lab Grown",
    carat: 1.8,
    shape: "Cushion",
    featured: true,
    isShow: true,
  },
  {
    name: "Emerald Cut Eternity Band",
    description:
      "<p>Sophisticated emerald cut diamonds (total 3.0ct) set in a continuous 18K yellow gold band. Each stone is carefully selected for consistent color and clarity, creating a seamless line of brilliance.</p><p>Perfect as a wedding band or anniversary gift, this eternity band represents never-ending love.</p>",
    price: 6799.0,
    diamond_type: "Lab Grown",
    carat: 3.0,
    shape: "Emerald",
    featured: false,
    isShow: true,
  },
  {
    name: "Oval Diamond Vintage Ring",
    description:
      "<p>An exquisite 1.6-carat oval diamond in a vintage-inspired setting with intricate milgrain detailing and delicate filigree work. Set in platinum with accent diamonds on the shoulders.</p><p>This design combines old-world craftsmanship with modern diamond technology, creating a unique heirloom piece.</p>",
    price: 6299.0,
    diamond_type: "Lab Grown",
    carat: 1.6,
    shape: "Oval",
    featured: true,
    isShow: true,
  },
  {
    name: "Pear Shape Pendant Necklace",
    description:
      "<p>A stunning 1.2-carat pear-shaped diamond suspended from a delicate 18K white gold chain. The classic teardrop silhouette captures and reflects light beautifully from every angle.</p><p>Simple yet elegant, this pendant is versatile enough for daily wear yet sophisticated enough for special occasions.</p>",
    price: 3899.0,
    diamond_type: "Lab Grown",
    carat: 1.2,
    shape: "Pear",
    featured: false,
    isShow: true,
  },
  {
    name: "Radiant Cut Cocktail Ring",
    description:
      "<p>Make a statement with this bold 2.5-carat radiant cut diamond cocktail ring. The emerald-cut style with trimmed corners is set in 18K yellow gold with a split shank design adorned with pavé diamonds.</p><p>Perfect for those who appreciate distinctive, eye-catching jewelry that commands attention.</p>",
    price: 9999.0,
    diamond_type: "Lab Grown",
    carat: 2.5,
    shape: "Radiant",
    featured: false,
    isShow: true,
  },
  {
    name: "Classic Diamond Stud Earrings",
    description:
      "<p>Timeless elegance in the form of 1.0-carat total weight (0.5ct each) round brilliant diamond studs. Set in 14K white gold with secure screw-back posts for daily comfort and security.</p><p>A wardrobe essential that complements any outfit, from casual to formal.</p>",
    price: 2999.0,
    diamond_type: "Lab Grown",
    carat: 1.0,
    shape: "Round Brilliant",
    featured: false,
    isShow: true,
  },
  {
    name: "Marquise Diamond Fashion Ring",
    description:
      "<p>A unique 1.4-carat marquise diamond set east-west in a modern bezel setting. The 18K rose gold band features subtle accent diamonds leading to the center stone.</p><p>This contemporary design is perfect for the modern woman who appreciates unconventional beauty.</p>",
    price: 5499.0,
    diamond_type: "Lab Grown",
    carat: 1.4,
    shape: "Marquise",
    featured: false,
    isShow: true,
  },
  {
    name: "Asscher Cut Art Deco Ring",
    description:
      "<p>Vintage Art Deco inspired design featuring a 1.7-carat asscher cut diamond with geometric step cuts that create a hall-of-mirrors effect. Set in platinum with calibré sapphire accents.</p><p>A tribute to the glamorous 1920s, this ring is for the collector of fine, distinctive jewelry.</p>",
    price: 7899.0,
    diamond_type: "Lab Grown",
    carat: 1.7,
    shape: "Asscher",
    featured: false,
    isShow: true,
  },
];

// Home Page Content Data
const homePageData = {
  title: "Home",
  slug: "home",
  seo_title:
    "Di'aaru - Luxury Lab-Grown Diamonds | Ethical & Sustainable Fine Jewelry",
  seo_description:
    "Discover Di'aaru's exquisite collection of lab-grown diamonds. Ethically crafted, environmentally sustainable, and brilliantly beautiful. Each piece tells a story of timeless elegance and modern responsibility.",
  publishedAt: new Date(),
  sections: [
    {
      __component: "shared.hero-section",
      heading: "Timeless Brilliance",
      sub_heading: "LUXURY LAB-GROWN DIAMONDS",
      description:
        "<p>Ethically crafted, infinitely beautiful. Discover diamonds that reflect not just light, but your values.</p>",
      button_text: "Explore Our Collection",
      button_link: "#products",
      background_image: "diamond-hero.png",
      isShow: true,
    },
    {
      __component: "shared.about-section",
      title: "Our Story of Excellence",
      description:
        "<p>At Di'aaru, we believe that true luxury isn't just about beauty—it's about responsibility, craftsmanship, and timeless value.</p><p>Founded on the principle that exceptional diamonds should be accessible without compromising ethics or the environment, we've pioneered the art of creating laboratory-grown diamonds that are chemically, physically, and optically identical to mined diamonds.</p><p>Every Di'aaru diamond begins as a tiny seed in our state-of-the-art facility, where cutting-edge technology and centuries-old gemological knowledge combine to create stones of extraordinary brilliance. Our master craftsmen then transform these pristine diamonds into heirloom pieces that will be treasured for generations.</p><p>We're not just selling jewelry—we're offering a new way to celebrate life's precious moments, with beauty that comes from innovation rather than extraction.</p>",
      image: "diamond-round.png",
      isShow: true,
    },
    {
      __component: "shared.product-section",
      section_title: "Signature Collection",
      isShow: true,
      // Products will be linked after creation
    },
    {
      __component: "shared.why-choose-us",
      title: "The Di'aaru Difference",
      isShow: true,
      features: [
        {
          feature_title: "Unmatched Quality",
          feature_description:
            "Every diamond is certified by leading gemological institutes with grades of D-F color and VS1 or better clarity. We never compromise on quality.",
        },
        {
          feature_title: "Ethically Created",
          feature_description:
            "100% conflict-free and environmentally sustainable. Our lab-grown diamonds have 1/10th the carbon footprint of mined diamonds.",
        },
        {
          feature_title: "Master Craftsmanship",
          feature_description:
            "Handcrafted by artisans with decades of experience. Each piece is individually inspected to meet our exacting standards.",
        },
        {
          feature_title: "Lifetime Warranty",
          feature_description:
            "Comprehensive coverage including complimentary cleaning, resizing, and inspection. Your investment is protected forever.",
        },
        {
          feature_title: "Exceptional Value",
          feature_description:
            "Lab-grown diamonds cost 40-60% less than mined equivalents, allowing you to choose a larger, higher-quality stone within your budget.",
        },
        {
          feature_title: "Personalized Service",
          feature_description:
            "Dedicated jewelry consultants guide you through every step, from selection to customization, ensuring your vision becomes reality.",
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
          review:
            "<p>We spent months searching for the perfect engagement ring, and Di'aaru exceeded every expectation. The 1.8-carat cushion cut is absolutely breathtaking, and knowing it's ethically created makes it even more special. The quality rivals any mined diamond we saw, but at half the price. Our consultant was patient, knowledgeable, and never pressured us. This ring will be in our family for generations.</p>",
        },
        {
          customer_name: "Jennifer Martinez",
          review:
            "<p>As someone who values sustainability, I was thrilled to discover Di'aaru. My anniversary band is exquisite—the emerald cut stones are perfectly matched and the craftsmanship is impeccable. I've received countless compliments, and I love sharing the story of lab-grown diamonds. It's luxury with a conscience.</p>",
        },
        {
          customer_name: "David Chen",
          review:
            "<p>I proposed with a Di'aaru solitaire and my fiancée hasn't stopped admiring it! The brilliance is incredible, and the entire process was seamless—from virtual consultation to custom design to delivery. The certificate of authenticity and detailed care instructions show their commitment to excellence.</p>",
        },
        {
          customer_name: "Emily Rodriguez",
          review:
            "<p>I inherited my grandmother's jewelry but wanted something uniquely mine for my wedding. Di'aaru helped me design a custom piece incorporating elements from her ring. The result is stunning—a perfect blend of vintage sentiment and modern beauty. The team's artistry and attention to detail are unmatched.</p>",
        },
      ],
    },
    {
      __component: "shared.gallery-section",
      title: "Craftsmanship Gallery",
      isShow: true,
      images: [
        "luxury_diamond_macro.png",
        "floating_diamond.png",
        "diamond_group_velvet.png",
        "diamond_refraction_effect.png",
        "minimal_luxury_diamond_bg.png",
        "ice_style_diamond_concept.png",
      ],
    },
    {
      __component: "shared.contact-section",
      title: "Begin Your Journey",
      address:
        "456 Fifth Avenue, Suite 2800\nNew York, NY 10018\nUnited States",
      phone: "+1 (212) 555-DIAM (3426)",
      email: "concierge@diaaru.com",
      map_link: "https://maps.google.com",
      isShow: true,
    },
  ],
};

async function uploadFile(strapi, filepath, name) {
  if (!fs.existsSync(filepath)) return null;

  const stats = fs.statSync(filepath);
  const ext = filepath.split(".").pop();
  const mimeType = mime.lookup(ext || "") || "image/jpeg";

  const fileData = {
    filepath,
    originalFileName: path.basename(filepath),
    size: stats.size,
    mimetype: mimeType,
  };

  const uploaded = await strapi
    .plugin("upload")
    .service("upload")
    .upload({
      files: fileData,
      data: {
        fileInfo: {
          alternativeText: name,
          caption: name,
          name,
        },
      },
    });

  return uploaded && uploaded.length > 0 ? uploaded[0] : null;
}

async function seed(strapi) {
  try {
    console.log("🌱 Starting Di'aaru combined data seeding...\n");

    // Clear existing data
    console.log("🗑️  Clearing existing data...");
    await strapi.db.query("api::product.product").deleteMany({});
    await strapi.db.query("api::page.page").deleteMany({});
    console.log("✅ Existing data cleared\n");

    const allProducts = [...initialProducts, ...extraProducts];
    const createdProducts = [];

    console.log(`💎 Creating ${allProducts.length} products...`);
    for (const productData of allProducts) {
      let uploadedImages = [];
      if (productData.images && productData.images.length > 0) {
        for (const imageName of productData.images) {
          const imagePath = path.join("data", "uploads", imageName);
          const uploadedFile = await uploadFile(
            strapi,
            imagePath,
            imageName.split(".").shift(),
          );
          if (uploadedFile) uploadedImages.push(uploadedFile);
        }
      }

      const product = await strapi.documents("api::product.product").create({
        data: {
          ...productData,
          images: uploadedImages,
          publishedAt: new Date(),
        },
        status: "published",
      });
      createdProducts.push(product);
      console.log(`  ✓ Created: ${productData.name}`);
    }
    console.log(`✅ ${createdProducts.length} products created\n`);

    // Link featured products to product section
    const featuredProducts = createdProducts
      .filter((p) => p.featured)
      .slice(0, 8)
      .map((p) => p.documentId); // Use documentId for v5

    // Update product section with product IDs
    const productSectionIndex = homePageData.sections.findIndex(
      (s) => s.__component === "shared.product-section",
    );
    if (productSectionIndex !== -1) {
      homePageData.sections[productSectionIndex].products = featuredProducts;
    }

    // Handle images for sections
    console.log("🖼️  Uploading images for home page sections...");
    for (const section of homePageData.sections) {
      if (
        section.background_image &&
        typeof section.background_image === "string"
      ) {
        const imagePath = path.join(
          "data",
          "uploads",
          section.background_image,
        );
        const uploadedFile = await uploadFile(
          strapi,
          imagePath,
          section.background_image.split(".").shift(),
        );
        if (uploadedFile) section.background_image = uploadedFile;
      }
      if (section.image && typeof section.image === "string") {
        const imagePath = path.join("data", "uploads", section.image);
        const uploadedFile = await uploadFile(
          strapi,
          imagePath,
          section.image.split(".").shift(),
        );
        if (uploadedFile) section.image = uploadedFile;
      }
      // Handle array of images (e.g., for Gallery Section)
      if (section.images && Array.isArray(section.images)) {
        const uploadedImages = [];
        for (const imageName of section.images) {
          if (typeof imageName === "string") {
            const imagePath = path.join("data", "uploads", imageName);
            const uploadedFile = await uploadFile(
              strapi,
              imagePath,
              imageName.split(".").shift(),
            );
            if (uploadedFile) uploadedImages.push(uploadedFile);
          }
        }
        if (uploadedImages.length > 0) section.images = uploadedImages;
      }
    }

    // Create Home Page
    console.log("📄 Creating home page with sections...");
    await strapi.documents("api::page.page").create({
      data: homePageData,
      status: "published",
    });
    console.log("✅ Home page created with all sections\n");

    console.log("✨ SEEDING COMPLETED SUCCESSFULLY! ✨");
  } catch (error) {
    console.error("❌ Error during seeding:", error);
    throw error;
  }
}

async function main() {
  const { createStrapi, compileStrapi } = require("@strapi/strapi");

  try {
    console.log("Compiling Strapi...");
    const appContext = await compileStrapi();
    const app = await createStrapi(appContext).load();

    app.log.level = "info";

    await seed(app);

    await app.destroy();
    process.exit(0);
  } catch (err) {
    console.error("Fatal error during seeding:", err);
    process.exit(1);
  }
}

main();
