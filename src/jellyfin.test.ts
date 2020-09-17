import { sortItemsByType } from './jellyfin';

describe('sortItemsByType', () => {
  test('should sort items', () => {
    expect(
      sortItemsByType([{ Type: 'Episode' }, { Type: 'Movie' }] as any, [
        'Movie',
        'Episode',
      ])[0].Type
    ).toBe('Movie');
  });
});
