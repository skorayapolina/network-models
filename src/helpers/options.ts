export const graphOptions = {
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
      roundness: 0.25,
    },
  },
  height: "520px",
};
