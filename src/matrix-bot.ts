import {
  MatrixClient,
  SimpleFsStorageProvider,
  AutojoinRoomsMixin,
} from 'matrix-bot-sdk';
import { Settings } from './settings';

export function createMatrixClient(settings: Settings) {
  const storage = new SimpleFsStorageProvider(
    settings.storageFile || 'bot-storage.json'
  );
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
