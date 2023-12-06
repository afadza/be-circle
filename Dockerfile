# Gunakan node versi yang diinginkan sebagai base image
FROM node:18-alpine

# Set working directory di dalam container
WORKDIR /app

# Copy package.json dan package-lock.json ke dalam container
COPY package.json package-lock.json ./

# Install dependencies
RUN npm install -g nodemon
RUN npm install

# Copy seluruh proyek ke dalam container
COPY . .

# Build proyek (jika diperlukan)
# RUN npm run

# Expose port yang akan digunakan oleh aplikasi
# EXPOSE 3000

# Jalankan aplikasi
USER node
CMD ["yarn", "start"]
