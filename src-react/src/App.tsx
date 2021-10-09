import { Graph, newNode, newEdge } from "./graph";

const nodes = [
  newNode("1", "Node A", 258.3976135253906, 331.9783248901367),
  newNode("2", "Node B", 593.3976135253906, 260.9783248901367),
];

const edges = [newEdge(nodes[0], nodes[1])];

function App() {
  return <Graph nodes={nodes} edges={edges} />;
}

export default App;
