/* eslint-disable no-console */
import {
  createJellyfinClient,
  searchJellyfin,
  JellyfinItem,
  sortItemsByType,
} from './jellyfin';
import { createMatrixClient, sendBotReply } from './matrix-bot';
import { Settings } from './settings';
import {
  getSingleSearchItemString,
  getSingleSearchNoResultsString,
} from './message-formatter';

const EXEC_WORD = ['!jellyfin', '!jf'];

/**
 * Starts the Matrix bot
 */
export async function startBot(settings: Settings) {
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

    const tokens = (event.content.body as string).toLowerCase().split(' ');
    const [exec, command, ...rest] = tokens;

    // check if exec word is said
    if (!EXEC_WORD.includes(exec)) return;

    // check if command=search
    if (command !== 'search') return;

    const searchTerm = rest.join(' ');
    const typesOrder = settings.resultsTypeOrder || 'Movie,Series,Episode';
    console.log('searching: ' + searchTerm);

    let item: JellyfinItem;
    try {
      const response = await searchJellyfin(jellyfinClient, userId, {
        term: searchTerm,
        typesOrder,
        limit: settings.resultsLimit || 1,
      });
      item = sortItemsByType(response.Items, typesOrder.split(','))[0];
    } catch (e) {
      console.error(e);
      return;
    }

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

    if (!item) {
      return reply(getSingleSearchNoResultsString(searchTerm));
    }

    reply(...getSingleSearchItemString(settings, item));
  });
}
