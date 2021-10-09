import React, { useEffect, useCallback, useRef } from "react";
import { GraphView, IEdge, INode } from "react-digraph";

interface Node {
  id: string;
  data: INode;
}
export const newNode = (
  id: string,
  text: string,
  x: number,
  y: number
): Node => {
  return {
    id,
    data: {
      id,
      title: text,
      x: x,
      y: y,
      type: "grapheinNode",
    },
  };
};

interface Edge {
  data: IEdge;
}

export const newEdge = (from: Node, to: Node): Edge => {
  return {
    data: {
      source: from.id,
      target: to.id,
      type: "grapheinConnection",
    },
  };
};

const config = {
  nodeTypes: {
    grapheinNode: {
      shapeId: "#grapheinNode",
      shape: (
        <symbol viewBox="0 0 200 100" id="grapheinNode" key="0">
          <rect width="100%" height="100%" rx="15"></rect>
        </symbol>
      ),
    },
  },
  nodeSubtypes: {},
  edgeTypes: {
    grapheinConnection: {
      shapeId: "#grapheinConnection",
      shape: (
        <symbol viewBox="0 0 50 50" id="grapheinConnection" key="0"></symbol>
      ),
    },
  },
};

export const Graph = (props: { nodes: Node[]; edges: Edge[] }) => {
  const graphRef = useRef(null);

  useEffect(() => {
    return () => {
      (graphRef as any).current.panToNode(
        props.nodes[props.nodes.length - 1].id
      );
    };
  }, [props.nodes]);

  return (
    <GraphView
      ref={graphRef}
      nodeKey="id"
      nodes={props.nodes.map((n) => n.data)}
      edges={props.edges.map((e) => e.data)}
      nodeTypes={config.nodeTypes}
      nodeSubtypes={config.nodeSubtypes}
      edgeTypes={config.edgeTypes}
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
};
