FROM node:8
WORKDIR /usr/src/app
COPY package*.json ./
RUN npm install
RUN npm install -g prisma
COPY . .
EXPOSE 4000
CMD ["prisma", "deploy"]
CMD ["npm", "start"]