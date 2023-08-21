FROM node:latest AS scooter_dev

VOLUME ["/project"]

RUN apt-get update
RUN npm i -g @nestjs/cli
RUN yarn install

WORKDIR /project

RUN cmode ./project/app/install.sh

EXPOSE 8888