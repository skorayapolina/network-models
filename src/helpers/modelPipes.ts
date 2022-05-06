import {
  addFictitiousWorks,
  addWorks,
  joinEndEvents,
  joinStartEvents,
  step3,
  step4,
  step6,
  step7,
  step8,
} from "algorithms/bakhtin";

const INITIAL_NEW_VERTEX_INDEX = 0;
const INITIAL_FICTION_INDEX = 0;

export interface IPipeParams {
  pred: object;
  graph: any;
  newVIndex: number;
  newFicIndex: number;
}

export function pipe1({ pred, graph, ...rest }: IPipeParams): IPipeParams {
  addWorks(graph, pred);
  addFictitiousWorks(graph, pred);

  return { ...rest, pred, graph };
}

export function pipe2({ graph, newVIndex, ...rest }: IPipeParams): IPipeParams {
  const [newVIndexUpdated] = step3(graph, newVIndex);

  return { ...rest, graph, newVIndex: newVIndexUpdated };
}

export function pipe3({
  graph,
  newVIndex,
  newFicIndex,
  ...rest
}: IPipeParams): IPipeParams {
  const [newVIndexUpdated, newFicIndexUpdated] = step4(
    graph,
    newVIndex,
    newFicIndex
  );

  return {
    ...rest,
    graph,
    newVIndex: newVIndexUpdated,
    newFicIndex: newFicIndexUpdated,
  };
}

export function pipe4({ graph, ...rest }: IPipeParams): IPipeParams {
  step6(graph);

  return { ...rest, graph };
}

export function pipe5({ graph, ...rest }: IPipeParams): IPipeParams {
  step7(graph);

  return { ...rest, graph };
}

export function pipe6({ graph, ...rest }: IPipeParams): IPipeParams {
  step8(graph);

  return { ...rest, graph };
}

export function pipe7({
  graph,
  newVIndex,
  newFicIndex,
  ...rest
}: IPipeParams): IPipeParams {
  const [newVIndexUpdated, newFicIndexUpdated] = joinStartEvents(
    graph,
    newVIndex,
    newFicIndex
  );
  const [newVIndexUpdated2] = joinEndEvents(graph, newVIndexUpdated);

  return {
    ...rest,
    graph,
    newVIndex: newVIndexUpdated2,
    newFicIndex: newFicIndexUpdated,
  };
}

/*
 *  [ immediate pipeline execution ] For tests.
 * */
export function createNetworkModel(pred, graph) {
  const pipe1Params = pipe1({
    pred,
    graph,
    newVIndex: INITIAL_NEW_VERTEX_INDEX,
    newFicIndex: INITIAL_FICTION_INDEX,
  });

  const pipe2Params = pipe2(pipe1Params);
  const pipe3Params = pipe3(pipe2Params);
  const pipe4Params = pipe4(pipe3Params);
  const pipe5Params = pipe5(pipe4Params);
  const pipe6Params = pipe6(pipe5Params);
  const { graph: resultGraph } = pipe7(pipe6Params);

  return resultGraph;
}
