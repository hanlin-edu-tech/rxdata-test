FROM node:8-alpine

COPY /user/watcher-user/app.js /srv/watcher/app.js
COPY /user/watcher-user/package.json /srv/watcher/package.json
COPY /user/watcher-user/package-lock.json /srv/watcher/package-lock.json

WORKDIR /srv/watcher

RUN npm install

CMD ["npm", "start"]

ARG gcp_credentials_path
COPY ${gcp_credentials_path} /srv/watcher/gcp.json
ENV GOOGLE_APPLICATION_CREDENTIALS /srv/watcher/gcp.json

ARG mongodb_uri
ENV MONGODB_URI ${mongodb_uri}