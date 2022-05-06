import React, {
  ChangeEvent,
  RefObject,
  useEffect,
  useRef,
  useState,
} from "react";
import Graph from "graph-data-structure";
import {
  computeModelParams,
  createGraphView,
  createGraphViewNotFinal,
  getChartData,
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
import { VisGraph } from "components/VisGraph/VisGraph";
import { Durations, PredNodes, PredNodesInput, Resources } from "helpers/types";
import { Table } from "components/Table/Table";

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
  const [jobsCount, setJobsCount] = useState(INITIAL_JOBS_COUNT);
  const [durations, setDurations] = useState<Durations>({});
  const [resources, setResources] = useState<Resources>({});
  const [predNodes, setPredNodes] = useState<PredNodes>({});
  const [predNodesInput, setPredNodesInput] = useState<PredNodesInput>({});
  const [visGraphData, setVisGraphData] = useState<any>(null);
  const [changesIndex, setChangesIndex] = useState(0);

  // usecallback?
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

  const onCreateModelClick =
    (buttonRef: RefObject<HTMLButtonElement>) => async () => {
      if (networkRef.current) {
        networkRef.current?.setOptions(graphOptions);
      }

      let params = pipe1({
        graph: Graph(),
        pred: predNodes,
        newVIndex: 0,
        newFicIndex: 0,
      });
      setVisGraphData(
        createGraphViewNotFinal(params.graph, durations, resources)
      );
      console.log("pipe1");

      buttonRef.current!.style.visibility = "visible";
      await wait(buttonRef.current);

      params = pipe2(params);
      setVisGraphData(
        createGraphViewNotFinal(params.graph, durations, resources)
      );
      console.log("pipe2");

      await wait(buttonRef.current);

      params = pipe3(params);
      setVisGraphData(
        createGraphViewNotFinal(params.graph, durations, resources)
      );
      console.log("pipe3");

      await wait(buttonRef.current);

      params = pipe4(params);
      setVisGraphData(
        createGraphViewNotFinal(params.graph, durations, resources)
      );
      console.log("pipe4");

      await wait(buttonRef.current);

      params = pipe5(params);
      setVisGraphData(
        createGraphViewNotFinal(params.graph, durations, resources)
      );
      console.log("pipe5");

      await wait(buttonRef.current);

      params = pipe6(params);
      setVisGraphData(
        createGraphViewNotFinal(params.graph, durations, resources)
      );
      console.log("pipe6");

      await wait(buttonRef.current);
      buttonRef.current!.style.visibility = "hidden";

      params = pipe7(params);
      setVisGraphData(
        createGraphView(
          ...computeModelParams(params.graph, durations),
          durations,
          resources
        )
      );
      setChangesIndex((prevIndex) => prevIndex + 1);
      // delay in order to apply after render
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
  }, [jobsCount]);

  // React Hook useEffect has a missing dependency: 'initState'.
  useEffect(() => {
    initState();
  }, []);

  const tableData = {
    durations: {
      data: durations,
      action: onDurationChange,
    },
    predNodesInput: {
      data: predNodesInput,
      action: onPredNodesChange,
    },
    resources: {
      data: resources,
      action: onResourcesChange,
    },
  };

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
        <Table jobsCount={jobsCount} data={tableData}/>
        <VisGraph
          onCreateModelClick={onCreateModelClick}
          getNetwork={(network) => (networkRef.current = network)}
          graphView={visGraphData}
        />
        {visGraphData && (
          <GanttChart
            key={changesIndex}
            chartData={getChartData(visGraphData)}
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
