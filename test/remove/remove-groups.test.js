import remove from '../../src/remove';
import defaultSchema from '../../src/utils/default-schema';
import { warning } from '../../src/utils/warning';

describe('remove - resources', function() {
  beforeEach(() => {
    this.schemas = {
      books: defaultSchema,
      author: defaultSchema,
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

  it('should delete a group that matches, array format', () => {
    const newState = remove({
      state: this.state,
      schemas: this.schemas,
      changes: {
        groups: ['newBooks'],
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
        things: [
          {
            id: 10,
            resourceType: 'authors',
          },
        ],
      },
    });

    expect(warning).toHaveBeenCalledTimes(0);
  });

  it('should delete a group that matches, path syntax', () => {
    const newState = remove({
      state: this.state,
      schemas: this.schemas,
      path: 'groups.newBooks',
      changes: null,
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
        things: [
          {
            id: 10,
            resourceType: 'authors',
          },
        ],
      },
    });

    expect(warning).toHaveBeenCalledTimes(0);
  });

  it('should delete a group that matches, object format, leaving behind non-null groups', () => {
    const newState = remove({
      state: this.state,
      schemas: this.schemas,
      changes: {
        groups: {
          newBooks: null,
          favoriteBooks: [],
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
        things: [
          {
            id: 10,
            resourceType: 'authors',
          },
        ],
      },
    });

    expect(warning).toHaveBeenCalledTimes(0);
  });

  it('should remove resources from a group', () => {
    const newState = remove({
      state: this.state,
      schemas: this.schemas,
      changes: {
        groups: {
          favoriteBooks: [
            {
              resourceType: 'books',
              id: 2,
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
        },
      },
      groups: {
        favoriteBooks: [
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
    });

    expect(warning).toHaveBeenCalledTimes(0);
  });
});
