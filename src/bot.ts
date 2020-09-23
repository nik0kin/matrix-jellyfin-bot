/* eslint-disable no-console */
import { helpCommand } from './commands/help';
import { searchCommand } from './commands/search';
import { createJellyfinClient } from './jellyfin';
import { createMatrixClient, sendBotReply } from './matrix-bot';
import { Settings } from './settings';

/**
 * Starts the Matrix bot
 */
export async function startBot(userSettings: Settings) {
  const settings: Required<Settings> = {
    storageFile: 'bot-storage.json',
    promptWords: ['!jellyfin', '!jf'],
    autoJoin: false,
    resultsTypeOrder: 'Movie,Series,Episode',
    resultsLimit: 1,
    ...userSettings,
  };

  // Connect to Matrix
  const botClient = createMatrixClient(settings);
  await botClient.start();

  const jellyfinClient = createJellyfinClient(settings.jellyfinServer);
  let userId: string;

  try {
    const auth = await jellyfinClient.authenticateUserByName(
      settings.jellyfinUsername,
      settings.jellyfinPassword
    );
    jellyfinClient.setAuthenticationInfo(auth.AccessToken, auth.User.Id);
    userId = auth.User.Id;
  } catch (e) {
    console.error('Something went wrong authenticating with Jellyfin', e);
    return;
  }

  console.log('JellyfinBot online');

  botClient.on('room.message', async function (roomId, event) {
    if (event.sender === (await botClient.getUserId())) return;
    if (!event.content || !event.content.body) return;

    const reply = (message: string, formattedMessage?: string) =>
      sendBotReply(
        botClient,
        roomId,
        {
          sender: event.sender,
          message: event.content.body,
        },
        message,
        formattedMessage
      );

    const tokens = (event.content.body as string).toLowerCase().split(' ');
    const [prompt, commandToken, ...rest] = tokens;

    // check if prompt word is said
    if (!settings.promptWords.includes(prompt)) return;

    // check command
    const [command, arg1, arg2] = commandToken.split(':');

    switch (command) {
      case 'help':
        helpCommand(settings, reply);
        break;
      case 'search':
        searchCommand(
          settings,
          [userId, jellyfinClient],
          reply,
          arg1,
          arg2,
          rest
        );
        break;
      default:
        helpCommand(settings, reply, command);
    }
  });
}
