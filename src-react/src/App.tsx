import { Fragment, useEffect, useState, useCallback } from "react";
import { v4 as uuidv4 } from "uuid";
import { Graph, newNode, newEdge } from "./graph";

enum EditorAction {
  didChangeOpenFile = "didChangeOpenFile",
}

interface EditorEvent {
  action: EditorAction;
  payload: EditorEventPayload;
}

interface EditorEventPayload {
  from: EditorNode;
  to: EditorNode;
}

interface EditorPosition {
  line: number;
  character: number;
}

type EditorNodeKey = string;

interface EditorNode {
  key: EditorNodeKey;
  filename: string;
  position: EditorPosition;
  intellisense?: EditorNodeIntellisense;
}

interface EditorNodeIntellisense {
  function: string;
}

function App() {
  let [nodes, setNodes] = useState([
    newNode(uuidv4(), "Node A", 258.3976135253906, 331.9783248901367),
    newNode(uuidv4(), "Node B", 593.3976135253906, 260.9783248901367),
  ]);

  let [edges, setEdges] = useState([newEdge(nodes[0], nodes[1])]);

  const newRandomNode = useCallback(
    (text: string | null) => {
      const lastNode = nodes[nodes.length - 1];
      const id = uuidv4();
      const n = newNode(
        id,
        text || `Node ${id}`,
        lastNode!.data!.x! + 300,
        lastNode!.data!.y!
      );
      return [lastNode, n];
    },
    [nodes]
  );

  const newNodeFromEvent = useCallback(
    (event: { data: EditorEvent }) => {
      const message = event.data; // The JSON data our extension sent
      switch (message.action) {
        case EditorAction.didChangeOpenFile:
          console.log(message);
          const [lastNode, n] = newRandomNode(message.payload.to.filename);
          setNodes([...nodes, n]);
          setEdges([...edges, newEdge(lastNode!, n)]);
          break;
      }
    },
    [nodes, edges, newRandomNode]
  );

  useEffect(() => {
    window.addEventListener("message", newNodeFromEvent);
    return () => {
      window.removeEventListener("message", newNodeFromEvent);
    };
  }, [nodes, newNodeFromEvent]);

  return (
    <Fragment>
      <Graph nodes={nodes} edges={edges} />;
      <button
        onClick={() => {
          const [lastNode, n] = newRandomNode(null);
          setNodes([...nodes, n]);
          setEdges([...edges, newEdge(lastNode!, n)]);
        }}
      >
        Add node
      </button>
    </Fragment>
  );
}

export default App;
