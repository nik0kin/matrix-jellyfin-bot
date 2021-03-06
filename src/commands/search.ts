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
  settings: Required<Settings>,
  [userId, jellyfinClient]: [string, ApiClient],
  reply: (message: string, formattedMessage?: string) => void,
  limitArg: string,
  typeOrderArg: string,
  rest: string[]
) {
  const searchTerm = rest.join(' ');
  const typesOrder = typeOrderArg || settings.resultsTypeOrder;

  const limit = limitArg ? Number(limitArg) : settings.resultsLimit;
  if (isNaN(limit)) {
    return reply(`${limit} is not a number. The 1st argument must be a number`);
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
