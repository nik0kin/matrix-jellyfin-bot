import { ApiClient } from './jellyfin';
import { jellyfin } from './jellyfin-types';

const mockApi: ApiClient = {
  getItems: () =>
    Promise.resolve({
      Items: [
        {
          Id: '101',
          Name: 'Cat Videos Vol. 2',
          Type: 'Movie',
        },
      ],
    }),
  getCurrentUserId: () => 'mock-user-id',
} as any;

let libraryChangedCallback: (e: any, apiClient: ApiClient, data: any) => void;

jellyfin.Events.on = jest.fn(
  (
    a: any,
    type: string,
    c: (e: any, apiClient: ApiClient, data: any) => void
  ) => {
    if (type === 'LibraryChanged') {
      libraryChangedCallback = c;
    }
  }
);

import { onNotification } from './notifications';

// jest.mock('./jellyfin-types');

describe('Notifications', () => {
  test('a library update should cause a message to be sent', (done) => {
    onNotification(mockApi as any, (n) => {
      expect(n).toEqual({
        title: 'New Movie',
        body: 'Cat Videos Vol. 2',
      });
      done();
    });

    libraryChangedCallback(null, mockApi, {
      ItemsAdded: ['101'],
    });
  });
});
