import {
  ApiClient,
  searchJellyfin,
  JellyfinItem,
  sortItemsByType,
} from '../jellyfin';
import {
  getSingleSearchItemString,
  getSingleSearchNoResultsString,
  getMultipleSearchResultsString,
} from '../message-formatter';
import { Settings } from '../settings';

export async function searchCommand(
  settings: Settings,
  [userId, jellyfinClient]: [string, ApiClient],
  reply: (message: string, formattedMessage?: string) => void,
  limitArg: string,
  typeOrderArg: string,
  rest: string[]
) {
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

  return reply(...getMultipleSearchResultsString(settings, searchTerm, items));
}
