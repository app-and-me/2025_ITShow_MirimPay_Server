FROM node:lts-alpine

ENV NODE_ENV=production

RUN apt-get update && apt-get install -y \
    python3 \
    python3-pip \
    python3-dev \
    build-essential \
    cmake \
    libboost-all-dev \
    libopenblas-dev \
    liblapack-dev \
    libx11-dev \
    libgtk-3-dev \
    && apt-get clean \
    && rm -rf /var/lib/apt/lists/*

WORKDIR /usr/src/app

COPY package.json yarn.lock* ./
RUN yarn install --production --frozen-lockfile --silent && \
    yarn global add @nestjs/cli && \
    yarn add passport @nestjs/passport passport-jwt passport-local && \
    mv node_modules ../

COPY requirements.txt .
RUN pip3 install --no-cache-dir -r requirements.txt

COPY . .

EXPOSE 8080

RUN chown -R node /usr/src/app
USER node

CMD ["yarn", "start"]
