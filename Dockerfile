FROM node:14.18.3 as nodeBuilder

WORKDIR /app
COPY package.json ./
COPY ./ ./
RUN npm i
CMD ["npm", "run", "start"]