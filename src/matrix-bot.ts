import {
  MatrixClient,
  SimpleFsStorageProvider,
  AutojoinRoomsMixin,
} from 'matrix-bot-sdk';
import { Settings } from './settings';

export function createMatrixClient(settings: Required<Settings>) {
  const storage = new SimpleFsStorageProvider(settings.storageFile);
  const client = new MatrixClient(
    settings.homeserverUrl,
    settings.matrixAccessToken,
    storage
  );
  if (settings.autoJoin) {
    AutojoinRoomsMixin.setupOnClient(client);
  }
  return client;
}

export function sendBotMessage(
  botClient: MatrixClient,
  roomId: string,
  message: string,
  htmlFormattedMessage?: string
) {
  botClient.sendMessage(roomId, {
    msgtype: 'm.notice',
    body: message,
    ...(htmlFormattedMessage
      ? {
          format: 'org.matrix.custom.html',
          formatted_body: htmlFormattedMessage,
        }
      : {}),
  });
}

export function sendBotReply(
  botClient: MatrixClient,
  roomId: string,
  responds: {
    sender: string;
    message: string;
  },
  message: string,
  htmlFormattedMessage?: string
) {
  botClient.sendMessage(roomId, {
    msgtype: 'm.notice',
    body: message,
    responds,
    ...(htmlFormattedMessage
      ? {
          format: 'org.matrix.custom.html',
          formatted_body: htmlFormattedMessage,
        }
      : {}),
  });
}

export function getDeviceId(botClient: MatrixClient) {
  const savedValue = (
    botClient.storageProvider as SimpleFsStorageProvider
  ).readValue('deviceId');
  if (savedValue) return savedValue;

  const newValue = Buffer.from('bot_' + new Date().getTime())
    .toString('base64')
    .replace(/=/g, '1');
  (botClient.storageProvider as SimpleFsStorageProvider).storeValue(
    'deviceId',
    newValue
  );
  return newValue;
}
