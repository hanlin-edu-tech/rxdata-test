FROM node:8-alpine

EXPOSE 3000

COPY /web/bin /srv/web/bin
COPY /web/public /srv/web/public
COPY /web/routes /srv/web/routes
COPY /web/views /srv/web/views
COPY /web/app.js /srv/web/app.js
COPY /web/package.json /srv/web/package.json
COPY /web/package-lock.json /srv/web/package-lock.json

WORKDIR /srv/web

RUN npm install

CMD ["npm", "start"]

ARG gcp_credentials_path
COPY ${gcp_credentials_path} /srv/web/gcp.json
ENV GOOGLE_APPLICATION_CREDENTIALS /srv/web/gcp.json

ARG mongodb_uri
ENV MONGODB_URI ${mongodb_uri}