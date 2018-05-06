import update from '../../src/update';
import defaultSchema from '../../src/utils/default-schema';
import { warning } from '../../src/utils/warning';

describe('update - replace group', function() {
  beforeEach(() => {
    this.schemas = {
      books: defaultSchema,
      authors: defaultSchema,
    };

    this.state = {
      resources: {
        books: {
          2: {
            id: 2,
            attributes: {
              firstName: 'James',
              lastName: 'Please',
            },
          },
          5: {
            id: 5,
          },
          10: {
            id: 10,
          },
        },
        authors: {
          a: { id: 'a' },
          b: { id: 'b' },
        },
      },
      groups: {
        favoriteBooks: [
          {
            resourceType: 'books',
            id: 2,
          },
          {
            resourceType: 'books',
            id: 5,
          },
        ],
        newBooks: [
          {
            resourceType: 'books',
            id: 1,
          },
          {
            resourceType: 'books',
            id: 5,
          },
          {
            resourceType: 'books',
            id: 10,
          },
        ],
        things: [
          {
            id: 10,
            resourceType: 'authors',
          },
        ],
      },
    };
  });

  it('allows you to create a resource by specifying it in a group (object form)', () => {
    const newState = update({
      state: this.state,
      schemas: this.schemas,
      changes: {
        groups: {
          favoriteAuthors: [
            {
              id: 2,
              resourceType: 'authors',
              attributes: {
                firstName: 'wot',
                lastName: 'pls',
              },
              meta: {
                isSelected: false,
              },
            },
          ],
        },
      },
    });

    expect(newState).toEqual({
      resources: {
        books: {
          2: {
            id: 2,
            attributes: {
              firstName: 'James',
              lastName: 'Please',
            },
          },
          5: {
            id: 5,
          },
          10: {
            id: 10,
          },
        },
        authors: {
          a: { id: 'a' },
          b: { id: 'b' },
          2: {
            id: 2,
            resourceType: 'authors',
            attributes: {
              firstName: 'wot',
              lastName: 'pls',
            },
            meta: {
              isSelected: false,
            },
          },
        },
      },
      groups: {
        favoriteBooks: [
          {
            resourceType: 'books',
            id: 2,
          },
          {
            resourceType: 'books',
            id: 5,
          },
        ],
        newBooks: [
          {
            resourceType: 'books',
            id: 1,
          },
          {
            resourceType: 'books',
            id: 5,
          },
          {
            resourceType: 'books',
            id: 10,
          },
        ],
        things: [
          {
            id: 10,
            resourceType: 'authors',
          },
        ],
        favoriteAuthors: [
          {
            id: 2,
            resourceType: 'authors',
          },
        ],
      },
    });

    expect(warning).toHaveBeenCalledTimes(0);
  });
});
