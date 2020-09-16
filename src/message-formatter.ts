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
  return [
    `View "[${item.Name}](${url} - ${year}${item.Type}`,
    `View <a href=${url}>${item.Name}</a> - ${year}${item.Type}`,
  ] as const;
}

function getInfoPageUrl(settings: Settings, item: JellyfinItem) {
  return `${settings.jellyfinServer}/web/index.html#!/itemdetails.html?id=${item.Id}`; // do I need serverId query parameter here?
}
