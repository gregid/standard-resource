import createGraph from '../../src/graph';
import { warning } from '../../src/utils/warning';

describe('Graph', () => {
  it('returns an object with the right shape', () => {
    const graph = createGraph();

    expect(typeof graph.addVertex).toEqual('function');
  });

  describe('graph.getVertices()', () => {
    it('returns the state', () => {
      const graph = createGraph();
      const vertices = graph.getVertices();

      expect(vertices).toEqual({});
      expect(warning).toHaveBeenCalledTimes(0);
    });
  });

  describe('graph.addVertex() ', () => {
    it('serves to add new vertices to the graph', () => {
      const graph = createGraph();

      const vertices = graph.getVertices();
      expect(vertices).toEqual({});

      graph.addVertex(2);
      const newVertices = graph.getVertices();
      expect(newVertices).toEqual({
        2: {
          val: 2,
          edges: {},
        },
      });
      expect(vertices).not.toBe(newVertices);

      graph.addVertex(3);
      const nextVertices = graph.getVertices();
      expect(nextVertices).toEqual({
        2: {
          val: 2,
          edges: {},
        },
        3: {
          val: 3,
          edges: {},
        },
      });

      expect(nextVertices).not.toBe(newVertices);
    });
  });

  describe('graph.getVertex()', () => {
    it('returns undefined for nonexistent vertices', () => {
      const graph = createGraph();
      const vertex = graph.getVertex(2);

      expect(vertex).toBeUndefined();
    });

    it('returns an existing vertex', () => {
      const graph = createGraph();

      graph.addVertex(2);
      const vertex = graph.getVertex(2);

      expect(vertex).toEqual({
        val: 2,
        edges: {},
      });
    });
  });

  describe('graph.removeVertex()', () => {
    it('does nothing if the vertex does not exist', () => {
      const graph = createGraph();
      graph.removeVertex(2);
      expect(warning).toHaveBeenCalledTimes(0);
    });

    it('deletes an existing vertex', () => {
      const graph = createGraph();

      const vertices = graph.getVertices();
      expect(vertices).toEqual({});

      graph.addVertex(2);
      const newVertices = graph.getVertices();
      expect(newVertices).toEqual({
        2: {
          val: 2,
          edges: {},
        },
      });
      expect(vertices).not.toBe(newVertices);

      graph.removeVertex(2);
      const nextVertices = graph.getVertices(2);
      expect(nextVertices).toEqual({});
      expect(nextVertices).not.toBe(newVertices);
    });
  });

  describe('graph.addEdge()', () => {
    it('serves to add an edge', () => {
      const graph = createGraph();
      graph.addVertex(2);
      graph.addVertex(3);

      const vertices = graph.getVertices();
      expect(vertices).toEqual({
        2: {
          val: 2,
          edges: {},
        },
        3: {
          val: 3,
          edges: {},
        },
      });

      const originalVertex2 = graph.getVertex(2);

      graph.addEdge(2, 3);

      const newVertices = graph.getVertices();

      expect(newVertices).toEqual({
        2: {
          val: 2,
          edges: {
            3: {},
          },
        },
        3: {
          val: 3,
          edges: {},
        },
      });

      const newVertex2 = graph.getVertex(2);
      expect(newVertex2).not.toBe(originalVertex2);
    });
  });

  describe('graph.removeEdge()', () => {
    it('takes the edge off', () => {
      const graph = createGraph();
      graph.addVertex(2);
      graph.addVertex(3);
      graph.addEdge(2, 3);

      const vertices = graph.getVertices();

      expect(vertices).toEqual({
        2: {
          val: 2,
          edges: {
            3: {},
          },
        },
        3: {
          val: 3,
          edges: {},
        },
      });

      graph.removeEdge(2, 3);
      const newVertices = graph.getVertices();
      expect(newVertices).toEqual({
        2: {
          val: 2,
          edges: {},
        },
        3: {
          val: 3,
          edges: {},
        },
      });

      expect(vertices[2]).not.toBe(newVertices[2]);
      expect(vertices[2].edges).not.toBe(newVertices[2].edges);
    });
  });

  describe('graph.removeEdge()', () => {
    it('returns undefined when the edge does not exist', () => {
      const graph = createGraph();
      expect(graph.getEdge(2, 3)).toBeUndefined();
    });

    it('returns the edge when it exists', () => {
      const graph = createGraph();
      graph.addVertex(2);
      graph.addVertex(3);
      graph.addEdge(2, 3);
      expect(graph.getEdge(2, 3)).toEqual({});
    });
  });
});
