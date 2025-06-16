FROM node:lts-slim as builder

RUN apt-get update && \
    apt-get install -y \
        python3 \
        python3-pip \
        python3-venv \
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

# Python 가상환경 생성 및 패키지 설치
RUN python3 -m venv /opt/venv
ENV PATH="/opt/venv/bin:$PATH"

COPY requirements.txt .
RUN pip install --upgrade pip setuptools wheel && \
    pip install dlib face_recognition==1.3.0 opencv-python-headless==4.8.1.78 numpy==1.24.3 Pillow==10.0.1

COPY package.json yarn.lock* ./
RUN yarn install --production --frozen-lockfile && \
    yarn global add @nestjs/cli && \
    yarn add passport @nestjs/passport passport-jwt passport-local

FROM node:lts-slim as production

RUN apt-get update && \
    apt-get install -y \
        python3 \
        python3-venv \
        libx11-6 \
        libatlas3-base \
        libgtk-3-0 \
        libboost-python1.74.0 \
        libopenblas0 \
        liblapack3 && \
    rm -rf /var/lib/apt/lists/*

RUN mkdir -p /usr/src/app && chown node:node /usr/src/app

USER node
WORKDIR /usr/src/app

COPY --from=builder --chown=node:node /opt/venv /opt/venv
COPY --from=builder --chown=node:node /usr/src/app/node_modules ./node_modules
COPY --from=builder --chown=node:node /usr/local/share/.config/yarn /usr/local/share/.config/yarn

COPY --chown=node:node . .

ENV PATH="/opt/venv/bin:$PATH"
ENV NODE_ENV=production

EXPOSE 8080

CMD ["yarn", "start"]