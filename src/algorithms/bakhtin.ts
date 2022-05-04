import {
  getIncomingEdges,
  getVerticesWithOnlyFictitiousIncomingEdges,
  getVerticesWithOnlyFictitiousOutgoingEdges,
  groupBy,
  isEdgeExist,
  search,
} from "./helpers";

/*
 * 1. Добавляем в граф ребра работ
 * */
const addWorks = (graph, pred) => {
  for (let i = 1; i <= Object.keys(pred).length; i++) {
    graph.addEdge("S" + i, "E" + i, i);
  }
};

/*
 * 2. Для каждой вершины добавить ребро,
 * которое начинается в конце текущей вершины и заканчивается в начале следующей за ней
 * */
const addFictitiousWorks = (graph, pred) => {
  console.log("addFictitiousWorks")
  Object.keys(pred).forEach((endVInx) => {
    pred[endVInx].forEach((startVInx) => {
      console.log("addFictitiousWorks", "E" + endVInx, "S" + startVInx);
      graph.addEdge("E" + endVInx, "S" + startVInx, 0);
    });
  });
};

/*
 * 3. Если из пары событий выходят только фиктивные работы и их концы попарно совпадают,
 * то эти события склеваются
 * */
const step3 = (graph, newVIndex) => {
  const equalFictitiousOutgoingNodes = groupBy(
    getVerticesWithOnlyFictitiousOutgoingEdges(graph),
    "adjacentNodes"
  );

  for (let key in equalFictitiousOutgoingNodes) {
    const targetNodes = equalFictitiousOutgoingNodes[key];

    if (targetNodes.length > 1) {
      for (let i = 0; i < targetNodes.length; i++) {
        const links = getIncomingEdges(graph, targetNodes[i].node);

        for (let j = 0; j < links.length; j++) {
          graph.addEdge(links[j].source, "N" + newVIndex, links[j].weight);
        }

        graph.removeNode(targetNodes[i].node);
      }

      key.split(",").forEach((k) => {
        graph.addEdge("N" + newVIndex, k, 0);
      });
      newVIndex++;
    }
  }

  return [newVIndex];
};

/*
 * 4. Если в пару событий выходят только фиктивные работы и их начала попарно совпадают,
 * то эти события склеваются
 * */
const step4 = (graph, newVIndex, newFicIndex) => {
  const equalFictitiousIncomingNodes = groupBy(
    getVerticesWithOnlyFictitiousIncomingEdges(graph),
    "incomingNodes"
  );

  for (let key in equalFictitiousIncomingNodes) {
    const targetNodes = equalFictitiousIncomingNodes[key];

    if (targetNodes.length > 1) {
      key.split(",").forEach((k) => {
        graph.addEdge(k, "N" + newVIndex, 0);
      });

      equalFictitiousIncomingNodes[key].forEach((node) => {
        graph.adjacent(node.node).forEach((adj) => {
          if (!isEdgeExist(graph, "N" + newVIndex, adj)) {
            graph.addEdge(
              "N" + newVIndex,
              adj,
              graph.getEdgeWeight(node.node, adj)
            );
          } else {
            graph.addEdge(
              "N" + newVIndex,
              "F" + newFicIndex,
              graph.getEdgeWeight(node.node, adj)
            );
            graph.addEdge("F" + newFicIndex, adj, 0);
            newFicIndex++;
          }
        });

        graph.removeNode(node.node);
      });
      newVIndex++;
    }
  }

  return [newVIndex, newFicIndex];
};

/*
 * 6. Если из начала фиктивной работы в её конец существует другой путь,
 * то эта работа убирается
 * */
const step6 = (graph) => {
  graph.nodes().forEach((node) => {
    const adjNodes = graph.adjacent(node);
    if (adjNodes.length === 1 && graph.getEdgeWeight(node, adjNodes[0]) === 0) {
      graph.removeEdge(node, adjNodes[0]);

      if (search(graph, node, adjNodes[0])) {
        graph.removeEdge(node, adjNodes[0]);
      } else {
        graph.addEdge(node, adjNodes[0], 0);
      }
    }
  });
};

/*
 * 7. Если из события выходит только одна работа и она фиктивная,
 * то её начало и конец склеиваются
 * */
const step7 = (graph) => {
  graph.nodes().forEach((node) => {
    if (node.charAt(0) !== "F") {
      const adjNode = graph.adjacent(node)[0];

      if (
        graph.adjacent(node).length === 1 &&
        graph.getEdgeWeight(node, adjNode) === 0
      ) {
        const incomingEdges = getIncomingEdges(graph, node);

        // если хоть одно такое ребро уже существует, то не склеивать
        if (
          incomingEdges.some((incomingEdge) =>
            isEdgeExist(graph, incomingEdge.source, adjNode)
          )
        ) {
          return;
        }

        incomingEdges.forEach((incomingEdge) => {
          graph.addEdge(incomingEdge.source, adjNode, incomingEdge.weight);
        });

        graph.removeNode(node);
      }
    }
  });
};

/*
 * 8. Если в событие входит только одна работа и она фиктивная,
 * то её начало и конец склеиваются
 * */
const step8 = (graph) => {
  graph.nodes().forEach((node) => {
    const incomingEdges = getIncomingEdges(graph, node);

    if (incomingEdges[0]?.target.charAt(0) !== "F") {
      if (incomingEdges.length === 1 && incomingEdges[0].weight === 0) {
        for (
          let i = 0;
          i < graph.adjacent(incomingEdges[0].target).length;
          i++
        ) {
          graph.addEdge(
            incomingEdges[0].source,
            graph.adjacent(incomingEdges[0].target)[i],
            graph.getEdgeWeight(
              node,
              graph.adjacent(incomingEdges[0].target)[i]
            )
          );
        }

        graph.removeNode(incomingEdges[0].target);
      }
    }
  });
};

const joinStartEvents = (graph, newVIndex, newFicIndex) => {
  const startEdges: Array<{ source: string; target: string[] }> = [];
  graph.nodes().forEach((node) => {
    const pred = getIncomingEdges(graph, node);

    if (pred.length === 0) {
      startEdges.push({
        source: node,
        target: graph.adjacent(node),
      });
    }
  });

  const groupedByTargetStartNodes = groupBy(startEdges, "target");

  for (let key in groupedByTargetStartNodes) {
    const group = groupedByTargetStartNodes[key];

    if (group.length === 1) {
      graph.adjacent(group[0].source).forEach((adj) => {
        graph.addEdge(
          "N" + newVIndex,
          adj,
          graph.getEdgeWeight(group[0].source, adj)
        );
      });

      graph.removeNode(group[0].source);
    } else {
      graph.adjacent(group[0].source).forEach((adj) => {
        graph.addEdge(
          "N" + newVIndex,
          adj,
          graph.getEdgeWeight(group[0].source, adj)
        );
      });

      graph.removeNode(group[0].source);

      for (let i = 1; i < group.length; i++) {
        graph.adjacent(group[i].source).forEach((adj) => {
          graph.addEdge("F" + newFicIndex, adj, 0);
          graph.addEdge(
            "N" + newVIndex,
            "F" + newFicIndex,
            graph.getEdgeWeight(group[i].source, adj)
          );

          newFicIndex++;
          graph.removeNode(group[i].source);
        });
      }
    }
  }

  newVIndex++;

  return [newVIndex, newFicIndex];
};

const joinEndEvents = (graph, newVIndex) => {
  const endNodes: any[] = [];
  graph.nodes().forEach((node) => {
    if (graph.adjacent(node).length === 0) {
      endNodes.push(node);
    }
  });

  const finishNode = "N" + newVIndex;
  endNodes.forEach((endNode) => {
    const incoming = getIncomingEdges(graph, endNode);

    incoming.forEach((incomingEdge) => {
      if (!isEdgeExist(graph, incomingEdge.source, finishNode)) {
        graph.addEdge(incomingEdge.source, finishNode, incomingEdge.weight);
      } else {
        newVIndex++;
        graph.addEdge(
          incomingEdge.source,
          "N" + newVIndex,
          incomingEdge.weight
        );
        graph.addEdge("N" + newVIndex, finishNode, 0);
      }
    });

    graph.removeNode(endNode);
  });
  newVIndex++;

  return [ newVIndex ];
};

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
  step7(graph);
  step8(graph);

  return { ...rest, graph };
}

export function pipe5({ graph, newVIndex, newFicIndex, ...rest }: IPipeParams): IPipeParams {
  const [newVIndexUpdated, newFicIndexUpdated] = joinStartEvents(graph, newVIndex, newFicIndex);
  const [newVIndexUpdated2] = joinEndEvents(graph, newVIndexUpdated);
  // console.log(graph.serialize());

  return { ...rest, graph, newVIndex: newVIndexUpdated2, newFicIndex: newFicIndexUpdated };
}

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

  const {graph: resultGraph} = pipe5(pipe4Params);

  return resultGraph;
}
