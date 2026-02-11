'use strict';

async function setPublicPermissions(strapi, newPermissions) {
    // Find the ID of the public role
    const publicRole = await strapi.query('plugin::users-permissions.role').findOne({
        where: {
            type: 'public',
        },
    });

    if (!publicRole) {
        console.error('Public role not found');
        return;
    }

    console.log(`Setting permissions for Public role (ID: ${publicRole.id})...`);

    // Create the new permissions and link them to the public role
    for (const uid of Object.keys(newPermissions)) {
        const actions = newPermissions[uid];
        for (const action of actions) {
            const actionName = `api::${uid}.${uid}.${action}`;

            // Check if permission already exists
            const existing = await strapi.query('plugin::users-permissions.permission').findOne({
                where: {
                    action: actionName,
                    role: publicRole.id,
                },
            });

            if (!existing) {
                await strapi.query('plugin::users-permissions.permission').create({
                    data: {
                        action: actionName,
                        role: publicRole.id,
                    },
                });
                console.log(`  ✓ Created permission: ${actionName}`);
            } else {
                console.log(`  - Permission already exists: ${actionName}`);
            }
        }
    }
}

async function main() {
    const { createStrapi, compileStrapi } = require('@strapi/strapi');

    try {
        console.log('Compiling Strapi...');
        const appContext = await compileStrapi();
        const app = await createStrapi(appContext).load();

        await setPublicPermissions(app, {
            page: ['find', 'findOne'],
            product: ['find', 'findOne'],
        });

        console.log('Done!');
        await app.destroy();
        process.exit(0);
    } catch (err) {
        console.error(err);
        process.exit(1);
    }
}

main();
