from node:alpine
WORKDIR /usr/bin/snake-server/
COPY server /usr/bin/snake-server
CMD node /usr/bin/snake-server/server.js
EXPOSE 3000

