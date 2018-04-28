import { createSelector } from 'reselect';
import getResources from '../../src/get-resources';
import defaultSchema from '../../src/utils/default-schema';
import { warning } from '../../src/utils/warning';

describe('getResources', function() {
  beforeEach(() => {
    jest.spyOn(console, 'error').mockImplementation(() => {});

    this.schemas = {
      authors: {
        ...defaultSchema,
        idAttribute: 'id',
        computedAttributes: {
          // Regular functions work, but you may want to use selectors
          // for computationally-heavy transforms
          fullName({ attributes }) {
            return `${attributes.firstName} ${attributes.lastName}`;
          },
          // This is a silly example of a selector, but it demonstrates
          // the intended usage.
          reverseName: createSelector(
            ({ attributes }) => ({
              first: attributes.firstName,
              last: attributes.lastName,
            }),
            ({ first, last }) => `${last} ${first}`
          ),
        },
      },
    };

    this.state = {
      authors: {
        lists: {
          newBooks: [1, 2],
        },
        resources: {
          1: {
            id: 1,
            resourceType: 'authors',
            attributes: {
              firstName: 'James',
              lastName: 'Please',
            },
            meta: {
              selected: true,
            },
          },
        },
      },
    };
  });

  it('byId: false; should return the resources specified, with computed values', () => {
    const results = getResources({
      state: this.state,
      schemas: this.schemas,
      resourceType: 'authors',
      filter: [1],
    });
    expect(warning).toHaveBeenCalledTimes(0);

    expect(results).toEqual([
      {
        id: 1,
        resourceType: 'authors',
        computedAttributes: {
          fullName: 'James Please',
          reverseName: 'Please James',
        },
        relationships: {},
        meta: {
          selected: true,
        },
        attributes: {
          firstName: 'James',
          lastName: 'Please',
        },
      },
    ]);
  });
});
