FROM node:22-bookworm

ARG USER=user
ARG UID=1000
ARG GID=$UID

RUN groupmod -g $GID -n $USER node \
    && usermod -m -d /home/$USER -l $USER -g $USER node \
    && apt-get update \
    && apt-get install -y --no-install-recommends \
        bash-completion \
        git-flow \
        sudo \
        vim \
    && rm -rf /var/lib/apt/lists/* \
    && echo $USER ALL=\(root\) NOPASSWD:ALL > /etc/sudoers.d/$USER \
    && chmod 0440 /etc/sudoers.d/$USER \
    && mkdir /app \
    && chown $UID:$GID /app

WORKDIR /app

USER $USER

COPY --chown=$UID:$GID package.json package-lock.json ./

RUN npm install

COPY --chown=$UID:$GID . ./

CMD [ "sleep", "infinity" ]
