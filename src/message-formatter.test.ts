import { getMultipleSearchResultsString } from './message-formatter';

describe('it', () => {
  test('should work', () => {
    const result = getMultipleSearchResultsString(
      {
        jellyfinServer: 'http://some-server',
      } as any,
      'Cat',
      [
        { Name: 'Top Cat', Id: 'id1', Type: 'Series' } as any,
        { Name: 'Cat Videos Vol. 1', Id: 'id2', Type: 'Movie' } as any,
        { Name: 'Cat Videos Vol. 3', Id: 'id3', Type: 'Movie' } as any,
      ]
    );
    expect(result[0]).toEqual(
      `Showing 3 results for "Cat"
  1. "[Top Cat](http://some-server/web/index.html#!/details?id=id1)" - Series
  2. "[Cat Videos Vol. 1](http://some-server/web/index.html#!/details?id=id2)" - Movie
  3. "[Cat Videos Vol. 3](http://some-server/web/index.html#!/details?id=id3)" - Movie`
    );
  });
});
