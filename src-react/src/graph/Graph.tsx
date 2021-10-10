import { useEffect, useRef } from "react";
import { GraphView, IEdge, INode } from "react-digraph";

const KIND_NODE = "grapheinNode";
const KIND_EDGE = "grapheinEdge";

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
      type: KIND_NODE,
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
      type: KIND_EDGE,
    },
  };
};

const config = {
  nodeTypes: {
    grapheinNode: {
      shapeId: `#${KIND_NODE}`,
      shape: (
        <symbol
          width="200"
          height="100"
          viewBox="0 0 200 100"
          id={KIND_NODE}
          key="0"
        >
          <rect width="100%" height="100%" rx="15"></rect>
        </symbol>
      ),
    },
  },
  nodeSubtypes: {},
  edgeTypes: {
    grapheinConnection: {
      shapeId: `#${KIND_EDGE}`,
      shape: <symbol viewBox="0 0 50 50" id={KIND_EDGE} key="0"></symbol>,
    },
  },
};

export const Graph = (props: { nodes: Node[]; edges: Edge[] }) => {
  const graphRef = useRef(null);

  useEffect(() => {
    const newestNode = props.nodes[props.nodes.length - 1];
    // I have absolutely no clue why a timeout is required here (maybe react-digraph)
    // takes time to do some internal rendering???), but without the timeout, we can't
    // pan the view to the most recently added node.
    setTimeout(() => {
      (graphRef as any).current.panToNode(newestNode.id);
    }, 10);
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
      renderNodeText={renderNodeText}
    />
  );
};

const renderNodeText = (data: { title: string }) => {
  return (
    <foreignObject x="-100" y="-50" width="200" height="100">
      <div style={{ padding: 10, textAlign: "center", color: "black" }}>
        <p style={{ fontSize: "10px" }}>{data.title}</p>
      </div>
    </foreignObject>
  );
};
