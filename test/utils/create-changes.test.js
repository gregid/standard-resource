import createChanges from '../../src/utils/create-changes';

describe('createChanges', () => {
  it('should create the right changes when no path is provided', () => {
    const changes = createChanges({
      books: {
        resources: {
          2: {
            attributes: {
              firstName: 'james',
            },
          },
        },
        lists: {
          favorites: [2],
        },
      },
    });
    expect(changes).toEqual({
      books: {
        resources: {
          2: {
            attributes: {
              firstName: 'james',
            },
          },
        },
        lists: {
          favorites: [2],
        },
      },
    });
  });

  it('should create the right changes when a resourceType is provided', () => {
    const changes = createChanges('books', {
      resources: {
        2: {
          attributes: {
            firstName: 'james',
          },
        },
      },
      lists: {
        favorites: [2],
      },
    });

    expect(changes).toEqual({
      books: {
        resources: {
          2: {
            attributes: {
              firstName: 'james',
            },
          },
        },
        lists: {
          favorites: [2],
        },
      },
    });
  });

  it('should create the right changes when resourceType.resources is provided', () => {
    const changes = createChanges('books.resources', {
      2: {
        attributes: {
          firstName: 'james',
        },
      },
    });

    expect(changes).toEqual({
      books: {
        resources: {
          2: {
            attributes: {
              firstName: 'james',
            },
          },
        },
      },
    });
  });

  it('should create the right changes when resourceType.resources.resourceId is provided', () => {
    const changes = createChanges('books.resources.2', {
      attributes: {
        firstName: 'james',
      },
    });

    expect(changes).toEqual({
      books: {
        resources: {
          2: {
            attributes: {
              firstName: 'james',
            },
          },
        },
      },
    });
  });

  it('should create the right changes when resourceType.lists is provided', () => {
    const changes = createChanges('books.lists', {
      favorites: [2],
    });

    expect(changes).toEqual({
      books: {
        lists: {
          favorites: [2],
        },
      },
    });
  });

  it('should create the right changes when resourceType.lists.listName is provided', () => {
    const changes = createChanges('books.lists.favorites', [2]);

    expect(changes).toEqual({
      books: {
        lists: {
          favorites: [2],
        },
      },
    });
  });
});
