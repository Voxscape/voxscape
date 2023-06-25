FROM node:18-bookworm-slim

COPY . /opt/voxscape

RUN set -uex && \
        cd /opt/voxscape/packages/vox.ts && yarn --version && yarn && yarn demo:build
