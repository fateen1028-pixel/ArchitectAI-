import {
    addEdge,
    Background,
    BackgroundVariant,
    Controls,
    MarkerType,
    MiniMap,
    ReactFlow,
} from "@xyflow/react";
import {
    useCallback,
    useMemo,
} from "react";

import ArchitectureNode
    from "./ArchitectureNode.jsx";

export default function ArchitectureCanvas({
                                               nodes,
                                               edges,
                                               setNodes,
                                               setEdges,
                                               onNodesChange,
                                               onEdgesChange,
                                           }) {
    const nodeTypes = useMemo(
        () => ({
            architecture: ArchitectureNode,
        }),
        [],
    );

    const onConnect = useCallback(
        (connection) => {
            if (
                !connection.source
                || !connection.target
                || connection.source
                === connection.target
            ) {
                return;
            }

            setEdges((currentEdges) => {
                const alreadyExists =
                    currentEdges.some(
                        (edge) =>
                            edge.source === connection.source
                            && edge.target
                            === connection.target,
                    );

                if (alreadyExists) {
                    return currentEdges;
                }

                return addEdge(
                    {
                        ...connection,
                        type: "smoothstep",
                        markerEnd: {
                            type: MarkerType.ArrowClosed,
                            color: "#71717a",
                        },
                        style: {
                            stroke: "#71717a",
                            strokeWidth: 2,
                        },
                    },
                    currentEdges,
                );
            });
        },
        [setEdges],
    );

    const onNodeDoubleClick = useCallback(
        (_event, node) => {
            const newLabel = window.prompt(
                "Rename this component",
                node.data.label,
            );

            if (!newLabel?.trim()) {
                return;
            }

            setNodes((currentNodes) =>
                currentNodes.map((currentNode) =>
                    currentNode.id === node.id
                        ? {
                            ...currentNode,
                            data: {
                                ...currentNode.data,
                                label: newLabel.trim(),
                            },
                        }
                        : currentNode,
                ),
            );
        },
        [setNodes],
    );

    return (
        <div
            className="
        h-[640px] overflow-hidden
        rounded-2xl border border-white/10
        bg-[#090b10]
      "
        >
            <ReactFlow
                nodes={nodes}
                edges={edges}
                nodeTypes={nodeTypes}
                onNodesChange={onNodesChange}
                onEdgesChange={onEdgesChange}
                onConnect={onConnect}
                onNodeDoubleClick={onNodeDoubleClick}
                fitView
                fitViewOptions={{
                    padding: 0.3,
                    maxZoom: 1,
                }}
                minZoom={0.25}
                maxZoom={1.8}
                snapToGrid
                snapGrid={[20, 20]}
                defaultEdgeOptions={{
                    type: "smoothstep",
                }}
            >
                <Background
                    variant={BackgroundVariant.Dots}
                    gap={20}
                    size={1}
                    color="#27272a"
                />

                <Controls />

                <MiniMap
                    pannable
                    zoomable
                    nodeColor="#38bdf8"
                    maskColor="rgba(7, 9, 13, 0.75)"
                />
            </ReactFlow>
        </div>
    );
}