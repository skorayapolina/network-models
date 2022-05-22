import React, { ChangeEvent, useEffect, useRef, useState } from "react";
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
  IPipeParams,
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

function App() {
  const networkRef = useRef<any>(null);
  const [jobsCount, setJobsCount] = useState(INITIAL_JOBS_COUNT);
  const [durations, setDurations] = useState<Durations>({});
  const [resources, setResources] = useState<Resources>({});
  const [predNodes, setPredNodes] = useState<PredNodes>({});
  const [predNodesInput, setPredNodesInput] = useState<PredNodesInput>({});
  const [visGraphData, setVisGraphData] = useState<any>(null);
  const [changesIndex, setChangesIndex] = useState(0);
  const [modelSteps, setModelSteps] = useState<IPipeParams[]>([]);
  const [modelStepIndex, setModelStepIndex] = useState(0);

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

  const onCreateModelClick = async () => {
    if (networkRef.current) {
      networkRef.current?.setOptions(graphOptions);
    }
    setModelStepIndex(0);
    const initialParams = {
      graph: Graph(),
      pred: predNodes,
      newVIndex: 0,
      newFicIndex: 0,
    };
    const fns = [pipe1, pipe2, pipe3, pipe4, pipe5, pipe6, pipe7];

    const modelSteps = fns.reduce((acc, fn, index) => {
      const params = index === 0 ? initialParams : acc[index - 1];
      const result = fn({ ...params, graph: Graph(params.graph.serialize()) });
      return [...acc, result];
    }, [] as IPipeParams[]);
    setModelSteps(modelSteps);

    setVisGraphData(
      createGraphViewNotFinal(modelSteps[0].graph, durations, resources)
    );
  };

  const onStepClick = (step: number) => {
    const currentStep = modelStepIndex + step;
    setModelStepIndex(currentStep);

    if (currentStep !== modelSteps.length - 1) {
      networkRef.current?.setOptions(graphOptions);

      setVisGraphData(
        createGraphViewNotFinal(
          modelSteps[currentStep].graph,
          durations,
          resources
        )
      );

      return;
    }

    setVisGraphData(
      createGraphView(
        ...computeModelParams(modelSteps[currentStep].graph, durations),
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
  };

  useEffect(() => {
    updateWorksCount();
  }, [jobsCount]);

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
        <Table jobsCount={jobsCount} data={tableData} />
        <VisGraph
          onCreateModelClick={onCreateModelClick}
          getNetwork={(network) => (networkRef.current = network)}
          graphView={visGraphData}
          steps={{
            stepsLength: modelSteps.length,
            currentStep: modelStepIndex,
            onStepClick,
          }}
        />
        {visGraphData && modelStepIndex === modelSteps.length - 1 && (
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
