FROM node:8-alpine

COPY /finish/pub-finish-sub-score/app.js /srv/task/app.js
COPY /finish/pub-finish-sub-score/calculator.js /srv/task/calculator.js
COPY /finish/pub-finish-sub-score/package.json /srv/task/package.json
COPY /finish/pub-finish-sub-score/package-lock.json /srv/task/package-lock.json

WORKDIR /srv/task

RUN npm install

CMD ["npm", "start"]

ARG gcp_credentials_path
COPY ${gcp_credentials_path} /srv/task/gcp.json
ENV GOOGLE_APPLICATION_CREDENTIALS /srv/task/gcp.json

ARG mongodb_uri
ENV MONGODB_URI ${mongodb_uri}