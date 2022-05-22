import React from "react";
import { default as GraphComponent } from "react-graph-vis";
import { graphOptions } from "helpers/options";
import "components/VisGraph/VisGraph.css";

interface IProps {
  onCreateModelClick: () => void;
  getNetwork: (network) => void;
  graphView: any;
  steps: {
    currentStep: number;
    stepsLength: number;
    onStepClick: (step: number) => void;
  };
}

export const VisGraph = ({
  onCreateModelClick,
  getNetwork,
  graphView,
  steps: { currentStep, stepsLength, onStepClick },
}: IProps) => {
  const stepBack = () => {
    onStepClick(-1);
  };

  const stepForward = () => {
    onStepClick(1);
  };

  return (
    <>
      <div className="button-wrapper">
        <button className="button button--primary" onClick={onCreateModelClick}>
          Построить модель
        </button>
      </div>

      <div className="graph-wrapper">
        {graphView && (
          <>
            <div className="buttons">
              <button
                onClick={stepBack}
                className="button button--primary button-square"
                disabled={currentStep === 0}
              >
                {"<-"}
              </button>
              <span>{currentStep + 1}</span>
              <button
                onClick={stepForward}
                className="button button--primary button-square"
                disabled={currentStep === stepsLength - 1}
              >
                {"->"}
              </button>
            </div>
            <GraphComponent
              graph={graphView}
              options={graphOptions}
              getNetwork={getNetwork}
            />
          </>
        )}
      </div>
    </>
  );
};
