import React, { ChangeEvent, useEffect, useState } from "react";
import { Durations, PredNodesInput, Resources } from "helpers/types";
import "./Table.css";

interface ITableData {
  durations: {
    data: Durations;
    action: (event: ChangeEvent<HTMLInputElement>) => void;
  };
  predNodesInput: {
    data: PredNodesInput;
    action: (event: ChangeEvent<HTMLInputElement>) => void;
  };
  resources: {
    data: Resources;
    action: (event: ChangeEvent<HTMLInputElement>) => void;
  };
}

interface IProps {
  jobsCount: number;
  data: ITableData;
}

export const Table = ({
  jobsCount,
  data: { durations, predNodesInput, resources },
}: IProps) => {
  const [nodesArray, setNodesArray] = useState<number[]>([]);

  useEffect(() => {
    setNodesArray(Array.from({ length: jobsCount }, (_, i) => i + 1));
  }, [jobsCount]);

  return (
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
                  value={durations.data[node] || ""}
                  onChange={durations.action}
                  autoComplete="off"
                  tabIndex={1}
                  className="input input-table"
                />
              </td>
              <td className="tbody-data">
                <input
                  type="text"
                  name={`${node}`}
                  value={predNodesInput.data[node] || ""}
                  onChange={predNodesInput.action}
                  autoComplete="off"
                  tabIndex={2}
                  className="input input-table"
                />
              </td>
              <td className="tbody-data">
                <input
                  type="text"
                  name={`${node}`}
                  value={resources.data[node] || ""}
                  onChange={resources.action}
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
  );
};
