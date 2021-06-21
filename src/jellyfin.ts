const pkg = require('../package.json');
import { jellyfin, ApiClient, Item } from './jellyfin-types';

export { ApiClient, Item as JellyfinItem };

import nodeFetch from 'node-fetch';
(global as any).fetch = nodeFetch;

export function createJellyfinClient(serverAddress: string, deviceId: string) {
  const apiClient = new jellyfin.ApiClient(
    serverAddress,
    pkg.name,
    pkg.version,
    'NodeJS',
    deviceId
  );
  return apiClient;
}

export async function searchJellyfin(
  jellyfinClient: ApiClient,
  userId: string,
  search: {
    term: string;
    typesOrder: string; // CSV
    limit: number;
  }
) {
  return await jellyfinClient.getItems(userId, {
    searchTerm: search.term,
    IncludePeople: false,
    IncludeMedia: true,
    IncludeGenres: false,
    IncludeStudios: false,
    IncludeArtists: false,
    IncludeItemTypes: search.typesOrder,
    Limit: search.limit,
    Fields: '',
    Recursive: true,
    EnableTotalRecordCount: false,
    ImageTypeLimit: 1,
  });
}

export function sortItemsByType(items: Item[], typeOrder: string[]) {
  return items.sort((itemA, itemB) => {
    return typeOrder.indexOf(itemA.Type) - typeOrder.indexOf(itemB.Type);
  });
}
