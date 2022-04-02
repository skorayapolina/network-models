import { getFinishEvent } from "./helpers";
import { getEventDuration } from "./earliestPossible";

export function getLatestPossible(graph, ranking, erlPoss, durations) {
  const serializedGraph = graph.serialize();
  const finishEvent = getFinishEvent(serializedGraph);
  const ltsPoss = {};

  Object.keys(ranking)
    .reverse()
    .forEach((rang) => {
      ranking[rang].forEach((event) => {
        if (rang === String(Object.keys(ranking).length - 1)) {
          ltsPoss[event] = erlPoss[finishEvent];
        } else {
          const outgoingNodes = graph.adjacent(event);
          const possibleTimings = outgoingNodes.map((outgoingNode) => {
            const eventDuration = getEventDuration(
              graph.getEdgeWeight(event, outgoingNode),
              durations
            );
            return ltsPoss[outgoingNode] - eventDuration;
          });
          ltsPoss[event] = Math.min(...possibleTimings);
        }
      });
    });

  return ltsPoss;
}
