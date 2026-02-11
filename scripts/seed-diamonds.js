'use strict';

const fs = require('fs-extra');
const path = require('path');
const mime = require('mime-types');

async function seedDiamonds() {
  const diamonds = require('../data/diamond-products.json');
  console.log(`Starting to seed ${diamonds.length} diamond products...`);

  try {
    for (const diamond of diamonds) {
      console.log(`Seeding product: ${diamond.name}`);
      
      let uploadedImages = [];
      if (diamond.images && diamond.images.length > 0) {
        for (const imageName of diamond.images) {
          const imagePath = path.join('data', 'uploads', imageName);
          if (fs.existsSync(imagePath)) {
            const uploadedFile = await uploadFile(imagePath, imageName.split('.').shift());
            if (uploadedFile) {
              uploadedImages.push(uploadedFile);
            }
          } else {
            console.warn(`Warning: Image ${imageName} not found in data/uploads. Skipping image.`);
          }
        }
      }

      await strapi.documents('api::product.product').create({
        data: {
          ...diamond,
          images: uploadedImages,
          publishedAt: new Date(),
        },
      });
      console.log(`Successfully seeded: ${diamond.name}`);
    }
    console.log('Finished seeding diamond products.');
  } catch (error) {
    console.error('Error seeding diamonds:', error);
  }
}

async function uploadFile(filepath, name) {
  const stats = fs.statSync(filepath);
  const ext = filepath.split('.').pop();
  const mimeType = mime.lookup(ext || '') || 'image/jpeg';

  const fileData = {
    filepath,
    originalFileName: path.basename(filepath),
    size: stats.size,
    mimetype: mimeType,
  };

  const uploaded = await strapi
    .plugin('upload')
    .service('upload')
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

async function main() {
  const { createStrapi, compileStrapi } = require('@strapi/strapi');

  console.log('Compiling Strapi...');
  const appContext = await compileStrapi();
  const app = await createStrapi(appContext).load();

  app.log.level = 'info';

  await seedDiamonds();
  
  await app.destroy();
  process.exit(0);
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
