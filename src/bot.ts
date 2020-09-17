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
  getMultipleSearchResultsString,
} from './message-formatter';

const PROMPT_WORD_DEFAULTS = ['!jellyfin', '!jf'];

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
    if (!PROMPT_WORD_DEFAULTS.includes(prompt)) return;

    // check if command=search
    const [command, limitArg, typeOrderArg] = commandToken.split(':');
    if (command !== 'search') return;

    const searchTerm = rest.join(' ');
    const typesOrder =
      typeOrderArg || settings.resultsTypeOrder || 'Movie,Series,Episode';

    const limit = limitArg ? Number(limitArg) : 1;
    if (isNaN(limit)) {
      // TODO better help message
      return reply('Limit is not a number. The 1st argument shall be a number');
    }

    let items: JellyfinItem[];
    try {
      console.log('searching: ' + searchTerm);
      const response = await searchJellyfin(jellyfinClient, userId, {
        term: searchTerm,
        typesOrder,
        limit,
      });
      items = sortItemsByType(response.Items, typesOrder.split(','));
    } catch (e) {
      console.error(e);
      return;
    }

    if (!items.length) {
      return reply(getSingleSearchNoResultsString(searchTerm));
    }

    if (items.length === 1) {
      return reply(...getSingleSearchItemString(settings, items[0]));
    }

    return reply(
      ...getMultipleSearchResultsString(settings, searchTerm, items)
    );
  });
}
