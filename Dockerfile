FROM buildpack-deps:xenial

RUN locale-gen en_US.UTF-8
ENV LANG=en_US.UTF-8

# Install Node.js
WORKDIR /tmp
RUN wget https://nodejs.org/dist/v7.3.0/node-v7.3.0-linux-x64.tar.xz && \
    tar -xJf node-v7.3.0-linux-x64.tar.xz -C /usr/local --strip-components=1
RUN rm -r /tmp/node-v7.3.0-linux-x64.tar.xz

# Install Ruby & foreman
RUN apt-get update
RUN apt-get install -y ruby-full
RUN gem install foreman

ARG NPM_TOKEN
ENV NPM_TOKEN=$NPM_TOKEN

ADD . /app
WORKDIR /app

# Install app dependencies
RUN npm install
RUN npm install -g bower
RUN bower install --allow-root

CMD foreman start -f Procfile.dev
