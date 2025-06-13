FROM node:lts-slim as builder

RUN apt-get update && \
    apt-get install -y \
        python3 \
        python3-pip \
        python-is-python3 \
        cmake \
        build-essential \
        pkg-config \
        libx11-dev \
        libatlas-base-dev \
        libgtk-3-dev \
        libboost-python-dev \
        libopenblas-dev \
        liblapack-dev && \
    rm -rf /var/lib/apt/lists/*

WORKDIR /usr/src/app

COPY requirements.txt .
RUN pip3 install --upgrade pip setuptools wheel --break-system-packages && \
    pip3 install dlib face_recognition==1.3.0 opencv-python-headless==4.8.1.78 numpy==1.24.3 Pillow==10.0.1 --break-system-packages

COPY package.json yarn.lock* ./
RUN yarn install --production --frozen-lockfile && \
    yarn global add @nestjs/cli && \
    yarn add passport @nestjs/passport passport-jwt passport-local

FROM node:lts-slim as production

RUN apt-get update && \
    apt-get install -y \
        python3 \
        python3-pip \
        libx11-6 \
        libatlas3-base \
        libgtk-3-0 \
        libboost-python1.74.0 \
        libopenblas0 \
        liblapack3 && \
    rm -rf /var/lib/apt/lists/*

WORKDIR /usr/src/app

COPY --from=builder /usr/local/lib/python3.*/site-packages /usr/local/lib/python3.11/site-packages
COPY --from=builder /usr/src/app/node_modules ./node_modules
COPY --from=builder /usr/local/share/.config/yarn /usr/local/share/.config/yarn

COPY . .

EXPOSE 8080

ENV NODE_ENV=production
RUN chown -R node /usr/src/app
USER node

CMD ["yarn", "start"]