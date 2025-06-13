FROM node:lts-slim

ENV NODE_ENV=production
WORKDIR /usr/src/app

RUN apt-get update && \
    apt-get install -y python3 python3-pip && \
    apt-get install -y build-essential cmake libopenblas-dev liblapack-dev libjpeg-dev zlib1g-dev && \
    rm -rf /var/lib/apt/lists/*

COPY requirements.txt .
RUN pip3 install -r requirements.txt --break-system-packages

COPY package.json yarn.lock* ./
RUN yarn install --production --frozen-lockfile --silent && \
    yarn global add @nestjs/cli && \
    yarn add passport @nestjs/passport passport-jwt passport-local && \
    mv node_modules ../

COPY . .
EXPOSE 8080

RUN chown -R node /usr/src/app
USER node

CMD /bin/sh -c "yarn start"