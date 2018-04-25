import resolveResource from '../../src/get-resources/resolve-resource';

describe('resolveResource', function() {
  beforeEach(() => {
    this.state = {
      books: {
        resources: {
          a: {
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
          },
        },
      },
      people: {
        resources: {
          b: {
            id: 'b',
            resourceType: 'people',
            attributes: {
              name: 'Pls Ty',
            },
          },
        },
      },
    };
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

    const resolved = resolveResource(this.state, resource, {
      relationships: true,
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
