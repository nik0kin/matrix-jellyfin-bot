/* eslint-disable no-console */
import { helpCommand } from './commands/help';
import { searchCommand } from './commands/search';
import { createJellyfinClient } from './jellyfin';
import {
  createMatrixClient,
  sendMessageToAllJoinedRooms,
  sendBotReply,
  getDeviceId,
} from './matrix-bot';
import { Settings } from './settings';

/**
 * Starts the Matrix bot
 */
export async function startBot(userSettings: Settings) {
  const settings: Required<Settings> = {
    storageFile: 'bot-storage.json',
    promptWords: ['!jellyfin', '!jf'],
    autoJoin: false,
    jellyfinUsername: '',
    jellyfinPassword: undefined as any,
    jellyfinApiKey: '',
    jellyfinUserId: '',
    notifications: false,
    resultsTypeOrder: 'Movie,Series,Episode,MusicAlbum,Audio,MusicArtist',
    resultsLimit: 1,
    ...userSettings,
  };

  // Connect to Matrix
  const botClient = createMatrixClient(settings);
  await botClient.start();

  const jellyfinClient = createJellyfinClient(
    settings.jellyfinServer,
    getDeviceId(botClient)
  );
  let userId: string;

  try {
    if (settings.jellyfinUsername) {
      const auth = await jellyfinClient.authenticateUserByName(
        settings.jellyfinUsername,
        settings.jellyfinPassword
      );
      jellyfinClient.setAuthenticationInfo(auth.AccessToken, auth.User.Id);
      userId = auth.User.Id;
    } else if (settings.jellyfinApiKey) {
      jellyfinClient.setAuthenticationInfo(
        settings.jellyfinApiKey,
        settings.jellyfinUserId
      );
      userId = settings.jellyfinUserId;
    } else {
      throw new Error(
        'Must set `jellyfinUsername` or `jellyfinApiKey` in settings'
      );
    }
  } catch (e) {
    console.error('Something went wrong authenticating with Jellyfin', e);
    return;
  }

  if (settings.notifications) {
    // jellyfinClient.ensureWebSocket();

    // onNotification((notification) => {
    //   const message = JSON.stringify(notification);
    //   console.log('notification: ' + message);
    //   sendMessageToAllJoinedRooms(botClient, message);
    // });
    setInterval(() => {
      (jellyfinClient as any).getNotifications(userId)
        .then((notifications: { Notifications: any[], TotalRecordCount: number }) => {
          const message = JSON.stringify(notifications);
          console.log('notification: ' + message);
          if (notifications.Notifications.length > 0) {
            sendMessageToAllJoinedRooms(botClient, message);
          }
        });
    }, 1000 * 60 * 5);
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

    const tokens = (event.content.body as string).split(' ');
    const [prompt, commandToken, ...rest] = tokens;

    // check if prompt word is said
    if (!settings.promptWords.includes(prompt.toLowerCase())) return;

    // check command
    const [command, arg1, arg2] = (commandToken || '').split(':');

    switch (command.toLowerCase()) {
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
