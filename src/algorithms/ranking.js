import {getIncomingEdges} from './helpers';

export const rankingEvents = graph => {
  const ranking = {};
  const ranked = [];
  const numberOfNodes = graph.nodes().length;

  graph.nodes().forEach(node => {
    if (getIncomingEdges(graph, node).length === 0) {
      ranking[0] = [node];

      ranked.push(node);
    }
  });

  let index = 1;
  while (ranked.length < numberOfNodes) {
    ranking[index - 1].forEach(node => {
      graph.adjacent(node).forEach(adj => {
        graph.removeEdge(node, adj);
      })
    })

    graph.nodes().forEach(node => {
      if (getIncomingEdges(graph, node).length === 0) {
        if (!ranked.includes(node)) {
          ranking[index] ? ranking[index].push(node) : ranking[index] = [node];
          ranked.push(node);
        }
      }
    })
    index++;
  }

  return ranking;
}

export function getMapToRename(ranking) {
  const mapToRename = {};

  let indexOfEvent = 0;
  Object.keys(ranking).forEach(rang => {
    ranking[rang].forEach(nodeInRang => {
      mapToRename[nodeInRang] = 'P' + indexOfEvent;
      indexOfEvent++;
    })
  });

  return mapToRename;
}
