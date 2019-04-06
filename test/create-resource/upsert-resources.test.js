import createResource from '../../src/create-resource';
import { warning } from '../../src/utils/warning';
import initialBooksState from '../fixtures/initial-books-state';

describe('resource.upsertResources()', () => {
  it('calling it with no arguments is a noop', () => {
    const resource = createResource('books', initialBooksState);
    const initialState = resource.getState();

    expect(initialState).toEqual({
      resourceType: 'books',
      resources: initialBooksState.resources,
    });

    resource.upsertResources();
    const finalState = resource.getState();
    expect(finalState).toBe(initialState);

    expect(warning).toHaveBeenCalledTimes(0);
  });

  it('should create brand new resources from partial data', () => {
    const resource = createResource('books', initialBooksState);
    const initialState = resource.getState();

    expect(initialState).toEqual({
      resourceType: 'books',
      resources: initialBooksState.resources,
    });

    resource.upsertResources([
      {
        // Note the lack of `meta` and `resourceType`
        id: 'abc',
        attributes: {
          name: 'Grass For His Pillow',
        },
      },
    ]);
    const finalState = resource.getState();
    expect(finalState).not.toBe(initialState);
    expect(finalState).toEqual({
      resourceType: 'books',
      resources: {
        ...initialBooksState.resources,
        abc: {
          id: 'abc',
          resourceType: 'books',
          attributes: {
            name: 'Grass For His Pillow',
          },
          meta: {},
        },
      },
    });

    expect(warning).toHaveBeenCalledTimes(0);
  });

  describe('update; mergeResources: true', () => {
    it('should merge existing resources with the new data', () => {
      const resource = createResource('books', initialBooksState);
      const initialState = resource.getState();

      expect(initialState).toEqual({
        resourceType: 'books',
        resources: initialBooksState.resources,
      });

      resource.upsertResources(
        [
          {
            id: '52',
            resourceType: 'books',
            attributes: {
              publishYear: 1900,
            },
          },
        ],
        true
      );

      const finalState = resource.getState();
      expect(finalState).not.toBe(initialState);
      expect(finalState).toEqual({
        resourceType: 'books',
        resources: {
          ...initialBooksState.resources,
          52: {
            id: '52',
            resourceType: 'books',
            attributes: {
              name: 'The Harsh Cry of the Heron',
              publishYear: 1900,
            },
            meta: {},
          },
        },
      });

      expect(warning).toHaveBeenCalledTimes(0);
    });
  });

  describe('update; mergeResources: false', () => {
    it('should merge replace resources with the new data', () => {
      const resource = createResource('books', initialBooksState);
      const initialState = resource.getState();

      expect(initialState).toEqual({
        resourceType: 'books',
        resources: initialBooksState.resources,
      });

      resource.upsertResources(
        [
          {
            id: '52',
            resourceType: 'books',
            attributes: {
              publishYear: 1900,
            },
          },
        ],
        false
      );

      const finalState = resource.getState();
      expect(finalState).not.toBe(initialState);
      expect(finalState).toEqual({
        resourceType: 'books',
        resources: {
          ...initialBooksState.resources,
          52: {
            id: '52',
            resourceType: 'books',
            attributes: {
              publishYear: 1900,
            },
            meta: {},
          },
        },
      });

      expect(warning).toHaveBeenCalledTimes(0);
    });
  });
});
