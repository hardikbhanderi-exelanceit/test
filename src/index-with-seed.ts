/**
 * Strapi Application Entry Point with Optional Auto-Seeding
 *
 * To enable auto-seeding on first run, set SEED_DATA=true in .env
 */

import type { Core } from '@strapi/strapi';

export default {
  /**
   * An asynchronous register function that runs before
   * your application is initialized.
   */
  register(/* { strapi }: { strapi: Core.Strapi } */) {},

  /**
   * An asynchronous bootstrap function that runs before
   * your application gets started.
   *
   * Use this to seed data automatically on first run
   */
  async bootstrap({ strapi }: { strapi: Core.Strapi }) {
    // Auto-seed on first run if SEED_DATA=true in .env
    if (process.env.SEED_DATA === 'true') {
      try {
        const { seedData } = require('../database/seed-bootstrap');
        await seedData(strapi);
      } catch (error) {
        console.error('Error during bootstrap seeding:', error);
      }
    }
  },
};
