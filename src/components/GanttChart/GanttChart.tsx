import React, { useEffect, useState } from "react";
import "./GanttChart.css";

const time = 24;

export type IChartData = IEdgePayload[];

interface IEdgePayload {
  jobNumber: number;
  resources: number;
  isOnCriticalPass: boolean;
  start: number;
  factStart: number;
  end: number;
  duration: number;
  from: string;
  to: string;
}

interface IJobsCell {
  hasJob: boolean;
  hasJobOffset: boolean;
  startEvent: string;
  endEvent: string;
  resources: number;
}

export const GanttChart = ({ chartData }: { chartData: IChartData }) => {
  const [chartDataState, setChartDataState] = useState<IChartData>(chartData);
  const [chartDataMap, setChartDataMap] = useState<Map<number, IJobsCell[]>>(
    new Map()
  );
  const [resourcesSum, setResourcesSum] = useState<number[]>([]);
  const [resourcesAxis, setResourcesAxis] = useState<number[]>([]);
  const timeAxis = Array.from({ length: time }, (_, i) => i);

  useEffect(() => {
    // init chart data
    const newChartDataMap = new Map();

    chartDataState.forEach((job) => {
      newChartDataMap.set(
        job.jobNumber,
        timeAxis.map((el) => {
          const hasJob = el > job.factStart && el <= job.factStart + job.duration;

          return {
            hasJob,
            hasJobOffset: el > job.start && el <= job.end,
            startEvent: (
              job.duration === 0 ? el === job.factStart : el === job.factStart + 1
            )
              ? job.from
              : "",
            endEvent: el === job.factStart + job.duration ? job.to : "",
            resources: hasJob ? job.resources : 0,
          };
        })
      );
    });
    setChartDataMap(newChartDataMap);
  }, [chartDataState]);

  useEffect(() => {
    // init resources
    const chartDataMapMatrix = Array.from(chartDataMap.values());
    if (chartDataMapMatrix[0]) {
      const sumArray: number[] = [];

      for (let i = 0; i < chartDataMapMatrix[0].length; i++) {
        let sum = 0;
        for (let j = 0; j < chartDataMapMatrix.length; j++) {
          sum += chartDataMapMatrix[j][i].resources;
        }
        sumArray.push(sum);
      }
      setResourcesSum(sumArray);
    }
    console.log("chartDataMap changed");
  }, [chartDataMap]);

  useEffect(() => {
    setResourcesAxis(
      Array.from({ length: Math.max(...resourcesSum) + 1 }, (_, i) => i)
    );
    console.log("resourcesSum changed", resourcesSum);
  }, [resourcesSum]);

  useEffect(() => {
    setTimeout(() => {
      setChartDataState(
        chartDataState.map((it) => {
          if (it.jobNumber === 8) {
            return { ...it, factStart: 10};
          }
          return it;
        })
      );
    }, 2000);
  }, [])

  return (
    <div className="gantt-chart">
      {Array.from(chartDataMap.entries()).map(([number, data], i) => (
        <React.Fragment key={i}>
          <div className="gant-row-job">Job {number}</div>
          <div className="gant-row-period">
            {data.map((timeElem, j) => (
              <div
                key={j}
                className="gant-row-item"
                data-startevent={timeElem.startEvent}
                data-endevent={timeElem.endEvent}
              >
                {timeElem.hasJob && <div className="item-job" />}
                {timeElem.hasJobOffset && <div className="item-job-offset" />}
              </div>
            ))}
          </div>
        </React.Fragment>
      ))}
      <div className="gant-row-job">time line</div>
      <div className="gant-row-period">
        {timeAxis.map((time) => (
          <div key={time} className="gant-row-item">
            {time}
          </div>
        ))}
      </div>
      {resourcesAxis.map((cell) => (
        <React.Fragment key={cell}>
          <div className="gant-row-job">{cell}</div>
          <div className="gant-row-period">
            {timeAxis.map((timeCell) => {
              const isResourceLevel =
                resourcesSum[timeCell] === cell && resourcesSum[timeCell] !== 0;

              return (
                <div
                  key={timeCell}
                  className={`gant-row-item ${isResourceLevel && "res-level"}`}
                >
                  {isResourceLevel && resourcesSum[timeCell]}
                </div>
              );
            })}
          </div>
        </React.Fragment>
      ))}
    </div>
  );
};
