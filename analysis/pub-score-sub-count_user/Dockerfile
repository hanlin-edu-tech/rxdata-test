FROM node:8-alpine

COPY /analysis/pub-score-sub-count_user/app.js /srv/task/app.js
COPY /analysis/pub-score-sub-count_user/calculator.js /srv/task/calculator.js
COPY /analysis/pub-score-sub-count_user/package.json /srv/task/package.json
COPY /analysis/pub-score-sub-count_user/package-lock.json /srv/task/package-lock.json

WORKDIR /srv/task

RUN npm install

CMD ["npm", "start"]

ARG gcp_credentials_path
COPY ${gcp_credentials_path} /srv/task/gcp.json
ENV GOOGLE_APPLICATION_CREDENTIALS /srv/task/gcp.json

ARG mongodb_uri
ENV MONGODB_URI ${mongodb_uri}