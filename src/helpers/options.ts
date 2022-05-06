export const graphOptions = {
  layout: {
    hierarchical: {
      sortMethod: "directed",
      enabled: true,
      direction: "LR",
      blockShifting: false
    },
  },
  physics: {
    enabled: false,
  },
  nodes: {
    shape: "box",
    color: "#DFDEFC",
  },
  edges: {
    width: 2,
    color: {
      inherit: true,
    },
    smooth: {
      type: "vertical",
      forceDirection: "none",
      roundness: 0,
    },
  },
  height: "520px",
};
