import getGroup from '../../src/get-group';
import { warning } from '../../src/utils/warning';
import defaultSchema from '../../src/utils/default-schema';

describe('getGroup', function() {
  beforeEach(() => {
    this.schemas = {
      books: defaultSchema,
      authors: {
        ...defaultSchema,
        idProperty: 'authorId',
      },
    };

    this.state = {
      groups: {
        newBooks: [
          {
            resourceType: 'books',
            id: 1,
          },
          {
            resourceType: 'books',
            id: 2,
          },
        ],
        emptyGroup: [],
      },
      resources: {
        books: {
          1: {
            id: 1,
            resourceType: 'books',
            attributes: {
              name: 'A',
            },
            meta: {
              selected: true,
            },
          },
          2: {
            id: 2,
            resourceType: 'books',
            attributes: {
              name: 'B',
            },
          },
          50: {
            resourceType: 'books',
            id: 50,
            meta: {
              selected: false,
            },
          },
        },
        authors: {
          a: {
            authorId: 'a',
            resourceType: 'authors',
            attributes: {
              name: 'J.K. Rowling',
              contracts: {
                en: {
                  purpose: 'book',
                },
                es: {
                  purpose: 'talk',
                },
              },
            },
          },
        },
      },
    };
  });

  it('should warn when an invalid group name is passed', () => {
    const result = getGroup({
      state: this.state,
      schemas: this.schemas,
      groupName: /a/,
    });

    expect(warning).toHaveBeenCalledTimes(1);
    expect(warning.mock.calls[0][1]).toEqual('GET_LIST_INVALID_LIST_NAME');
    expect(warning.mock.calls[0][2]).toEqual('error');
    expect(result).toEqual([]);
  });

  it('should warn when invalid options are passed, but continue to work', () => {
    const results = getGroup({
      state: this.state,
      schemas: this.schemas,
      groupName: 'newBooks',
      options: true,
    });

    expect(results).toEqual([
      {
        id: 1,
        resourceType: 'books',
        computedAttributes: {},
        meta: {
          selected: true,
        },
        attributes: {
          name: 'A',
        },
      },
      {
        id: 2,
        resourceType: 'books',
        computedAttributes: {},
        meta: {},
        attributes: {
          name: 'B',
        },
      },
    ]);

    expect(warning).toHaveBeenCalledTimes(1);
    expect(warning.mock.calls[0][1]).toEqual('GET_LIST_INVALID_OPTIONS');
    expect(warning.mock.calls[0][2]).toEqual('error');
  });

  it('byId: false; should return an empty array for an empty group', () => {
    const results = getGroup({
      state: this.state,
      schemas: this.schemas,
      groupName: 'emptyGroup',
    });
    expect(warning).toHaveBeenCalledTimes(0);

    expect(results).toEqual([]);
  });

  it('byId: false; should return an empty array for a nonexistent group', () => {
    const results = getGroup({
      state: this.state,
      schemas: this.schemas,
      groupName: 'groupThatDoesntExist',
    });
    expect(warning).toHaveBeenCalledTimes(0);

    expect(results).toEqual([]);
  });

  it('byId: true; should return an empty object for a nonexistent group', () => {
    const results = getGroup({
      state: this.state,
      schemas: this.schemas,
      groupName: 'groupThatDoesntExist',
      options: {
        byId: true,
      },
    });
    expect(warning).toHaveBeenCalledTimes(0);

    expect(results).toEqual({});
  });

  it('byId: false; should return the resources in the group', () => {
    const results = getGroup({
      state: this.state,
      schemas: this.schemas,
      groupName: 'newBooks',
    });
    expect(warning).toHaveBeenCalledTimes(0);

    expect(results).toEqual([
      {
        id: 1,
        resourceType: 'books',
        computedAttributes: {},
        meta: {
          selected: true,
        },
        attributes: {
          name: 'A',
        },
      },
      {
        id: 2,
        resourceType: 'books',
        computedAttributes: {},
        meta: {},
        attributes: {
          name: 'B',
        },
      },
    ]);
  });

  it('byId: true; should return the resources in the group', () => {
    const results = getGroup({
      state: this.state,
      schemas: this.schemas,
      groupName: 'newBooks',
      options: {
        byId: true,
      },
    });
    expect(warning).toHaveBeenCalledTimes(0);

    expect(results).toEqual({
      1: {
        id: 1,
        resourceType: 'books',
        computedAttributes: {},
        meta: {
          selected: true,
        },
        attributes: {
          name: 'A',
        },
      },
      2: {
        id: 2,
        resourceType: 'books',
        computedAttributes: {},
        meta: {},
        attributes: {
          name: 'B',
        },
      },
    });
  });
});
