import { jellyfin, ApiClient, Item } from './jellyfin-types';

export { ApiClient, Item as JellyfinItem };

import nodeFetch from 'node-fetch';
(global as any).fetch = nodeFetch;

// const apiClient = new typedJellyfin.ApiClient(
//   'https://demo.jellyfin.org/stable',
//   'Jellyfin Web',
//   '10.5.0',
//   'Firefox',
//   'TW96aWxsYS81LjAgKFgxMTsgTGludXggeDg2XzY0OyBydjo3NC4wKSBHZWNrby8yMDEwMDEwMSBGaXJlZm94Lzc0LjB8MTU4NDkwMTA5OTY3NQ11'
// );

export function createJellyfinClient(serverAddress: string) {
  const apiClient = new jellyfin.ApiClient(
    serverAddress,
    'matrix-jellyfin-bot',
    'dev-version',
    'Firefox',
    'TW96aWxsYS81LjAgKFgxMTsgTGludXggeDg2XzY0OyBydjo3NC4wKSBHZWNrby8yMDEwMDEwMSBGaXJlZm94Lzc0LjB8MTU4NDkwMTA5OTY3NQ11'
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
