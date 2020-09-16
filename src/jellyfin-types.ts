(global as any).window = {};
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
  getItems(
    userId?: string,
    options?: {
      searchTerm: string;
      IncludePeople: boolean;
      IncludeMedia: boolean;
      IncludeGenres: boolean;
      IncludeStudios: boolean;
      IncludeArtists: boolean;
      IncludeItemTypes: string; // 'Series'
      Limit: number;
      Fields: string; // CSV
      Recursive: boolean;
      EnableTotalRecordCount: boolean;
      ImageTypeLimit: number;
    }
  ): Promise<{ Items: Item[]; TotalRecordCount: number; StartIndex: number }>;
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

  // episode type
  SeriesName?: string;
}

export const jellyfin: Jellyfin = jellyfinWhole;
