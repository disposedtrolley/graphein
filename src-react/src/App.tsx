import { GraphView } from "react-digraph";
import React from "react";

const GraphConfig = {
  NodeTypes: {
    empty: {
      // required to show empty nodes
      typeText: "None",
      shapeId: "#empty", // relates to the type property of a node
      shape: (
        <symbol viewBox="0 0 100 100" id="empty" key="0">
          <circle cx="50" cy="50" r="45"></circle>
        </symbol>
      ),
    },
  },
  NodeSubtypes: {},
  EdgeTypes: {
    emptyEdge: {
      // required to show empty edges
      shapeId: "#emptyEdge",
      shape: (
        <symbol viewBox="0 0 50 50" id="emptyEdge" key="0">
          <circle cx="25" cy="25" r="8" fill="currentColor">
            {" "}
          </circle>
        </symbol>
      ),
    },
  },
};

function App() {
  const graph = {
    nodes: [
      {
        id: 1,
        title: "Node A",
        x: 258.3976135253906,
        y: 331.9783248901367,
        type: "empty",
      },
      {
        id: 2,
        title: "Node B",
        x: 593.9393920898438,
        y: 260.6060791015625,
        type: "empty",
      },
    ],
    edges: [
      {
        source: 1,
        target: 2,
        type: "emptyEdge",
      },
    ],
  };
  const nodes = graph.nodes;
  const edges = graph.edges;

  const NodeTypes = GraphConfig.NodeTypes;
  const NodeSubtypes = GraphConfig.NodeSubtypes;
  const EdgeTypes = GraphConfig.EdgeTypes;

  return (
    <GraphView
      ref={React.createRef()}
      nodeKey="id"
      nodes={nodes}
      edges={edges}
      nodeTypes={NodeTypes}
      nodeSubtypes={NodeSubtypes}
      edgeTypes={EdgeTypes}
      allowMultiselect={false}
    />
  );
}

export default App;
