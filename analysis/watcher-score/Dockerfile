FROM node:8-alpine

COPY /analysis/watcher-score/app.js /srv/watcher/app.js
COPY /analysis/watcher-score/package.json /srv/watcher/package.json
COPY /analysis/watcher-score/package-lock.json /srv/watcher/package-lock.json

WORKDIR /srv/watcher

RUN npm install

CMD ["npm", "start"]

ARG gcp_credentials_path
COPY ${gcp_credentials_path} /srv/watcher/gcp.json
ENV GOOGLE_APPLICATION_CREDENTIALS /srv/watcher/gcp.json

ARG mongodb_uri
ENV MONGODB_URI ${mongodb_uri}