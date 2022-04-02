import {getFinishEvent, getIncomingEdges} from './helpers';
import {getEventDuration} from './earliestPossible';

export function findCriticalPath(graph, erlPoss, durations) {
  const serializedGraph = graph.serialize();
  const path: any[] = [];
  let node = getFinishEvent(serializedGraph);
  path.push(node);

  while (node !== 'P0') {
    const incomingEdges = getIncomingEdges(graph, node);
    const erlPossForPrevNodes = incomingEdges.reduce((acc, incomingEdge) => {
      if (!(incomingEdge.weight === 0
        && erlPoss[incomingEdge.source] < erlPoss[node])
      ) {
        acc.push(incomingEdge.source);
      }
      return acc;
    }, []);

    // find the node from which we come to the current node to get the longest possible path
    let nodeWithMaxErlPoss = '';

    erlPossForPrevNodes.forEach(n => {
      if (erlPoss[n] + getEventDuration(graph.getEdgeWeight(n, node), durations) === erlPoss[node]) {
        nodeWithMaxErlPoss = n;
      }
    })

    node = nodeWithMaxErlPoss;
    path.push(node);
  }

  return [...path].reverse();
}
