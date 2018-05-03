FROM node:8.9-alpine

# Force port 3000
ENV API_PORT 3000

# Install GIT
RUN apk update && apk add --no-cache git

# Create app directory
RUN mkdir -p /app

# Install app dependencies
ADD package.json /tmp/package.json
RUN cd /tmp && npm install
RUN cp -a /tmp/node_modules /app

# Build app source
WORKDIR /app
COPY . /app

RUN npm run build
RUN npm prune --production

EXPOSE $API_PORT

CMD [ "npm", "start" ]
