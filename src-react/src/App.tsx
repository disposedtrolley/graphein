import { Fragment, useState } from "react";
import { Graph, newNode, newEdge } from "./graph";

function App() {
  let [nodes, setNodes] = useState([
    newNode("1", "Node A", 258.3976135253906, 331.9783248901367),
    newNode("2", "Node B", 593.3976135253906, 260.9783248901367),
  ]);

  let [edges, setEdges] = useState([newEdge(nodes[0], nodes[1])]);

  return (
    <Fragment>
      <Graph nodes={nodes} edges={edges} />;
      <button
        onClick={() => {
          const nodeC = newNode("3", "Node C", 700, 100);
          setNodes([...nodes, nodeC]);
          setEdges([...edges, newEdge(nodes[1], nodeC)]);
        }}
      >
        Add node
      </button>
    </Fragment>
  );
}

export default App;
