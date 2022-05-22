import React, { useEffect, useMemo, useState } from "react";
import "./GanttChart.css";

export type IChartData = IEdgePayload[];

interface IEdgePayload {
  jobNumber: number;
  resources: number;
  isOnCriticalPath: boolean;
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
  hasAdditionalTime?: boolean;
}

export const GanttChart = ({ chartData }: { chartData: IChartData }) => {
  const [chartDataState, setChartDataState] = useState<IChartData>(chartData);
  const [chartDataMap, setChartDataMap] = useState<Map<number, IJobsCell[]>>(
    new Map()
  );
  const [resourcesSum, setResourcesSum] = useState<number[]>([]);
  const [resourcesAxis, setResourcesAxis] = useState<number[]>([]);
  const [additionalTime, setAdditionalTime] = useState<number>(0);

  const timeAxis = useMemo<number[]>(() => {
    const time =
      Math.max(...chartData.map((job) => job.end)) + additionalTime + 2;
    return Array.from({ length: time }, (_, i) => i);
  }, [chartData, additionalTime]);

  useEffect(() => {
    // init chart data
    const newChartDataMap = new Map<number, IJobsCell[]>();

    chartDataState.forEach((job) => {
      newChartDataMap.set(
        job.jobNumber,
        timeAxis.map((el) => {
          const hasJob =
            el > job.factStart && el <= job.factStart + job.duration;

          return {
            hasJob,
            hasJobOffset: el > job.start && el <= job.end,
            hasAdditionalTime: el > job.end && el <= job.end + additionalTime,
            startEvent: (
              job.duration === 0
                ? el === job.factStart
                : el === job.factStart + 1
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
    // React Hook useEffect has a missing dependency: 'timeAxis'.
  }, [chartDataState, additionalTime]);

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
  }, [chartDataMap]);

  useEffect(() => {
    setResourcesAxis(
      Array.from({ length: Math.max(...resourcesSum) + 1 }, (_, i) => i)
    );
  }, [resourcesSum]);

  useEffect(() => {
    setChartDataState(chartData);
  }, [chartData]);

  const moveJob =
    (jobNumber: number, step = 1) =>
    () => {
      setChartDataState(
        chartDataState.map((it) => {
          if (it.jobNumber === jobNumber) {
            return { ...it, factStart: it.factStart + step };
          }
          return it;
        })
      );
    };

  const changeAdditionalTime = (step: number) => () => {
    setAdditionalTime(additionalTime + step);
  };

  return (
    <>
      <div className="add-time-wrapper">
        <span>Дополнительное время: </span>
        <button
          className="button button-square button--primary"
          onClick={changeAdditionalTime(-1)}
        >
          -
        </button>
        <div className="add-time-value">{additionalTime}</div>
        <button
          className="button button-square button--primary"
          onClick={changeAdditionalTime(1)}
        >
          +
        </button>
      </div>
      <div className="gantt-chart">
        {Array.from(chartDataMap.entries()).map(([number, data], i) => (
          <React.Fragment key={i}>
            <div className="gant-row-job">
              <span className="job-label">Job {number}</span>
              <button
                className="button button-square button--primary button-chart"
                onClick={moveJob(number, -1)}
              >
                -
              </button>
              <button
                className="button button-square button--primary button-chart"
                onClick={moveJob(number)}
              >
                +
              </button>
            </div>
            <div className="gant-row-period">
              {data.map((timeElem, j) => (
                <div
                  key={j}
                  className="gant-row-item"
                  data-startevent={timeElem.startEvent}
                  data-endevent={timeElem.endEvent}
                >
                  {timeElem.hasJob && (
                    <div className="item-job">
                      {timeElem.startEvent && (
                        <span className="item-job-res">
                          {timeElem.resources}
                        </span>
                      )}
                    </div>
                  )}
                  {timeElem.hasJobOffset && <div className="item-job-offset" />}
                  {timeElem.hasAdditionalTime && (
                    <div className="item-job-additionaltime" />
                  )}
                </div>
              ))}
            </div>
          </React.Fragment>
        ))}
        <div className="gant-row-job time-cell">time line</div>
        <div className="gant-row-period">
          {timeAxis.map((time) => (
            <div key={time} className="gant-row-item item-time-axis">
              <span className="time-axis-value">{time}</span>
            </div>
          ))}
        </div>
        {resourcesAxis.map((cell) => (
          <React.Fragment key={cell}>
            <div className="gant-row-job time-cell">{cell || "res ∑"}</div>
            <div className="gant-row-period">
              {timeAxis.map((timeCell) => {
                const isInfoLine = cell === 0;
                const isResourceLevel =
                  (resourcesSum[timeCell] === cell &&
                    resourcesSum[timeCell] !== 0) ||
                  isInfoLine;

                return (
                  <div
                    key={timeCell}
                    className={`gant-row-item 
                    ${isResourceLevel && "res-level"}
                    ${isInfoLine && "res-level-info"}
                    `}
                  >
                    {isResourceLevel && resourcesSum[timeCell]}
                  </div>
                );
              })}
            </div>
          </React.Fragment>
        ))}
      </div>
    </>
  );
};
