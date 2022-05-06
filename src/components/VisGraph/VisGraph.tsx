import React, { RefObject, useRef } from 'react';
import { default as GraphComponent } from "react-graph-vis";
import { graphOptions } from 'helpers/options';
import 'components/VisGraph/VisGraph.css';

interface IProps {
  onCreateModelClick: (buttonRef: RefObject<HTMLButtonElement>) => () => void;
  getNetwork: (network) => void;
  graphView: any;
}

export const VisGraph = ({ onCreateModelClick, getNetwork, graphView }: IProps) => {
  const buttonRef = useRef<HTMLButtonElement | null>(null);

  return (
    <>
      <div className="button-wrapper">
        <button
          className="button button--primary"
          onClick={onCreateModelClick(buttonRef)}
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
            getNetwork={getNetwork}
          />
        )}
      </div>
    </>
  )
}
