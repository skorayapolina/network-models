import React, { ChangeEvent, useEffect, useRef, useState } from "react";
import Graph from "graph-data-structure";
import { default as GraphComponent } from "react-graph-vis";
import {
  computeModelParams,
  createGraphView,
  createGraphViewNotFinal,
} from "helpers/helpers";
import { graphOptions } from "helpers/options";
import { GanttChart } from "components/GanttChart/GanttChart";
import "./App.css";
import {
  pipe1,
  pipe2,
  pipe3,
  pipe4,
  pipe5,
  pipe6,
  pipe7,
} from "helpers/modelPipes";

const INITIAL_JOBS_COUNT = 4;

const wait = (button: HTMLElement | null) => {
  return new Promise<void>((resolve) => {
    const listener = () => {
      resolve();
      button?.removeEventListener("click", listener);
    };

    button?.addEventListener("click", listener);
  });
};

function App() {
  const networkRef = useRef<any>(null);
  const buttonRef = useRef<HTMLButtonElement | null>(null);
  const [jobsCount, setJobsCount] = useState(INITIAL_JOBS_COUNT);
  const [nodesArray, setNodesArray] = useState<number[]>([]);
  const [durations, setDurations] = useState<{ [key: string]: number }>({});
  const [resources, setResources] = useState<{ [key: string]: number }>({});
  const [predNodes, setPredNodes] = useState<{ [key: string]: number[] }>({});
  const [predNodesInput, setPredNodesInput] = useState<{
    [key: string]: string;
  }>({});
  const [graphView, setGraphView] = useState<any>(null);
  const [changesIndex, setChangesIndex] = useState(0);

  const initState = () => {
    const initDurations = {};
    const initPredNodes = {};
    const initPredNodesInput = {};
    const initResources = {};

    for (let i = 1; i <= jobsCount; i++) {
      initDurations[i] = 0;
      initPredNodes[i] = [];
      initPredNodesInput[i] = "";
      initResources[i] = 0;
    }

    setDurations(initDurations);
    setPredNodes(initPredNodes);
    setPredNodesInput(initPredNodesInput);
    setResources(initResources);
  };

  const updateWorksCount = () => {
    const initDurations = {};
    const initPredNodes = {};
    const initPredNodesInput = {};
    const initResources = {};

    for (let i = 1; i <= jobsCount; i++) {
      initDurations[i] = durations[i] ?? 0;
      initPredNodes[i] = predNodes[i] ?? [];
      initPredNodesInput[i] = predNodesInput[i] ?? "";
      initResources[i] = resources[i] ?? 0;
    }

    setDurations(initDurations);
    setPredNodes(initPredNodes);
    setPredNodesInput(initPredNodesInput);
    setResources(initResources);
  };

  const onWorksCountChange = (event: ChangeEvent<HTMLInputElement>) => {
    setJobsCount(Number(event.target.value));
  };

  const onDurationChange = (event: ChangeEvent<HTMLInputElement>) => {
    const target = event.target;
    setDurations({ ...durations, [target.name]: Number(target.value) });
  };

  const onResourcesChange = (event: ChangeEvent<HTMLInputElement>) => {
    const target = event.target;
    setResources({ ...resources, [target.name]: Number(target.value) });
  };

  const onPredNodesChange = (event: ChangeEvent<HTMLInputElement>) => {
    const target = event.target;
    const nodes = target.value
      ? target.value.split(",").map((v) => Number(v))
      : [];

    setPredNodes({ ...predNodes, [target.name]: nodes });
    setPredNodesInput({ ...predNodesInput, [target.name]: target.value });
  };

  const onCreateModelClick = async () => {
    const tmpGraph = Graph();
    let params = pipe1({
      graph: tmpGraph,
      pred: predNodes,
      newVIndex: 0,
      newFicIndex: 0,
    });
    setGraphView(createGraphViewNotFinal(params.graph, durations, resources));
    console.log("pipe1");

    buttonRef.current!.style.visibility = "visible";
    await wait(buttonRef.current);

    params = pipe2(params);
    setGraphView(createGraphViewNotFinal(params.graph, durations, resources));
    console.log("pipe2");

    await wait(buttonRef.current);

    params = pipe3(params);
    setGraphView(createGraphViewNotFinal(params.graph, durations, resources));
    console.log("pipe3");

    await wait(buttonRef.current);

    params = pipe4(params);
    setGraphView(createGraphViewNotFinal(params.graph, durations, resources));
    console.log("pipe4");

    await wait(buttonRef.current);

    params = pipe5(params);
    setGraphView(createGraphViewNotFinal(params.graph, durations, resources));
    console.log("pipe5");

    await wait(buttonRef.current);

    params = pipe6(params);
    setGraphView(createGraphViewNotFinal(params.graph, durations, resources));
    console.log("pipe6");

    await wait(buttonRef.current);
    buttonRef.current!.style.visibility = "hidden";

    params = pipe7(params);
    setGraphView(
      createGraphView(
        ...computeModelParams(params.graph, durations),
        durations,
        resources
      )
    );
    setChangesIndex((prevIndex) => prevIndex + 1);
    // delay for apply after render
    setTimeout(() => {
      networkRef.current?.setOptions({
        ...graphOptions,
        layout: {
          hierarchical: false,
        },
      });
    }, 10);
    console.log("pipe7 - final");
  };

  useEffect(() => {
    updateWorksCount();
    setNodesArray(Array.from({ length: jobsCount }, (_, i) => i + 1));
  }, [jobsCount]);

  useEffect(() => {
    initState();
  }, []);

  return (
    <div className="app">
      <h1 className="app-title">Сетевые модели</h1>

      <main className="main">
        <div className="table-controls">
          <div className="input-wrapper-jobs">
            <label>Количество работ:</label>
            <input
              type="number"
              value={jobsCount}
              onChange={onWorksCountChange}
              className="input"
            />
          </div>
          <button className="button button--secondary" onClick={initState}>
            Очистить
          </button>
        </div>

        <div className="table-wrapper">
          <table className="table">
            <thead className="thead">
              <tr className="thead-row">
                <th className="thead-data">Номер работы</th>
                <th className="thead-data">Сроки выполнения</th>
                <th className="thead-data">
                  Каким работам предшествует <br /> (через запятую)
                </th>
                <th className="thead-data">Ресурсы</th>
              </tr>
            </thead>
            <tbody className="tbody">
              {nodesArray.map((node) => (
                <tr key={node} className="tbody-row">
                  <td className="tbody-data data-number">{node}</td>
                  <td className="tbody-data">
                    <input
                      type="text"
                      name={`${node}`}
                      value={durations[node] || ""}
                      onChange={onDurationChange}
                      autoComplete="off"
                      tabIndex={1}
                      className="input input-table"
                    />
                  </td>
                  <td className="tbody-data">
                    <input
                      type="text"
                      name={`${node}`}
                      value={predNodesInput[node]}
                      onChange={onPredNodesChange}
                      autoComplete="off"
                      tabIndex={2}
                      className="input input-table"
                    />
                  </td>
                  <td className="tbody-data">
                    <input
                      type="text"
                      name={`${node}`}
                      value={resources[node] || ""}
                      onChange={onResourcesChange}
                      autoComplete="off"
                      tabIndex={3}
                      className="input input-table"
                    />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="button-wrapper">
          <button
            className="button button--primary"
            onClick={onCreateModelClick}
          >
            Построить модель
          </button>
        </div>

        <div className="graph-wrapper">
          <button
            ref={buttonRef}
            className="button button--primary button-square button-nextStep"
          >
            {"->"}
          </button>
          {graphView && (
            <GraphComponent
              graph={graphView}
              options={graphOptions}
              getNetwork={(network) => (networkRef.current = network)}
            />
          )}
        </div>

        {graphView && (
          <GanttChart
            key={changesIndex}
            chartData={graphView.edges
              .map((edge) => edge.payload)
              .sort((a, b) => {
                return Number(b.from.slice(1)) - Number(a.from.slice(1));
              })
              .sort((a, b) => {
                return a.isOnCriticalPath - b.isOnCriticalPath;
              })}
          />
        )}
      </main>
    </div>
  );
}

// const testResources = {
//   1: 7,
//   2: 7,
//   3: 1,
//   4: 5,
//   5: 9,
//   6: 2,
//   7: 3,
//   8: 8,
//   9: 1,
//   10: 8,
// };
//
// const testDurations = {
//   1: 2,
//   2: 5,
//   3: 3,
//   4: 2,
//   5: 1,
//   6: 4,
//   7: 4,
//   8: 2,
//   9: 2,
//   10: 5,
// };
//
// const testPredNodes = {
//   1: [5, 8],
//   2: [9, 10],
//   3: [],
//   4: [2, 5, 8],
//   5: [3],
//   6: [1, 7],
//   7: [2, 5, 8],
//   8: [9, 10],
//   9: [],
//   10: [3],
// };

export default App;
