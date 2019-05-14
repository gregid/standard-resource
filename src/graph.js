import { isFunction } from './utils/identification';
import { warning } from './utils/warning';

export default function createGraph() {
  let vertices = {};
  let listeners = [];

  function subscribe(listener) {
    if (!isFunction(listener)) {
      if (process.env.NODE_ENV !== 'production') {
        warning(
          `You passed an invalid listener to store.subscribe.` +
            ` Groupeners must be functions.`,
          'LISTENER_INVALID_TYPE',
          'error'
        );
      }
    } else {
      listeners.push(listener);
    }

    let subscribed = true;

    return function unsubscribe() {
      if (!subscribed) {
        return;
      }

      subscribed = false;

      const index = listeners.indexOf(listener);
      listeners.splice(index, 1);
    };
  }

  function onUpdate() {
    for (let i = 0; i < listeners.length; i++) {
      const listener = listeners[i];
      listener();
    }
  }

  // O(1) operation
  function getVertices() {
    return vertices;
  }

  // O(1) operation
  function getVertex(val) {
    return vertices[val];
  }

  // O(1) operation
  function addVertex(val) {
    if (!vertices[val]) {
      const newVertices = {
        ...vertices,
        [val]: {
          val,
          edges: {},
        },
      };

      vertices = newVertices;
      onUpdate();
    }
  }

  // O(E) operation - edges must be iterated
  // TODO: use back links to speed this up
  function removeVertex(val) {
    if (vertices[val]) {
      const newVertices = {
        ...vertices,
      };

      delete newVertices[val];

      for (let key in newVertices) {
        if (newVertices[key].edges[val]) {
          delete newVertices[key].edges[val];
        }
      }

      vertices = newVertices;
      onUpdate();
    }
  }

  // O(1) operation
  function addEdge(start, end) {
    if (vertices[start] && vertices[end]) {
      if (!vertices[start].edges[end]) {
        const newVertices = {
          ...vertices,
        };

        const oldVertex = newVertices[start] || {};
        const newVertex = {
          ...oldVertex,
          edges: {
            ...oldVertex.edges,
            [end]: {},
          },
        };

        newVertices[start] = newVertex;
        vertices = newVertices;
        onUpdate();
      }
    }
  }

  // O(1) operation
  function removeEdge(start, end) {
    if (vertices[start] && vertices[end]) {
      if (vertices[start].edges[end]) {
        const originalVertex = vertices[start];
        const newVertex = {
          ...originalVertex,
          edges: {
            ...originalVertex.edges,
          },
        };

        delete newVertex.edges[end];

        const newVertices = {
          ...vertices,
          [start]: newVertex,
        };

        vertices = newVertices;

        onUpdate();
      }
    }
  }

  // O(1) operation
  function getEdge(start, end) {
    if (vertices[start] && vertices[start].edges) {
      return vertices[start].edges[end];
    }
  }

  function getNeighbors(val) {
    return vertices[val] ? vertices[val].edges : null;
  }

  return {
    subscribe,
    getVertices,
    getVertex,
    addVertex,
    removeVertex,
    addEdge,
    removeEdge,
    getEdge,
    getNeighbors,
  };
}

// var graph = new Graph();

// graph.addVertex(5);
// graph.addVertex(2);
// graph.addVertex(6);
// graph.addVertex(7);
// graph.addEdge(2, 5);
// graph.addEdge(6, 7);
// graph.addEdge(7, 5);
// console.log(graph.getEdge(2, 5));
// console.log(graph.getEdge(6, 7));
// graph.removeVertex(5);
// console.log(graph.getEdge(2, 5));
// console.log(graph.neighbors(6));
// console.log(graph.neighbors(5));
