export interface Settings {
  //// SETUP ////

  /**
   * Matrix Homeserver
   *  Eg. "https://matrix-federation.matrix.org"
   */
  homeserverUrl: string;
  /**
   * Access Token of the bot account
   *   See https://t2bot.io/docs/access_tokens/ for a simple way to generate
   */
  matrixAccessToken: string;
  /**
   * Jellfin server root
   *  Eg. "https://jellyfin" or "http://your-server/path/to/jellyfin"
   */
  jellyfinServer: string;
  /**
   * Jellfin login username
   */
  jellyfinUsername: string;
  /**
   * Jellfin login password
   */
  jellyfinPassword: string;
  /**
   * File used as temporary storage by the bot
   *   Defaults to `bot-storage.json`
   */
  storageFile?: string;

  //// OPERATIONS ////

  /**
   * Words to prompt the bot to respond.
   *   Defaults to `'!jellyfin', '!jf'`
   */
  promptWords?: string[];

  /**
   * Should the bot auto accept invites to rooms?
   *    (Probably not if you want your Jellyfin server private)
   *   Defaults to `false`
   */
  autoJoin?: boolean;

  //// SEARCH DEFAULTS ////

  /**
   * Order to show the result (TODO better description)
   *   Defaults to `Movie,Series,Episode`
   */
  resultsTypeOrder?: string;

  /**
   * Number of results
   *   Defaults to `1`
   */
  resultsLimit?: number;
}
