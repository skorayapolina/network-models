import {getEventDuration} from './earliestPossible';
import {getFinishEvent} from './helpers';

function generateDataForDijkstra(graph) {
  const serializedGraph = graph.serialize();
  const graphForDijkstra = {};
  const costs = {};
  const parents = {};

  serializedGraph.nodes.forEach(node => {
    graphForDijkstra[node.id] = {};
    costs[node.id] = Infinity;
  })

  serializedGraph.links.forEach(link => {
    graphForDijkstra[link.source][link.target] = (-1)*getEventDuration(link.weight);
  });

  // fill costs and parents
  Object.keys(graphForDijkstra['P0']).forEach(node => {
    costs[node] = graphForDijkstra['P0'][node];
    parents[node] = 'P0';
  })

  parents[`${getFinishEvent(graph.serialize())}`] = null;

  return [graphForDijkstra, costs, parents];
}

export function dijkstraMax(graph) {
  const [graphForDijkstra, costs, parents] = generateDataForDijkstra(graph);
  let processed = [];

  const findLowestCostNode = costs => {
    let lowestCost = Infinity;
    let lowestCostNode = null;

    for (let node in costs) {
      const cost = costs[node];

      if (cost < lowestCost && !processed.includes(node)) {
        lowestCost = cost;
        lowestCostNode = node;
      }
    }

    return lowestCostNode;
  }

  let node = findLowestCostNode(costs);

  while (node) {
    const cost = costs[node];
    const neighbors = graphForDijkstra[node];

    Object.keys(neighbors).forEach(n => {
      const newCost = neighbors[n] + cost;
      if (costs[n] > newCost) {
        costs[n] = newCost;
        parents[n] = node;

        if (processed.includes(n)) {
          processed = processed.filter(it => it !== n);
        }
      }
    })

    processed.push(node);
    node = findLowestCostNode(costs);
  }
  console.log('dijkstra result:');
  console.log('costs', costs);
  console.log('parents', parents);
}
