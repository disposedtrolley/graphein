import { Fragment, useEffect, useState } from "react";
import { v4 as uuidv4 } from "uuid";
import { Graph, newNode, newEdge } from "./graph";

function App() {
  let [nodes, setNodes] = useState([
    newNode(uuidv4(), "Node A", 258.3976135253906, 331.9783248901367),
    newNode(uuidv4(), "Node B", 593.3976135253906, 260.9783248901367),
  ]);

  let [edges, setEdges] = useState([newEdge(nodes[0], nodes[1])]);

  const newRandomNode = () => {
    const lastNode = nodes[nodes.length - 1];
    const id = uuidv4();
    const n = newNode(
      id,
      `Node ${id}`,
      lastNode!.data!.x! + 300,
      lastNode!.data!.y!
    );
    return [lastNode, n];
  };

  const newNodeFromEvent = (event: { data: { command: string } }) => {
    const message = event.data; // The JSON data our extension sent
    switch (message.command) {
      case "refactor":
        console.log(message);
        const [lastNode, n] = newRandomNode();
        setNodes([...nodes, n]);
        setEdges([...edges, newEdge(lastNode!, n)]);
        break;
    }
  };

  useEffect(() => {
    window.addEventListener("message", newNodeFromEvent);
    return () => {
      window.removeEventListener("message", newNodeFromEvent);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [nodes]);

  return (
    <Fragment>
      <Graph nodes={nodes} edges={edges} />;
      <button
        onClick={() => {
          const [lastNode, n] = newRandomNode();
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
