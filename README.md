# matrix-jellyfin-bot

Talk to your media server.

```
Human: !jf search frank
Bot: View "[Lady Frankenstein](http://localhost:8096/web/index.html#!/details?id=d8ca1a7d9ae2a9516c638cefa8968684)" - 1971 Movie
```

## Develop

```
yarn install
yarn dev
```

## Run

### Bootstrap mode

Running as a background process via pm2:

```
# clone this repo and cd inside of it

yarn install

cp bot-config.sample.json bot-config.json
# configure bot-config.json

yarn global add pm2
pm2 start pm2.config.js
```

### As a Node.js package

Programatically with javascript/typescript:

```
yarn add matrix-pinballmap-bot
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
