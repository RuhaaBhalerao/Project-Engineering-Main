FROM node:20

WORKDIR /app

COPY package*.json ./

# Install all deps so we can run prisma generate, then prune dev deps
RUN npm ci && npm install dotenv

COPY prisma ./prisma/

RUN npx prisma generate || true

# Remove devDependencies for a lean runtime image
#RUN npm prune --production

# Copy only runtime source to avoid clobbering installed node_modules
COPY src ./src
COPY prisma ./prisma

# Clear any ENTRYPOINT inherited from the base image
ENTRYPOINT []

EXPOSE 3000

CMD ["node", "src/server.js"]
