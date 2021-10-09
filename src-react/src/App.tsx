import { GraphView } from "react-digraph";
import React from "react";

const GraphConfig = {
  NodeTypes: {
    symbol: {
      shapeId: "#symbol",
      shape: (
        <symbol viewBox="0 0 200 100" id="symbol" key="0">
          <rect width="100%" height="100%" rx="15"></rect>
        </symbol>
      ),
    },
  },
  NodeSubtypes: {},
  EdgeTypes: {
    symbolConnection: {
      shapeId: "#symbolConnection",
      shape: (
        <symbol viewBox="0 0 50 50" id="symbolConnection" key="0"></symbol>
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
        type: "symbol",
      },
      {
        id: 2,
        title: "Node B",
        x: 593.9393920898438,
        y: 260.6060791015625,
        type: "symbol",
      },
    ],
    edges: [
      {
        source: 1,
        target: 2,
        type: "symbolConnection",
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
      renderNodeText={(
        data: { title: string },
        id: string | number,
        isSelected: boolean
      ) => {
        return (
          <text
            ref={React.createRef()}
            className="node-text"
            text-anchor="middle"
            xmlns="http://www.w3.org/2000/svg"
          >
            <tspan font-size="10px" xmlns="http://www.w3.org/2000/svg">
              {data.title}
            </tspan>
          </text>
        );
      }}
    />
  );
}

export default App;
