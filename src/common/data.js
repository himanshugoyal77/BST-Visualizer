import { MarkerType } from "@xyflow/react";

const COMPARISON = {
  EQUAL: 0,
  SMALLER: -1,
  GREATER: 1,
};

const defaultCompareNumberFn = (a, b) => {
  if (Number(a) == Number(b)) {
    return COMPARISON.EQUAL;
  }

  return Number(a) < Number(b) ? COMPARISON.SMALLER : COMPARISON.GREATER;
};

class TreeNode {
  constructor(value, parent = null) {
    this.value = value.toString();
    this.parent = parent || null;
    this.left = null;
    this.right = null;
    // for react flow
    this.id = value.toString();
    this.data = { label: value.toString() };
    this.position = { x: -100, y: -100 };
  }

  get isLeaf() {
    return !this.left && !this.right;
  }

  get hasChildren() {
    return !this.isLeaf;
  }
}

class BinarySearchTree {
  root;
  compareFn;
  st = new Set(); // Stores positions as strings

  constructor(compareFn = defaultCompareNumberFn) {
    this.root = null;
    this.compareFn = compareFn;
  }

  clear() {
    this.root = null;
    return null;
  }

  isEmpty() {
    return this.root === null;
  }

  insert(value) {
    let node = this.root;
    if (!node) {
      this.root = new TreeNode(value);
      this.root.position = { x: 0, y: 0 };
      this.st.add(this.getPositionKey(this.root.position)); // Store position as a string
      this.root.data = { label: value.toString() };
      return this.root;
    }

    let insertedNode = null;

    const nodeInserted = (() => {
      while (true) {
        const parentPosition = {
          x: node.position.x,
          y: node.position.y,
        };

        const comparison = this.compareFn(value, node.value);
        if (comparison === COMPARISON.EQUAL) {
          insertedNode = node;
          return node;
        }

        if (comparison === COMPARISON.SMALLER) {
          if (!node.left) {
            insertedNode = new TreeNode(value, node);
            let position = {
              x: parentPosition.x - 150,
              y: parentPosition.y + 100,
            };
            while (this.st.has(this.getPositionKey(position))) {
              position = {
                x: position.x + 150,
                y: position.y,
              };
            }
            insertedNode.position = position;
            this.st.add(this.getPositionKey(position)); // Store position as a string
            node.left = insertedNode;
            return true;
          }
          node = node.left;
        }

        if (comparison === COMPARISON.GREATER) {
          if (!node.right) {
            insertedNode = new TreeNode(value, node);
            let position = {
              x: parentPosition.x + 50,
              y: parentPosition.y + 100,
            };
            while (this.st.has(this.getPositionKey(position))) {
              position = {
                x: position.x + 150,
                y: position.y,
              };
            }
            insertedNode.position = position;
            this.st.add(this.getPositionKey(position)); // Store position as a string
            node.right = insertedNode;
            return true;
          }
          node = node.right;
        }
      }
    })();

    if (nodeInserted) {
      return insertedNode;
    }
  }

  // Helper function to generate a unique key for position
  getPositionKey(position) {
    return `${position.x}:${position.y}`;
  }

  preOrderTraverse(node = this.root, traversed = []) {
    if (node === null) {
      return traversed;
    }
    traversed.push(node);
    if (node.left) {
      traversed.push(...this.preOrderTraverse(node.left));
    }
    if (node.right) {
      traversed.push(...this.preOrderTraverse(node.right));
    }

    return traversed;
  }

  inOrderTraverse(node = this.root, traversed = []) {
    if (node === null) {
      return traversed;
    }
    if (node.left) {
      traversed.push(...this.inOrderTraverse(node.left));
    }
    traversed.push(node);
    if (node.right) {
      traversed.push(...this.inOrderTraverse(node.right));
    }

    return traversed;
  }

  postOrderTraverse(node = this.root, traversed = []) {
    if (node === null) {
      return traversed;
    }
    if (node.left) {
      traversed.push(...this.postOrderTraverse(node.left));
    }
    if (node.right) {
      traversed.push(...this.postOrderTraverse(node.right));
    }
    traversed.push(node);

    return traversed;
  }

  levelOrderTraversal() {
    let traversed = [];
    let level = 0;

    if (!this.root) {
      return { nodes: [], edges: [] }; // Return empty if the tree is empty
    }

    const queue = [];
    const edges = [];
    const nodePositions = new Map(); // To store node positions for reference
    queue.push(this.root); // Start with the root node
    nodePositions.set(this.root.id, { x: 0, y: 0 });

    while (queue.length > 0) {
      const levelSize = queue.length; // Capture the current level size
      const levelWidth = 400 / levelSize; // Width allocation for nodes in the current level

      for (let i = 0; i < levelSize; i++) {
        const node = queue.shift(); // Remove the front node
        const position = nodePositions.get(node.id);

        // Position the current node
        traversed.push({
          ...node,
          position,
        });

        // Add the left and right children to the queue for the next level
        if (node.left) {
          const childX = position.x - levelWidth / 2;
          const childY = position.y + 100;
          nodePositions.set(node.left.id, { x: childX, y: childY });

          edges.push({
            id: `e${node.id}-${node.left.id}`,
            source: node.id,
            target: node.left.id,
            markerEnd: {
              type: MarkerType.ArrowClosed,
              width: 20,
              height: 20,
              color: "#FF0072",
            },
            style: {
              strokeWidth: 1,
              stroke: "#FF0072",
            },
          });

          queue.push(node.left);
        }
        if (node.right) {
          const childX = position.x + levelWidth / 2;
          const childY = position.y + 100;
          nodePositions.set(node.right.id, { x: childX, y: childY });

          edges.push({
            id: `e${node.id}-${node.right.id}`,
            source: node.id,
            target: node.right.id,
            markerEnd: {
              type: MarkerType.ArrowClosed,
              width: 20,
              height: 20,
              color: "#FF0072",
            },
            style: {
              strokeWidth: 1,
              stroke: "#FF0072",
            },
          });

          queue.push(node.right);
        }
      }
      level++;
    }

    return {
      nodes: traversed,
      edges,
    };
  }

  removeNode(value) {
    let node = this.root;
    if (!node) {
      return null;
    }

    const nodeRemoved = (() => {
      while (true) {
        const comparison = this.compareFn(value, node.value);
        if (comparison === COMPARISON.EQUAL) {
          if (node.isLeaf) {
            if (node.parent) {
              if (node.parent.left === node) {
                node.parent.left = null;
              } else {
                node.parent.right = null;
              }
            } else {
              this.root = null;
            }
          } else if (node.hasChildren) {
            if (node.left && !node.right) {
              if (node.parent) {
                if (node.parent.left === node) {
                  node.parent.left = node.left;
                } else {
                  node.parent.right = node.left;
                }
              } else {
                this.root = node.left;
              }
            } else if (node.right && !node.left) {
              if (node.parent) {
                if (node.parent.left === node) {
                  node.parent.left = node.right;
                } else {
                  node.parent.right = node.right;
                }
              } else {
                this.root = node.right;
              }
            } else {
              let successor = node.right;
              while (successor.left) {
                successor = successor.left;
              }
              node.value = successor.value;
              node.id = successor.id;
              if (successor.parent.left === successor) {
                successor.parent.left = null;
              } else {
                successor.parent.right = null;
              }
            }
          }
          return true;
        }

        if (comparison === COMPARISON.SMALLER) {
          if (!node.left) {
            return false;
          }
          node = node.left;
        }

        if (comparison === COMPARISON.GREATER) {
          if (!node.right) {
            return false;
          }
          node = node.right;
        }
      }
    })();
  }
}

export const initialNodes = [
  { id: "4", position: { x: 0, y: 0 }, data: { label: "4" } },
  { id: "1", position: { x: -50, y: 100 }, data: { label: "1" } },
  { id: "2", position: { x: 50, y: 100 }, data: { label: "2" } },
];

export const initialEdges = [
  {
    id: "e1-2",
    source: "4",
    target: "2",
    markerEnd: {
      type: MarkerType.ArrowClosed,
      width: 20,
      height: 20,
      color: "#FF0072",
    },
    style: {
      strokeWidth: 1,
      stroke: "#FF0072",
    },
  },
  {
    id: "e1-4",
    source: "4",
    target: "1",
    markerEnd: {
      type: MarkerType.ArrowClosed,
      width: 20,
      height: 20,
      color: "#FF0072",
    },
    style: {
      strokeWidth: 1,
      stroke: "#FF0072",
    },
  },
];

export default BinarySearchTree;
