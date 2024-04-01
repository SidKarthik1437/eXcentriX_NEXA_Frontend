# Use the latest Node.js as the base image
FROM node:latest

# Set working directory
WORKDIR /app


# Install app dependencies
COPY package.json ./
COPY package-lock.json ./
RUN npm cache clear --force
RUN npm config set strict-ssl false
# RUN npm config set registry "http://registry.npmjs.org/"
# RUN npm install

# Add app
COPY . ./

# Start app
CMD ["npm", "run", "build"]
