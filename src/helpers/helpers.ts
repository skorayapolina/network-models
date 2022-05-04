import { IPipeParams, pipe5 } from 'algorithms/bakhtin';
import { getMapToRename, rankingEvents } from 'algorithms/ranking';
import { getGraphCopy } from 'algorithms/helpers';
import { renameNodes } from 'algorithms/renameNodes';
import { getEarliestPossible, getEventDuration } from 'algorithms/earliestPossible';
import { findCriticalPath } from 'algorithms/findCriticalPath';
import { getLatestPossible } from 'algorithms/latestPossible';

export const computeModel = (
  pipeParams: IPipeParams,
  durations
): [graph: any, erlPoss: object, criticalPath: string[], ltsPoss: object] => {
  const {graph: oldGraph} = pipe5(pipeParams);
  const mapToRename = getMapToRename(rankingEvents(getGraphCopy(oldGraph)));

  const graph = renameNodes(oldGraph, mapToRename);
  const ranking = rankingEvents(getGraphCopy(graph));

  const erlPoss = getEarliestPossible(graph, ranking, durations);
  const criticalPath = findCriticalPath(graph, erlPoss, durations);
  const ltsPoss = getLatestPossible(graph, ranking, erlPoss, durations);

  return [graph, erlPoss, criticalPath, ltsPoss];
};

export const createGraphViewNotFinal = (
  graph: any,
  durations,
  resources
) => {
  const graphLinks = graph.serialize().links;
  let ficIndex = 0;
  return {
    nodes: graph.nodes().map((node) => ({
      id: node,
      label: `${node}`,
    })),
    edges: graphLinks.map((link) => {
      const jobNumber = link.weight ? link.weight : `0${ficIndex++}`;
      const eventDuration = getEventDuration(link.weight, durations);
      return {
        from: link.source,
        to: link.target,
        label: `${eventDuration} (${link.weight})`,
        ...(link.weight ? {} : { dashes: true }),
        payload: {
          jobNumber,
          resources: resources[link.weight],
          duration: eventDuration,
          from: link.source,
          to: link.target,
        },
      };
    }),
  };
};

export const createGraphView = (
  graph: any,
  erlPoss: object,
  criticalPath: string[],
  ltsPoss: object,
  durations,
  resources
) => {
  const graphLinks = graph.serialize().links;
  let ficIndex = 0;
  return {
    nodes: graph.nodes().map((node) => ({
      id: node,
      label: `${node}\ne: ${erlPoss[node]}; l: ${ltsPoss[node]}`,
    })),
    edges: graphLinks.map((link) => {
      const jobNumber = link.weight ? link.weight : `0${ficIndex++}`;
      const indexOfLinkSourceInCriticalPath = criticalPath.findIndex(
        (value) => value === link.source
      );
      const isOnCriticalPath =
        indexOfLinkSourceInCriticalPath >= 0 &&
        criticalPath[indexOfLinkSourceInCriticalPath + 1] === link.target;
      const eventDuration = getEventDuration(link.weight, durations);
      return {
        from: link.source,
        to: link.target,
        label: `${eventDuration} (${link.weight})`,
        ...(link.weight ? {} : { dashes: true }),
        ...(isOnCriticalPath ? { color: "#d32000" } : {}),
        payload: {
          jobNumber,
          resources: resources[link.weight],
          isOnCriticalPath,
          start: erlPoss[link.source],
          factStart: erlPoss[link.source],
          end: ltsPoss[link.target],
          duration: eventDuration,
          from: link.source,
          to: link.target,
        },
      };
    }),
  };
};
