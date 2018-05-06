import update from '../../src/update';
import defaultSchema from '../../src/utils/default-schema';
import { warning } from '../../src/utils/warning';

describe('update - deep drill', function() {
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
              displayNames: {
                en: {
                  value: 'please',
                  status: {
                    active: true,
                  },
                },
                nl: {
                  value: 'alstublieft',
                  status: {
                    active: false,
                  },
                },
              },
              internalName: 'please',
            },
          },
          5: {
            id: 5,
          },
          10: {
            id: 10,
          },
        },
      },
      groups: {},
    };
  });

  it('should support a deep update of a resource with an existing resource; deep drill path', () => {
    const newState = update({
      state: this.state,
      schemas: this.schemas,
      path: 'resources.books.2.attributes.displayNames.nl.status.active',
      changes: true,
    });

    expect(newState).toEqual({
      resources: {
        books: {
          2: {
            id: 2,
            resourceType: 'books',
            meta: {},
            attributes: {
              displayNames: {
                en: {
                  value: 'please',
                  status: {
                    active: true,
                  },
                },
                nl: {
                  value: 'alstublieft',
                  status: {
                    active: true,
                  },
                },
              },
              internalName: 'please',
            },
          },
          5: {
            id: 5,
          },
          10: {
            id: 10,
          },
        },
      },
      groups: {},
    });
    expect(warning).toHaveBeenCalledTimes(0);
  });
});
