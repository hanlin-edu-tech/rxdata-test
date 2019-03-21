FROM node:8-alpine

COPY /finish/pub-finish-sub-firestore/app.js /srv/task/app.js
COPY /finish/pub-finish-sub-firestore/synchronizer.js /srv/task/synchronizer.js
COPY /finish/pub-finish-sub-firestore/package.json /srv/task/package.json
COPY /finish/pub-finish-sub-firestore/package-lock.json /srv/task/package-lock.json

WORKDIR /srv/task

RUN npm install

CMD ["npm", "start"]

ARG gcp_credentials_path
COPY ${gcp_credentials_path} /srv/task/gcp.json
ENV GOOGLE_APPLICATION_CREDENTIALS /srv/task/gcp.json

ARG mongodb_uri
ENV MONGODB_URI ${mongodb_uri}