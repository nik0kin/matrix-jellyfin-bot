import { JellyfinItem } from './jellyfin';
import { Settings } from './settings';

export function getSingleSearchNoResultsString(searchTerm: string) {
  return `No results for "${searchTerm}"`;
}

export function getSingleSearchItemString(
  settings: Settings,
  item: JellyfinItem
) {
  const url = getInfoPageUrl(settings, item);
  const year = item.ProductionYear ? `${item.ProductionYear} ` : '';
  const episodeLabel = item.Type === 'Episode' ? ` of ${item.SeriesName}` : '';
  return [
    `View "[${item.Name}](${url} - ${year}${item.Type}${episodeLabel}`,
    `View <a href=${url}>${item.Name}</a> - ${year}${item.Type}${episodeLabel}`,
  ] as const;
}

function getInfoPageUrl(settings: Settings, item: JellyfinItem) {
  return `${settings.jellyfinServer}/web/index.html#!/itemdetails.html?id=${item.Id}`; // do I need serverId query parameter here?
}
