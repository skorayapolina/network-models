export interface IObject<T> {
  [key: string]: T;
}

export type Durations = IObject<number>;
export type Resources = IObject<number>;
export type PredNodes = IObject<number[]>;
export type PredNodesInput = IObject<string>;
