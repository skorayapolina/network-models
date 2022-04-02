import { getIncomingEdges} from './helpers';

export function getEventDuration(durations, eventNumber) {
  if (eventNumber === 0) {
    return 0;
  }
  return duration[eventNumber];
}

export  function getEarliestPossible(graph, ranking, durations) {
  const erlPoss = {};

  Object.keys(ranking).forEach(rang => {
    ranking[rang].forEach(event => {
      if (rang === '0') {
        erlPoss[event] = 0;
      } else  {
        const incomingEdges = getIncomingEdges(graph, event);
        const possibleTimings = incomingEdges.map(incomingEdge => {
          const eventDuration = getEventDuration(durations, graph.getEdgeWeight(incomingEdge.source, event));
          return erlPoss[incomingEdge.source] + eventDuration;
        })
        erlPoss[event] = Math.max(...possibleTimings);
      }
    })
  })

  return erlPoss;
}
