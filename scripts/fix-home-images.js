'use strict';

async function main() {
    const { createStrapi, compileStrapi } = require('@strapi/strapi');

    console.log('Compiling Strapi...');
    const appContext = await compileStrapi();
    const app = await createStrapi(appContext).load();

    try {
        // 1. Find or Upload the images
        const fs = require('fs-extra');
        const path = require('path');
        const mime = require('mime-types');

        async function ensureFile(filename, name) {
            const existing = await strapi.query('plugin::upload.file').findOne({
                where: { name }
            });
            if (existing) return existing;

            const filepath = path.join('data', 'uploads', filename);
            if (!fs.existsSync(filepath)) {
                console.warn(`File not found: ${filepath}`);
                return null;
            }

            const stats = fs.statSync(filepath);
            const ext = filepath.split('.').pop();
            const mimeType = mime.lookup(ext || '') || 'image/png';

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

        const heroFile = await ensureFile('diamond-hero.png', 'diamond-hero');
        const roundFile = await ensureFile('diamond-round.png', 'diamond-round');

        // 2. Update Home Page
        const homePage = await strapi.documents('api::page.page').findFirst({
            filters: { slug: 'home' },
            populate: { sections: { populate: '*' } }
        });

        if (homePage) {
            console.log('Found Home Page, updating sections...');
            const updatedSections = homePage.sections.map(section => {
                if (section.__component === 'shared.hero-section') {
                    return { ...section, background_image: heroFile };
                }
                if (section.__component === 'shared.about-section') {
                    return { ...section, image: roundFile };
                }
                return section;
            });

            await strapi.documents('api::page.page').update({
                documentId: homePage.documentId,
                data: {
                    sections: updatedSections
                },
                status: 'published'
            });
            console.log('Home Page updated successfully');
        } else {
            console.warn('Home page not found');
        }

    } catch (error) {
        console.error('Error fixing home images:', error);
    } finally {
        await app.destroy();
        process.exit(0);
    }
}

main();
