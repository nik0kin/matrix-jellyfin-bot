# matrix-jellyfin-bot

Talk to your media server.

## Develop

```
yarn install
yarn dev
```

## Run

### Bootstrap mode

```
# clone repo
yarn install

cp bot-config.sample.json bot-config.json
# configure bot-config.json

yarn global add pm2
pm2 start pm2.config.js
```

### As a Node.js package

```
yarn add matrix-jellyfin-bot
```

```
import { startBot } from 'matrix-jellyfin-bot';

const config = {
  // see bot-config.sample.json
};

startBot(config);
```

## Config

See [settings.ts](./src/settings.ts) for config descriptions

