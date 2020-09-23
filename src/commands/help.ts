import { Settings } from '../settings';

export async function helpCommand(
  settings: Required<Settings>,
  reply: (message: string, formattedMessage?: string) => void,
  invalidCommand?: string
) {
  const message = `${
    invalidCommand
      ? `Unrecognized command: ${invalidCommand}`
      : 'Search a jellyfin media server!'
  }

  Usage:
${settings.promptWords.map((word) => `    - \`${word} [COMMAND]\``).join('\n')}
    - \`${settings.promptWords[0]} [COMMAND]:[ARG1]:[ARG2]\`

  Commands:
   - \`help\`         Display this help message
   - \`search\`       Search for content
      - Arg1  resultsLimit (default: ${settings.resultsLimit})
      - Arg2  resultsTypeOrder (default: "${
        settings.resultsTypeOrder
      }") - filter results by media type, and return results in a given order
      - Examples
        1. \`${settings.promptWords[0]} search Cat Videos\`
        2. \`${settings.promptWords[0]} search:5 Dogs\`
        3. \`${settings.promptWords[0]} search:20:Series Tiger\`
`;

  reply(message);
}
