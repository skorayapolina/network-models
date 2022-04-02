import Graph from 'graph-data-structure';

export function renameNodes(graph, mapToRename) {
  const newSerializedGraph = graph.serialize();

  newSerializedGraph.nodes.forEach(node => {
      node.id = mapToRename[node.id];
  });

  newSerializedGraph.links.forEach(link => {
    link.source = mapToRename[link.source];
    link.target = mapToRename[link.target];
  });

  return Graph(newSerializedGraph);
}
