import { JellyfinItem } from './jellyfin';
import { Settings } from './settings';

export function getSingleSearchNoResultsString(searchTerm: string) {
  return `No results for "${searchTerm}"`; // TODO show limit/types if specified
}

export function getJellyfinItemString(
  settings: Required<Settings>,
  item: JellyfinItem
) {
  const year = item.ProductionYear ? `${item.ProductionYear} ` : '';
  const episodeLabel = item.Type === 'Episode' ? ` of ${item.SeriesName}` : '';
  const [link, formattedLink] = getItemLink(settings, item);
  return [
    `"${link}" - ${year}${item.Type}${episodeLabel}`,
    `"${formattedLink}" - ${year}${item.Type}${episodeLabel}`,
  ] as const;
}

export function getSingleSearchItemString(
  settings: Required<Settings>,
  item: JellyfinItem
) {
  const [result, resultFormatted] = getJellyfinItemString(settings, item);
  return [`View ${result}`, `View ${resultFormatted}`] as const;
}

export function getMultipleSearchResultsString(
  settings: Required<Settings>,
  searchTerm: string,
  items: JellyfinItem[]
) {
  const resultsStrings = items.map((item) =>
    getJellyfinItemString(settings, item)
  );
  const toMessage = (resultStrings: string[], html?: boolean) => {
    const lb = html ? '<br>' : '\n';
    return `Showing ${
      items.length
    } results for "${searchTerm}"${lb}${resultStrings
      .map((result, i) => `  ${i + 1}. ${result}`)
      .join(lb)}`;
  };
  return [
    toMessage(resultsStrings.map((r) => r[0])),
    toMessage(
      resultsStrings.map((r) => r[1]),
      true
    ),
  ] as const;
}

function getInfoPageUrl(settings: Required<Settings>, item: JellyfinItem) {
  return `${settings.jellyfinServer}/web/index.html#!/details?id=${item.Id}`; // do I need serverId query parameter here?
}

function getItemLink(settings: Required<Settings>, item: JellyfinItem) {
  const url = getInfoPageUrl(settings, item);
  return [
    `[${item.Name}](${url})`,
    `<a href="${url}">${item.Name}</a>`,
  ] as const;
}
