(global as any).self = {};

// @ts-ignore
import jellyfinWhole from 'jellyfin-apiclient';

interface Jellyfin {
  ApiClient: new (
    serverAddress: string,
    appName: string,
    appVersion: string,
    deviceName: string,
    deviceId: string
  ) => ApiClient;
  Events: EventsType;
}

export interface ApiClient {
  authenticateUserByName(
    username: string,
    password?: string
  ): Promise<{
    // incomplete type
    User: {
      Name: string;
      ServerId: string;
      Id: string;
      HasPassword: boolean;
      HasConfiguredPassword: boolean;
      HasConfiguredEasyPassword: true;
      EnableAutoLogin: boolean;
      LastLoginDate: string;
      LastActivityDate: string;
      Configuration: any;
      Policy: any;
    };
    AccessToken: string;
  }>;
  setAuthenticationInfo(accessToken: string, userId: string): void;
  getCurrentUser(): any;
  getCurrentUserId(): any;
  getItems(
    userId?: string,
    options?: {
      searchTerm?: string;
      IncludePeople?: boolean;
      IncludeMedia?: boolean;
      IncludeGenres?: boolean;
      IncludeStudios?: boolean;
      IncludeArtists?: boolean;
      IncludeItemTypes?: string; // 'Series'
      Limit?: number;
      Fields?: string; // CSV
      Filters?: string;
      Recursive?: boolean;
      EnableTotalRecordCount?: boolean;
      ImageTypeLimit?: number;
      SortBy?: string;
      SortOrder?: string;
      Ids?: string; // CSV
      MediaTypes?: string; // CSV
    }
  ): Promise<{ Items: Item[]; TotalRecordCount: number; StartIndex: number }>;
  serverInfo(): any;
  ensureWebSocket(): void;
}

export interface Item {
  Name: string;
  ServerId: string;
  Id: string;
  CanDelete: boolean;
  PremiereDate: string;
  OfficialRating: string;
  CommunityRating: number;
  RunTimeTicks: number;
  ProductionYear: number;
  IsFolder: boolean;
  Type: string;
  UserData: any[];
  Status: string;
  AirDays: any[];
  PrimaryImageAspectRatio: 0.6666666666666666;
  ImageTags: any[];
  BackdropImageTags: any;
  LocationType: string;
  EndDate: string;

  // Episode type
  SeriesName?: string;

  // MusicAlbum or Audio type
  AlbumArtist?: string;

  // Audio type
  Album?: string;
}

interface EventsType {
  on: (
    serverNotifications: any,
    type: string,
    callback: (e: any, apiClient: ApiClient, data: any) => void
  ) => void;
  off: (...args: any[]) => void;
  trigger: (...args: any[]) => void;
}

export const jellyfin: Jellyfin = jellyfinWhole;
