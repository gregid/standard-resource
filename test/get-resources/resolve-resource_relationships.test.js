import resolveResource from '../../src/get-resources/resolve-resource';
import defaultSchema from '../../src/initialization/default-schema';

describe('resolveResource', function() {
  beforeEach(() => {
    this.state = {
      books: {
        schema: defaultSchema,
        resources: {
          1: {
            id: 1,
            resourceType: 'books',
            attributes: {
              name: 'Lord of the Flies',
              publishYear: 1985,
            },
            meta: {
              changedName: 'Lord of da Flies',
            },
            relationships: {
              author: {
                resourceType: 'people',
                data: 'b',
              },
            },
          },
          2: {
            id: 2,
            resourceType: 'books',
            attributes: {
              name: 'Good Book',
              publishYear: 1990,
            },
            relationships: {
              author: {
                resourceType: 'people',
                data: 'c',
              },
            },
          },
        },
      },
      people: {
        schema: defaultSchema,
        resources: {
          b: {
            id: 'b',
            resourceType: 'people',
            attributes: {
              name: 'Pls Ty',
            },
          },
          c: {
            id: 'c',
            resourceType: 'people',
            relationships: {
              firstBook: {
                resourceType: 'books',
                data: 2,
              },
            },
          },
        },
      },
    };
  });

  it('should return the full resource', () => {
    const resource = {
      id: 1,
      resourceType: 'books',
      attributes: {
        name: 'Lord of the Flies',
        publishYear: 1985,
      },
      meta: {
        changedName: 'Lord of da Flies',
      },
      relationships: {
        author: {
          resourceType: 'people',
          data: 'b',
        },
      },
    };

    const resolved = resolveResource({
      state: this.state,
      resource,
      options: {
        relationships: true,
      },
      schema: defaultSchema,
    });

    expect(resolved).toEqual({
      id: 1,
      resourceType: 'books',
      attributes: {
        name: 'Lord of the Flies',
        publishYear: 1985,
      },
      meta: {
        changedName: 'Lord of da Flies',
      },
      computedAttributes: {},
      relationships: {
        author: {
          id: 'b',
          resourceType: 'people',
          computedAttributes: {},
          relationships: {},
          meta: {},
          attributes: {
            name: 'Pls Ty',
          },
        },
      },
    });
  });

  it('should return the full resource', () => {
    const resource = {
      id: 'a',
      resourceType: 'books',
      attributes: {
        name: 'Lord of the Flies',
        publishYear: 1985,
      },
      meta: {
        changedName: 'Lord of da Flies',
      },
      relationships: {
        author: {
          resourceType: 'people',
          data: 'b',
        },
      },
    };

    const resolved = resolveResource({
      state: this.state,
      resource,
      options: {
        relationships: {
          author: true,
        },
      },
      schema: defaultSchema,
    });

    expect(resolved).toEqual({
      id: 'a',
      resourceType: 'books',
      attributes: {
        name: 'Lord of the Flies',
        publishYear: 1985,
      },
      meta: {
        changedName: 'Lord of da Flies',
      },
      computedAttributes: {},
      relationships: {
        author: {
          id: 'b',
          resourceType: 'people',
          computedAttributes: {},
          relationships: {},
          meta: {},
          attributes: {
            name: 'Pls Ty',
          },
        },
      },
    });
  });
});
