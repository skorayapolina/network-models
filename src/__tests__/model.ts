import { computeModel } from "App";

describe("Checks critical path and min time to complete project", () => {
  it("0.m", () => {
    const testPredNodes = {
      1: [5, 8],
      2: [9, 10],
      3: [],
      4: [2, 5, 8],
      5: [3],
      6: [1, 7],
      7: [2, 5, 8],
      8: [9, 10],
      9: [],
      10: [3],
    };

    const testDurations = {
      1: 2,
      2: 5,
      3: 3,
      4: 2,
      5: 1,
      6: 4,
      7: 4,
      8: 2,
      9: 2,
      10: 5,
    };

    const [graph, erlPoss, criticalPath, ltsPoss] = computeModel(testPredNodes, testDurations);

    expect(criticalPath).toEqual(['P0', 'P1', 'P2', 'P4', 'P5', 'P6']);
    expect(Math.max(...Object.values(erlPoss))).toEqual(21);
  });

  it("0.my", () => {
    const testPredNodes = {
      1: [8, 9],
      2: [5, 1, 4],
      3: [10],
      4: [7, 6],
      5: [3, 11],
      6: [],
      7: [10],
      8: [3],
      9: [6, 7],
      10: [],
      11: [6, 7]
    };

    const testDurations = {
      1: 1,
      2: 1,
      3: 5,
      4: 10,
      5: 6,
      6: 7,
      7: 9,
      8: 2,
      9: 8,
      10: 10,
      11: 2
    };

    const [graph, erlPoss, criticalPath, ltsPoss] = computeModel(testPredNodes, testDurations);

    expect(criticalPath).toEqual(['P0', 'P1', 'P5', 'P6', 'P7']);
    expect(Math.max(...Object.values(erlPoss))).toEqual(30);
  });

  it("1.Kirill", () => {
    const testPredNodes = {
      1: [2, 8],
      2: [3],
      3: [],
      4: [],
      5: [2, 8],
      6: [2, 8],
      7: [2, 8],
      8: [4],
      9: [1, 10, 11],
      10: [3],
      11: [5, 7]
    };

    const testDurations = {
      1: 9,
      2: 5,
      3: 9,
      4: 6,
      5: 2,
      6: 6,
      7: 1,
      8: 1,
      9: 10,
      10: 6,
      11: 3
    };

    const [graph, erlPoss, criticalPath, ltsPoss] = computeModel(testPredNodes, testDurations);

    expect(criticalPath).toEqual(['P0', 'P1', 'P4', 'P5', 'P7']);
    expect(Math.max(...Object.values(erlPoss))).toEqual(33);
  });

  it("2.Nastya", () => {
    const testPredNodes = {
      1: [],
      2: [8, 7],
      3: [1],
      4: [10, 5],
      5: [1],
      6: [9],
      7: [9, 3],
      8: [10, 5],
      9: [],
      10: [3, 9],
      11: [2, 6, 4]
    };

    const testDurations = {
      1: 9,
      2: 4,
      3: 3,
      4: 10,
      5: 5,
      6: 2,
      7: 6,
      8: 1,
      9: 6,
      10: 1,
      11: 4
    };

    const testResources = {
      1: 6,
      2: 6,
      3: 5,
      4: 5,
      5: 8,
      6: 5,
      7: 5,
      8: 4,
      9: 3,
      10: 7,
      11: 5
    };

    const [graph, erlPoss, criticalPath, ltsPoss] = computeModel(testPredNodes, testDurations);

    // expect(criticalPath).toEqual(['P0', 'P1', 'P3', 'P6', 'P7']);
    expect(criticalPath).toEqual(['P0', 'P1', 'P3', 'P5', 'P7']);
    expect(Math.max(...Object.values(erlPoss))).toEqual(28);
  });

  it("3.Julia", () => {
    const testPredNodes = {
      1: [6, 5],
      2: [10, 11],
      3: [7],
      4: [3, 8, 1],
      5: [7],
      6: [7, 9],
      7: [],
      8: [7, 9],
      9: [],
      10: [5, 6],
      11: [7]
    };

    const testDurations = {
      1: 3,
      2: 2,
      3: 8,
      4: 9,
      5: 4,
      6: 1,
      7: 5,
      8: 3,
      9: 6,
      10: 4,
      11: 5
    };

    const testResources = {
      1: 8,
      2: 7,
      3: 3,
      4: 10,
      5: 10,
      6: 9,
      7: 9,
      8: 4,
      9: 10,
      10: 6,
      11: 8
    };

    const [graph, erlPoss, criticalPath, ltsPoss] = computeModel(testPredNodes, testDurations);

    expect(criticalPath).toEqual(['P0', 'P1', 'P5', 'P6']);
    expect(Math.max(...Object.values(erlPoss))).toEqual(22);
  });

  it("4.Nikolai", () => {
    const testPredNodes = {
      1: [4, 5],
      2: [],
      3: [9],
      4: [9, 2],
      5: [6],
      6: [],
      7: [9, 2],
      8: [2, 9],
      9: [6],
      10: [3, 8],
      11: [7, 1, 10]
    };

    const testDurations = {
      1: 9,
      2: 7,
      3: 3,
      4: 10,
      5: 3,
      6: 1,
      7: 7,
      8: 2,
      9: 5,
      10: 5,
      11: 1
    };

    const testResources = {
      1: 8,
      2: 9,
      3: 7,
      4: 4,
      5: 9,
      6: 6,
      7: 3,
      8: 6,
      9: 10,
      10: 4,
      11: 4
    };

    const [graph, erlPoss, criticalPath, ltsPoss] = computeModel(testPredNodes, testDurations);

    // expect(criticalPath).toEqual(['P0', 'P1', 'P3', 'P4', 'P7']);
    expect(criticalPath).toEqual(['P0', 'P1', 'P2', 'P4', 'P7']);
    expect(Math.max(...Object.values(erlPoss))).toEqual(27);
  });

  it("5.Dasha", () => {
    const testPredNodes = {
      1: [4, 11],
      2: [8, 10],
      3: [5, 6],
      4: [7],
      5: [8, 10],
      6: [4, 11],
      7: [],
      8: [7],
      9: [2, 1, 3],
      10: [11],
      11: []
    };

    const testDurations = {
      1: 8,
      2: 1,
      3: 1,
      4: 8,
      5: 7,
      6: 3,
      7: 8,
      8: 5,
      9: 3,
      10: 4,
      11: 4
    };

    const testResources = {
      1: 5,
      2: 10,
      3: 3,
      4: 6,
      5: 4,
      6: 9,
      7: 9,
      8: 9,
      9: 3,
      10: 9,
      11: 9
    };

    const [graph, erlPoss, criticalPath, ltsPoss] = computeModel(testPredNodes, testDurations);

    // expect(criticalPath).toEqual(['P0', 'P1', 'P4', 'P6', 'P7']);
    expect(criticalPath).toEqual(['P0', 'P1', 'P3', 'P5', 'P7']);
    expect(Math.max(...Object.values(erlPoss))).toEqual(27);
  });

  it("6.Nadya", () => {
    const testPredNodes = {
      1: [10, 2],
      2: [5, 3],
      3: [],
      4: [11],
      5: [],
      6: [1, 4],
      7: [6, 9, 8],
      8: [10, 2],
      9: [5, 3],
      10: [3],
      11: [3]
    };

    const testDurations = {
      1: 1,
      2: 2,
      3: 8,
      4: 5,
      5: 8,
      6: 8,
      7: 3,
      8: 10,
      9: 9,
      10: 7,
      11: 2
    };

    const testResources = {
      1: 8,
      2: 7,
      3: 9,
      4: 5,
      5: 10,
      6: 3,
      7: 6,
      8: 8,
      9: 6,
      10: 4,
      11: 4
    };

    const [graph, erlPoss, criticalPath, ltsPoss] = computeModel(testPredNodes, testDurations);

    // expect(criticalPath).toEqual(['P0', 'P1', 'P4', 'P6', 'P7']);
    expect(criticalPath).toEqual(['P0', 'P1', 'P4', 'P6', 'P7']);
    expect(Math.max(...Object.values(erlPoss))).toEqual(28);
  });

  it("7.Anton-1", () => {
    const testPredNodes = {
      1: [6],
      2: [],
      3: [6],
      4: [11, 1, 8],
      5: [2],
      6: [],
      7: [5, 3],
      8: [3, 5],
      9: [5, 3],
      10: [3, 5],
      11: [7, 10]
    };

    const testDurations = {
      1: 10,
      2: 5,
      3: 8,
      4: 6,
      5: 1,
      6: 3,
      7: 3,
      8: 6,
      9: 6,
      10: 3,
      11: 1
    };

    const testResources = {
      1: 10,
      2: 3,
      3: 10,
      4: 4,
      5: 7,
      6: 4,
      7: 3,
      8: 3,
      9: 9,
      10: 7,
      11: 5
    };

    const [graph, erlPoss, criticalPath, ltsPoss] = computeModel(testPredNodes, testDurations);

    // expect(criticalPath).toEqual(['P0', 'P1', 'P4', 'P5', 'P7']);
    expect(criticalPath).toEqual(['P0', 'P1', 'P4', 'P6', 'P7']);
    expect(Math.max(...Object.values(erlPoss))).toEqual(23);
  });

  it("8.Anton-2", () => {
    const testPredNodes = {
      1: [10],
      2: [8, 10],
      3: [7, 6, 5],
      4: [9],
      5: [9],
      6: [1, 4],
      7: [2, 11],
      8: [4, 1],
      9: [],
      10: [],
      11: [4, 1]
    };

    const testDurations = {
      1: 1,
      2: 4,
      3: 10,
      4: 5,
      5: 4,
      6: 9,
      7: 1,
      8: 3,
      9: 7,
      10: 8,
      11: 5
    };

    const testResources = {
      1: 8,
      2: 6,
      3: 3,
      4: 9,
      5: 7,
      6: 6,
      7: 3,
      8: 6,
      9: 3,
      10: 6,
      11: 3
    };

    const [graph, erlPoss, criticalPath, ltsPoss] = computeModel(testPredNodes, testDurations);

    // expect(criticalPath).toEqual(['P0', 'P1', 'P4', 'P5', 'P7']);
    expect(criticalPath).toEqual(['P0', 'P1', 'P4', 'P6', 'P7']);
    expect(Math.max(...Object.values(erlPoss))).toEqual(31);
  });

  it("9.Tanya", () => {
    const testPredNodes = {
      1: [8],
      2: [8],
      3: [11, 5],
      4: [3, 1],
      5: [8],
      6: [4, 8],
      7: [3, 1],
      8: [],
      9: [10, 7, 2],
      10: [11, 5],
      11: []
    };

    const testDurations = {
      1: 1,
      2: 5,
      3: 1,
      4: 4,
      5: 3,
      6: 7,
      7: 1,
      8: 2,
      9: 4,
      10: 9,
      11: 9
    };

    const testResources = {
      1: 8,
      2: 5,
      3: 9,
      4: 7,
      5: 4,
      6: 3,
      7: 4,
      8: 4,
      9: 7,
      10: 8,
      11: 9
    };

    const [graph, erlPoss, criticalPath, ltsPoss] = computeModel(testPredNodes, testDurations);

    expect(criticalPath).toEqual(['P0', 'P2', 'P4', 'P6']);
    expect(Math.max(...Object.values(erlPoss))).toEqual(22);
  });

  it("9.My-with-end-fic", () => {
    const testPredNodes = {
      1: [2,3,4],
      2: [],
      3: [],
      4: [],
    };

    const testDurations = {
      1: 1,
      2: 5,
      3: 1,
      4: 4
    };

    const testResources = {
      1: 8,
      2: 5,
      3: 9,
      4: 7
    };

    const [graph, erlPoss, criticalPath, ltsPoss] = computeModel(testPredNodes, testDurations);

    const graphSerialized = graph.serialize();

    expect(graphSerialized.nodes.length).toEqual(5);
  });
});
