import { Fragment, useState } from "react";
import { v4 as uuidv4 } from "uuid";
import { Graph, newNode, newEdge } from "./graph";

function App() {
  let [nodes, setNodes] = useState([
    newNode(uuidv4(), "Node A", 258.3976135253906, 331.9783248901367),
    newNode(uuidv4(), "Node B", 593.3976135253906, 260.9783248901367),
  ]);

  let [edges, setEdges] = useState([newEdge(nodes[0], nodes[1])]);

  return (
    <Fragment>
      <Graph nodes={nodes} edges={edges} />;
      <button
        onClick={() => {
          const lastNode = nodes[nodes.length - 1];
          const id = uuidv4();
          const n = newNode(
            id,
            `Node ${id}`,
            lastNode!.data!.x! + 300,
            lastNode!.data!.y!
          );
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
