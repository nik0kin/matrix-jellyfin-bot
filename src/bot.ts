/* eslint-disable no-console */
import { Settings } from './settings';
import { createMatrixClient } from './matrix-bot';

/**
 * Starts the Matrix bot
 */
export async function startBot(settings: Settings) {
  // Connect to Matrix
  const botClient = createMatrixClient(settings);
  await botClient.start();

  console.log('JellyfinBot online');
}
