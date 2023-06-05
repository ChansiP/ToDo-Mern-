FROM node:alpine
WORKDIR /app
COPY package.json .
COPY . .

RUN npm install 
EXPOSE 1337
CMD ["node", "index.js"]