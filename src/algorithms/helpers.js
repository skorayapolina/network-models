import Graph from "graph-data-structure";

export function groupBy(arr, propsName) {
  return arr.reduce(
    (a, v) => ({
      ...a,
      [v[propsName]]: v[propsName] in a ? [...a[v[propsName]], v] : [v],
    }),
    {}
  );
}

export const isEdgeExist = (graph, source, target) => {
  const adj = graph.adjacent(source);
  return adj.includes(target);
};

export const getGraphCopy = (graph) => {
  return Graph(graph.serialize());
};

export const getIncomingEdges = (graph, target) => {
  return graph.serialize().links.filter((link) => link.target === target);
};

export const getVerticesWithOnlyFictitiousOutgoingEdges = (graph) => {
  const vertices = [];

  graph.nodes().forEach((node) => {
    const adjacentNodes = graph.adjacent(node);
    let numberOfZeroWeightNodes = 0;

    for (let i = 0; i < adjacentNodes.length; i++) {
      if (graph.getEdgeWeight(node, adjacentNodes[i]) === 0) {
        numberOfZeroWeightNodes++;
      }
    }

    if (
      adjacentNodes.length &&
      numberOfZeroWeightNodes === adjacentNodes.length
    ) {
      vertices.push({
        node,
        adjacentNodes: graph.adjacent(node).toString(),
      });
    }
  });

  return vertices;
};

export const getVerticesWithOnlyFictitiousIncomingEdges = (graph) => {
  const vertices = [];

  graph.nodes().forEach((node) => {
    const incomingEdges = getIncomingEdges(graph, node);
    let numberOfZeroWeightNodes = 0;

    for (let i = 0; i < incomingEdges.length; i++) {
      if (incomingEdges[i].weight === 0) {
        numberOfZeroWeightNodes++;
      }
    }

    if (
      incomingEdges.length &&
      numberOfZeroWeightNodes === incomingEdges.length
    ) {
      vertices.push({
        node,
        incomingNodes: incomingEdges.map((edge) => edge.source).toString(),
      });
    }
  });

  return vertices;
};

export const search = (targetGraph, source, target) => {
  let searchQueue = targetGraph.adjacent(source);
  const searched = [];

  while (Boolean(searchQueue.length)) {
    const node = searchQueue.shift();

    if (!searched.includes(node)) {
      if (node === target) {
        return true;
      } else {
        searchQueue = [...searchQueue, ...targetGraph.adjacent(node)];
        searched.push(node);
      }
    }
  }
  return false;
};

export function getFinishEvent(serializedGraph) {
  return `P${serializedGraph.nodes.length - 1}`;
}
