import React, { ChangeEvent, useEffect, useState } from "react";
import "./App.css";
import { createNetworkModel } from "algorithms/bakhtin";
import { getMapToRename, rankingEvents } from "algorithms/ranking";
import { getGraphCopy } from "algorithms/helpers";
import { renameNodes } from "algorithms/renameNodes";
import {
  getEarliestPossible,
  getEventDuration,
} from "algorithms/earliestPossible";
import { findCriticalPath } from "algorithms/findCriticalPath";
import { getLatestPossible } from "algorithms/latestPossible";

const computeModel = (
  predNodes,
  durations
): [graph: any, erlPoss: object, criticalPath: string[], ltsPoss: object] => {
  const oldGraph = createNetworkModel(predNodes);
  const mapToRename = getMapToRename(rankingEvents(getGraphCopy(oldGraph)));

  const graph = renameNodes(oldGraph, mapToRename);
  const ranking = rankingEvents(getGraphCopy(graph));

  const erlPoss = getEarliestPossible(graph, ranking, durations);
  const criticalPath = findCriticalPath(graph, erlPoss, durations);
  const ltsPoss = getLatestPossible(graph, ranking, erlPoss, durations);

  return [graph, erlPoss, criticalPath, ltsPoss];
};

const createGraphView = (
  graph: any,
  erlPoss: object,
  criticalPath: string[],
  ltsPoss: object,
  durations
) => {
  const graphLinks = graph.serialize().links;
  return {
    nodes: graph.nodes().map((node) => ({
      id: node,
      label: `${node} erl: ${erlPoss[node]};`,
      title: `erlPoss: ${erlPoss[node]}; ltsPoss: ${ltsPoss[node]}`,
    })),
    edges: graphLinks.map((link) => {
      const indexOfLinkSourceInCriticalPath = criticalPath.findIndex(
        (value) => value === link.source
      );
      return {
        from: link.source,
        to: link.target,
        label: `${getEventDuration(link.weight, durations)} (${link.weight})`,
        ...(link.weight ? {} : { dashes: true }),
        ...(indexOfLinkSourceInCriticalPath >= 0 &&
        criticalPath[indexOfLinkSourceInCriticalPath + 1] === link.target
          ? { color: "rgb(197,13,255)" }
          : {}),
      };
    }),
  };
};

function App() {
  const [worksCount, setWorksCount] = useState(10);
  const [nodesArray, setNodesArray] = useState<number[]>([]);
  const [durations, setDurations] = useState<{ [key: string]: number }>({});
  const [predNodes, setPredNodes] = useState<{ [key: string]: number[] }>({});
  const [predNodesInput, setPredNodesInput] = useState<{
    [key: string]: string;
  }>({});

  const onWorksCountChange = (event: ChangeEvent<HTMLInputElement>) => {
    setWorksCount(Number(event.target.value));
  };

  const onDurationChange = (event: ChangeEvent<HTMLInputElement>) => {
    const target = event.target;
    setDurations({ ...durations, [target.name]: Number(target.value) });
  };

  const onPredNodesChange = (event: ChangeEvent<HTMLInputElement>) => {
    const target = event.target;
    const nodes = target.value
      ? target.value.split(",").map((v) => Number(v))
      : [];

    setPredNodes({ ...predNodes, [target.name]: nodes });
    setPredNodesInput({ ...predNodesInput, [target.name]: target.value });
  };

  const onCreateModelClick = () => {
    console.log(createGraphView(...computeModel(testPredNodes, testDurations), testDurations));
  };

  useEffect(() => {
    const initDurations = {};
    const initPredNodes = {};
    const initPredNodesInput = {};

    for (let i = 1; i <= worksCount; i++) {
      initDurations[i] = 0;
      initPredNodes[i] = [];
      initPredNodesInput[i] = "";
    }

    setDurations(initDurations);
    setPredNodes(initPredNodes);
    setPredNodesInput(initPredNodesInput);
    setNodesArray(Array.from({ length: worksCount }, (_, i) => i + 1));
  }, [worksCount]);

  return (
    <div className="App">
      <header className="App-header">Сетевые модели</header>

      <main>
        <div>
          <span>Количество работ:</span>
          <input
            type="number"
            value={worksCount}
            onChange={onWorksCountChange}
          />
        </div>

        <table>
          <thead>
            <tr>
              <th>Номер работы</th>
              <th>Сроки выполнения</th>
              <th>
                Каким работам предшествует <br /> (через запятую)
              </th>
            </tr>
          </thead>
          <tbody>
            {nodesArray.map((node) => (
              <tr key={node}>
                <td>{node}</td>
                <td>
                  <input
                    type="text"
                    name={`${node}`}
                    value={durations[node] || ""}
                    onChange={onDurationChange}
                    autoComplete="off"
                  />
                </td>
                <td>
                  <input
                    type="text"
                    name={`${node}`}
                    value={predNodesInput[node]}
                    onChange={onPredNodesChange}
                    autoComplete="off"
                  />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        <button onClick={onCreateModelClick}>Построить модель</button>
      </main>
    </div>
  );
}

const testDurations = {
  1: 2,
  2: 5,
  3: 3,
  4: 2,
  5: 1,
  6: 4,
  7: 4,
  8: 2,
  9: 2,
  10: 5,
};

const testPredNodes = {
  1: [5, 8],
  2: [9, 10],
  3: [],
  4: [2, 5, 8],
  5: [3],
  6: [1, 7],
  7: [2, 5, 8],
  8: [9, 10],
  9: [],
  10: [3],
};

export default App;
