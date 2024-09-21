import { useEdgesState, useNodesState } from "@xyflow/react";
import React from "react";
import BinarySearchTree from "../common/data";
import { primaryColor } from "../common/styles";

const useModification = ({ initialEdges, initialNodes }) => {
  const [myTree, setMyTree] = React.useState(new BinarySearchTree());
  const [forceUpdate, setForceUpdate] = React.useState(false);
  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);
  const [activeButton, setActiveButton] = React.useState(null);

  React.useEffect(() => {
    sampleTree();
  }, []);

  const sampleTree = () => {
    createSampleTreeData(myTree);
    const { nodes: filteredNodes, edges: initialEdges } =
      myTree.levelOrderTraversal();

    setEdges([]);
    setNodes([]);

    const newNodes = filteredNodes.map((node) => {
      const newNode = {
        id: node.id,
        data: { label: node.value },
        position: node.position,
      };
      return newNode;
    });

    setNodes([...newNodes]);
    setEdges([...initialEdges]);
  };

  const reload = () => window.location.reload();

  function createSampleTreeData(tree) {
    tree.insert(10);
    tree.insert(5);
    tree.insert(15);
    tree.insert(3);
    tree.insert(7);
    tree.insert(13);
    tree.insert(17);
    tree.insert(2);
    tree.insert(4);
    tree.insert(6);
    tree.insert(8);
    tree.insert(12);
    tree.insert(14);
    tree.insert(16);
    tree.insert(18);
  }

  const clearAllNodes = () => {
    myTree.clear();
    setNodes([]);
    setEdges([]);
    setForceUpdate((prev) => !prev); // Force rerender
  };

  const insertNode = () => {
    const value = parseInt(prompt("Enter node value"));

    if (!value || typeof Number(value) !== "number") {
      alert("Please enter a valid number");
      return;
    }

    myTree.insert(value);

    setEdges([]);
    setNodes([]);

    const { nodes: filteredNodes, edges: initialEdges } =
      myTree.levelOrderTraversal();

    const newNodes = filteredNodes.map((node) => {
      const newNode = {
        id: node.id,
        data: { label: node.value },
        position: node.position,
      };
      return newNode;
    });
    setNodes((prev) => [...prev, ...newNodes]);
    setEdges((prev) => [...prev, ...initialEdges]);
  };

  const removeNode = () => {
    const value = prompt("Enter node value to remove");
    if (!value) return;

    const element = document.querySelector(`[data-id='${value}']`);
    if (element) {
      element.classList.add("highlight");

      setTimeout(() => {
        element.classList.remove("highlight");

        myTree.removeNode(value);

        // Clear the current edges and nodes before re-rendering
        setEdges([]);
        setNodes([]);

        // Get the updated tree structure after removal
        const { nodes: filteredNodes, edges: initialEdges } =
          myTree.levelOrderTraversal();

        // Map new nodes to render
        const newNodes = filteredNodes.map((node) => ({
          id: node.id,
          data: { label: node.value },
          position: node.position,
        }));

        // Update the state with new nodes and edges
        setNodes([...newNodes]);
        setEdges([...initialEdges]);
      }, 800); // Delay removal after 800ms
    }
  };

  const animateTraversal = (result, id) => {
    for (let i = 0; i < result.length; i++) {
      const element = document.querySelector(`[data-id='${result[i].id}']`);

      if (element) {
        setTimeout(() => {
          element.classList.add("highlight");

          setTimeout(() => {
            element.classList.remove("highlight");
          }, 550);
        }, 550 * i);
      }
      if (i === result.length - 1) {
        setTimeout(() => {
          setActiveButton(null);
          removeActiveClass(id);
        }, 550 * i);
      }
    }
  };

  const insertActiveClass = (id) => {
    const element = document.querySelector(`.${id}`);
    console.log("element", element);
    if (element) {
      console.log(element.style);
      element.style.scale = "1.01";
      element.style.backgroundColor = "red";
    }
  };

  const removeActiveClass = (id) => {
    const element = document.querySelector(`.${id}`);
    if (element) {
      element.style.scale = "1";
      element.style.backgroundColor = primaryColor;
    }
  };

  const showPreOrder = () => {
    if (activeButton !== null) return;
    const id = "preOrder";
    setActiveButton(id);
    insertActiveClass(id);
    const result = myTree.preOrderTraverse();
    animateTraversal(result, id);
  };

  const levelOrderTraversal = () => {
    if (activeButton !== null) return;
    const id = "levelOrder";
    setActiveButton(id);
    insertActiveClass(id);
    const { nodes: levelOrder } = myTree.levelOrderTraversal();
    animateTraversal(levelOrder, id);
  };

  const inOrderTraversal = () => {
    if (activeButton !== null) return;
    const id = "inOrder";
    setActiveButton(id);
    insertActiveClass(id);
    const inOrder = myTree.inOrderTraverse();
    animateTraversal(inOrder, id);
  };

  const postOrderTraversal = () => {
    if (activeButton !== null) return;
    const id = "postOrder";
    setActiveButton(id);
    insertActiveClass(id);
    const postOrder = myTree.postOrderTraverse();
    animateTraversal(postOrder, id);
  };

  return {
    nodes,
    edges,
    setNodes,
    setEdges,
    onNodesChange,
    onEdgesChange,
    clearAllNodes,
    reload,
    tree: myTree,
    insertNode,
    removeNode,
    animateTraversal,
    showPreOrder,
    levelOrderTraversal,
    inOrderTraversal,
    postOrderTraversal,
  };
};

export default useModification;
