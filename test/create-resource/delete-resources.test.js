import createResource from '../../src/create-resource';
import { warning } from '../../src/utils/warning';
import initialBooksState from '../fixtures/initial-books-state';

describe('resource.deleteResources()', () => {
  it('calling it with no arguments is a noop', () => {
    const resource = createResource('books', initialBooksState);
    const initialState = resource.getState();

    expect(initialState).toEqual({
      resourceType: 'books',
      resources: initialBooksState.resources,
    });

    resource.deleteResources();
    const finalState = resource.getState();
    expect(finalState).toBe(initialState);

    expect(warning).toHaveBeenCalledTimes(0);
  });

  it('calling it with a non-array is a noop', () => {
    const resource = createResource('books', initialBooksState);
    const initialState = resource.getState();

    expect(initialState).toEqual({
      resourceType: 'books',
      resources: initialBooksState.resources,
    });

    resource.deleteResources(true);
    const finalState = resource.getState();
    expect(finalState).toBe(initialState);

    expect(warning).toHaveBeenCalledTimes(0);
  });

  it('calling it with an empty array is a noop', () => {
    const resource = createResource('books', initialBooksState);
    const initialState = resource.getState();

    expect(initialState).toEqual({
      resourceType: 'books',
      resources: initialBooksState.resources,
    });

    resource.deleteResources([]);
    const finalState = resource.getState();
    expect(finalState).toBe(initialState);

    expect(warning).toHaveBeenCalledTimes(0);
  });

  it('calling it with a resource that does not exist is a noop', () => {
    const resource = createResource('books', initialBooksState);
    const initialState = resource.getState();

    expect(initialState).toEqual({
      resourceType: 'books',
      resources: initialBooksState.resources,
    });

    resource.deleteResources([
      {
        resourceType: 'books',
        id: 'abc',
      },
    ]);
    const finalState = resource.getState();
    expect(finalState).toBe(initialState);

    expect(warning).toHaveBeenCalledTimes(0);
  });

  it('calling it with a resource that does exist removes that resource', () => {
    const resource = createResource('books', initialBooksState);
    const initialState = resource.getState();

    expect(initialState).toEqual({
      resourceType: 'books',
      resources: initialBooksState.resources,
    });

    resource.deleteResources([
      {
        resourceType: 'books',
        id: '13',
      },
    ]);

    const finalState = resource.getState();
    expect(finalState).not.toBe(initialState);

    expect(finalState).toEqual({
      resourceType: 'books',
      resources: {
        52: {
          id: '52',
          resourceType: 'books',
          attributes: {
            name: 'The Harsh Cry of the Heron',
            publishYear: 2005,
          },
        },
        102: {
          id: '102',
          resourceType: 'books',
          attributes: {
            name: 'My Name is Red',
            publishYear: 2007,
          },
        },
      },
    });

    expect(warning).toHaveBeenCalledTimes(0);
  });
});
