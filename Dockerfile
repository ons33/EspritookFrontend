# Utilise l'image officielle de Node.js comme base
FROM node:16

# Définit le répertoire de travail dans le conteneur
WORKDIR /app

# Copie les fichiers de dépendances et installe les dépendances
COPY package*.json ./

# Installer les dépendances avec l'option de délai d'attente réseau correcte
RUN npm install --force --legacy-peer-deps --fetch-timeout=160000

# Copie le reste du code source de l'application dans le conteneur
COPY . .

# Expose le port sur lequel votre application React s'exécutera
EXPOSE 3000

# Commande pour démarrer l'application React
CMD ["npm", "start"]
