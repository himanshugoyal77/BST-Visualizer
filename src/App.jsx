import Tree from "./components/Tree";
import useModification from "./hooks/useModification";

const App = () => {
  const {
    clearAllNodes,
    reload,
    edges,
    nodes,
    onNodesChange,
    insertNode,
    removeNode,
    showPreOrder,
    levelOrderTraversal,
    inOrderTraversal,
    postOrderTraversal,
  } = useModification({
    initialEdges: [],
    initialNodes: [],
  });

  return (
    <div className="main">
      <h1 className="title">Binary Search Tree Visualizer</h1>
      <div className="actions">
        <button onClick={reload}>Reload</button>
        <button onClick={clearAllNodes}>Clear All</button>
        <button onClick={insertNode}>Add Node</button>
        <button onClick={removeNode}>Remove Node</button>
        <button className="inOrder" onClick={inOrderTraversal}>
          Inorder Traversal
        </button>
        <button className="preOrder" onClick={showPreOrder}>
          Preorder Traversal
        </button>
        <button className="postOrder" onClick={postOrderTraversal}>
          Postorder Traversal
        </button>
        <button className="levelOrder" onClick={levelOrderTraversal}>
          Levelorder{" "}
        </button>
      </div>
      <Tree {...{ edges, nodes, onNodesChange }} />
    </div>
  );
};

export default App;
