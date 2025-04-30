# Gunakan Node.js image
FROM node:18

# Buat direktori kerja
WORKDIR /app

# Salin file package
COPY package*.json ./

# Install dependencies
RUN npm install

# Salin semua file ke dalam container
COPY . .

# Jalankan aplikasi
CMD ["npm", "start"]
