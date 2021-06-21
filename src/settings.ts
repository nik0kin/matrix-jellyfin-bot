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
   * Jellyfin server root
   *  Eg. "https://jellyfin" or "http://your-server/path/to/jellyfin"
   */
  jellyfinServer: string;
  /**
   * Jellyfin login username
   *   username/password or apiKey is required!
   */
  jellyfinUsername?: string;
  /**
   * Jellyfin login password
   */
  jellyfinPassword?: string | undefined;
  /**
   * Jellyfin Api Key can be used instead of a username/password to authenticate
   */
  jellyfinApiKey?: string;
  /**
   * Jellyfin UserId to be passed with ApiKey-authed requests
   *   Dev Note: I'm not sure if there's a way to skip requiring this with ApiKeys
   */
  jellyfinUserId?: string;
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
   * Search results are grouped by type. Prioritize the order
   *   Defaults to `Movie,Series,Episode`
   */
  resultsTypeOrder?: string;

  /**
   * Number of results
   *   Defaults to `1`
   */
  resultsLimit?: number;
}
