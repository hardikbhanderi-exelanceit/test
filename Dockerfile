# Strapi Dockerfile
FROM node:20-alpine

# Installing libvips-dev for sharp Compatibility
RUN apk update && apk add --no-cache build-base gcc autoconf automake zlib-dev libpng-dev nasm bash vips-dev git

# Set initial NODE_ENV to development to ensure devDependencies (like typescript) are installed for the build
ENV NODE_ENV=development

WORKDIR /opt/app
COPY package.json package-lock.json ./
RUN npm config set fetch-retry-maxtimeout 600000 -g && npm install
ENV PATH /opt/app/node_modules/.bin:$PATH

COPY . .

# Build Strapi admin panel
RUN npm run build

# Change ownership to the node user
RUN chown -R node:node /opt/app
USER node

# Switch to production for the runtime
ENV NODE_ENV=production

EXPOSE 1337
CMD ["npm", "run", "start"]
