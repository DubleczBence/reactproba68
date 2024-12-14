# Alap image
FROM node:16-alpine

# Mappa beállítása a konténeren belül
WORKDIR /app

# Másold a package.json fájlt
COPY package.json ./

# Függőségek telepítése
RUN npm install

# Másold át a teljes projektet
COPY . .

# Buildeljük a React alkalmazást
RUN npm run build

# Port megnyitása
EXPOSE 3000

# Alkalmazás futtatása
CMD ["npx", "serve", "-s", "build"]