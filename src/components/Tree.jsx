import { ReactFlow, Background } from "@xyflow/react";

import "@xyflow/react/dist/style.css";

export default function Tree({ nodes, edges, onNodesChange }) {
  return (
    <div style={{ width: "100vw", height: "100%" }}>
      <ReactFlow
        width={"100%"}
        fitView
        fitViewOptions={{ padding: 0.6 }}
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onNodesChange}
      >
        <Background variant="dots" gap={12} size={1} />
      </ReactFlow>
    </div>
  );
}
