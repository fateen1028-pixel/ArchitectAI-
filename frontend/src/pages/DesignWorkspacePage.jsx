import {
    ArrowLeft,
    BrainCircuit,
    LoaderCircle,
    RotateCcw,
    Save,
} from "lucide-react";

import {
    Link,
    useNavigate,
    useParams,
} from "react-router";

import {
    useCallback,
    useEffect,
    useState,
} from "react";

import {
    useEdgesState,
    useNodesState,
} from "@xyflow/react";

import { api } from "../api/apiClient.js";

import ErrorState
    from "../components/ErrorState.jsx";

import LoadingState
    from "../components/LoadingState.jsx";

import ArchitectureCanvas
    from "../features/workspace/ArchitectureCanvas.jsx";

import ComponentPalette
    from "../features/workspace/ComponentPalette.jsx";

import {
    getComponentDefinition,
} from "../features/workspace/componentCatalog.js";

function loadDraft(challengeSlug) {
    try {
        const storedDraft = localStorage.getItem(
            `architect-ai:draft:${challengeSlug}`,
        );

        if (!storedDraft) {
            return null;
        }

        const parsedDraft = JSON.parse(storedDraft);

        return {
            nodes: Array.isArray(parsedDraft.nodes)
                ? parsedDraft.nodes
                : [],

            edges: Array.isArray(parsedDraft.edges)
                ? parsedDraft.edges
                : [],

            explanation:
                typeof parsedDraft.explanation === "string"
                    ? parsedDraft.explanation
                    : "",
        };
    } catch {
        return null;
    }
}

function RequirementsCard({
                              title,
                              requirements,
                          }) {
    return (
        <section
            className="
        rounded-2xl border border-white/8
        bg-white/[0.025] p-5
      "
        >
            <h2 className="text-sm font-semibold">
                {title}
            </h2>

            <ul className="mt-4 space-y-3">
                {requirements.map((requirement) => (
                    <li
                        key={requirement}
                        className="
              flex gap-2.5 text-xs
              leading-5 text-zinc-500
            "
                    >
            <span
                className="
                mt-2 size-1 shrink-0
                rounded-full bg-sky-300
              "
            />

                        {requirement}
                    </li>
                ))}
            </ul>
        </section>
    );
}

export default function DesignWorkspacePage() {
    const { challengeSlug } = useParams();

    const [challenge, setChallenge] =
        useState(null);

    const [status, setStatus] =
        useState("loading");

    const [error, setError] =
        useState("");

    const [explanation, setExplanation] =
        useState("");

    const [isSubmitting, setIsSubmitting] =
        useState(false);

    const [submissionError, setSubmissionError] =
        useState("");

    const [submissionResult, setSubmissionResult] =
        useState(null);

    const navigate = useNavigate();

    /*
     * These must be declared before submitAttempt.
     *
     * submitAttempt uses nodes and edges in both
     * the function body and dependency array.
     */
    const [
        nodes,
        setNodes,
        onNodesChange,
    ] = useNodesState([]);

    const [
        edges,
        setEdges,
        onEdgesChange,
    ] = useEdgesState([]);

    const submitAttempt = useCallback(async () => {
        if (isSubmitting) {
            return;
        }

        setSubmissionError("");
        setSubmissionResult(null);
        setIsSubmitting(true);

        try {
            const payload = {
                explanation: explanation.trim(),

                /*
                 * React Flow stores extra frontend-specific data.
                 *
                 * We send only the fields expected by Spring Boot.
                 */
                nodes: nodes.map((node) => ({
                    id: node.id,
                    componentType:
                    node.data.componentType,
                    label: node.data.label,
                    x: node.position.x,
                    y: node.position.y,
                })),

                edges: edges.map((edge) => ({
                    id: edge.id,
                    source: edge.source,
                    target: edge.target,
                })),
            };

            const result = await api.submitAttempt(
                challengeSlug,
                payload,
            );

            navigate(
                `/attempts/${result.id}/feedback`,
            );
        } catch (requestError) {
            setSubmissionError(
                requestError.message
                ?? "Unable to submit architecture",
            );
        } finally {
            setIsSubmitting(false);
        }
    }, [
        challengeSlug,
        edges,
        explanation,
        isSubmitting,
        nodes,
    ]);

    const loadWorkspace =
        useCallback(async () => {
            setStatus("loading");
            setError("");

            try {
                const challengeData =
                    await api.getChallenge(
                        challengeSlug,
                    );

                const draft =
                    loadDraft(challengeSlug);

                setChallenge(challengeData);
                setNodes(draft?.nodes ?? []);
                setEdges(draft?.edges ?? []);
                setExplanation(
                    draft?.explanation ?? "",
                );

                setStatus("success");
            } catch (requestError) {
                setError(
                    requestError.message
                    ?? "Unable to load workspace",
                );

                setStatus("error");
            }
        }, [
            challengeSlug,
            setEdges,
            setNodes,
        ]);

    useEffect(() => {
        loadWorkspace();
    }, [loadWorkspace]);

    /*
     * Automatically persist the current draft.
     *
     * The small delay prevents localStorage from being
     * updated on every tiny drag movement immediately.
     */
    useEffect(() => {
        if (status !== "success") {
            return undefined;
        }

        const timeoutId = window.setTimeout(
            () => {
                localStorage.setItem(
                    `architect-ai:draft:${challengeSlug}`,
                    JSON.stringify({
                        nodes,
                        edges,
                        explanation,
                    }),
                );
            },
            300,
        );

        return () => {
            window.clearTimeout(timeoutId);
        };
    }, [
        challengeSlug,
        edges,
        explanation,
        nodes,
        status,
    ]);

    /*
     * Once the learner edits the architecture after
     * submission, hide the previous submission result.
     *
     * The previous result no longer represents the
     * currently visible architecture.
     */
    useEffect(() => {
        setSubmissionResult(null);
        setSubmissionError("");
    }, [
        nodes,
        edges,
        explanation,
    ]);

    const addComponent = useCallback(
        (componentType) => {
            const component =
                getComponentDefinition(componentType);

            setNodes((currentNodes) => {
                const index = currentNodes.length;
                const column = index % 3;
                const row = Math.floor(index / 3);

                return [
                    ...currentNodes,
                    {
                        id:
                            `${componentType.toLowerCase()}-`
                            + crypto.randomUUID(),

                        type: "architecture",

                        position: {
                            x: 80 + column * 250,
                            y: 80 + row * 150,
                        },

                        data: {
                            componentType,
                            label: component.label,
                        },
                    },
                ];
            });
        },
        [setNodes],
    );

    const resetWorkspace = useCallback(() => {
        const shouldReset = window.confirm(
            "Delete every component and connection "
            + "from this draft?",
        );

        if (!shouldReset) {
            return;
        }

        setNodes([]);
        setEdges([]);
        setExplanation("");
        setSubmissionResult(null);
        setSubmissionError("");

        localStorage.removeItem(
            `architect-ai:draft:${challengeSlug}`,
        );
    }, [
        challengeSlug,
        setEdges,
        setNodes,
    ]);

    /*
     * Frontend validation.
     *
     * The backend still performs the real validation.
     * Frontend validation only improves user experience.
     */
    const canSubmit =
        nodes.length >= 3
        && edges.length >= 2
        && explanation.trim().length >= 40
        && !isSubmitting;

    if (status === "loading") {
        return (
            <LoadingState
                message="Preparing design workspace..."
            />
        );
    }

    if (status === "error") {
        return (
            <ErrorState
                message={error}
                onRetry={loadWorkspace}
            />
        );
    }

    return (
        <div>
            <div
                className="
          flex flex-col justify-between gap-5
          lg:flex-row lg:items-end
        "
            >
                <div>
                    <Link
                        to={`/challenges/${challenge.slug}`}
                        className="
              inline-flex items-center gap-2
              text-sm text-zinc-400
              transition hover:text-white
            "
                    >
                        <ArrowLeft size={15} />
                        Challenge details
                    </Link>

                    <h1
                        className="
              mt-5 text-3xl font-semibold
              tracking-tight
            "
                    >
                        {challenge.title}
                    </h1>

                    <p
                        className="
              mt-2 max-w-3xl text-sm
              leading-6 text-zinc-500
            "
                    >
                        Add components, move them and connect
                        their handles to represent request and
                        data flow.
                    </p>
                </div>

                <div
                    className="
            flex flex-wrap items-center gap-3
          "
                >
          <span
              className="
              inline-flex items-center gap-2
              text-xs text-zinc-500
            "
          >
            <Save size={14} />
            Draft saved automatically
          </span>

                    <button
                        type="button"
                        onClick={resetWorkspace}
                        className="
              inline-flex items-center gap-2
              rounded-xl border border-white/10
              bg-white/5 px-4 py-2.5
              text-sm font-medium text-zinc-300
              transition hover:bg-white/10
            "
                    >
                        <RotateCcw size={15} />
                        Reset
                    </button>
                </div>
            </div>

            <div
                className="
          mt-8 grid gap-4
          xl:grid-cols-[240px_minmax(0,1fr)_280px]
        "
            >
                <ComponentPalette
                    onAddComponent={addComponent}
                />

                <ArchitectureCanvas
                    nodes={nodes}
                    edges={edges}
                    setNodes={setNodes}
                    setEdges={setEdges}
                    onNodesChange={onNodesChange}
                    onEdgesChange={onEdgesChange}
                />

                <aside className="space-y-4">
                    <RequirementsCard
                        title="Functional requirements"
                        requirements={
                            challenge.functionalRequirements
                        }
                    />

                    <RequirementsCard
                        title="Non-functional requirements"
                        requirements={
                            challenge.nonFunctionalRequirements
                        }
                    />
                </aside>
            </div>

            <section
                className="
          mt-5 rounded-2xl
          border border-white/8
          bg-white/[0.025] p-6
        "
            >
                <label
                    htmlFor="design-explanation"
                    className="font-semibold"
                >
                    Explain your decisions
                </label>

                <p
                    className="
            mt-1 text-sm text-zinc-500
          "
                >
                    Explain request flow, storage choices,
                    scaling strategy and failure handling.
                </p>

                <textarea
                    id="design-explanation"
                    value={explanation}
                    onChange={(event) =>
                        setExplanation(event.target.value)
                    }
                    rows={7}
                    placeholder={
                        "Example: Requests first reach the load "
                        + "balancer. Frequently accessed mappings "
                        + "are served from the cache..."
                    }
                    className="
            mt-5 w-full resize-y rounded-xl
            border border-white/10
            bg-[#090b10] px-4 py-3
            text-sm leading-7 text-zinc-200
            outline-none transition
            placeholder:text-zinc-700
            focus:border-sky-400/40
          "
                />

                <div
                    className="
            mt-5 flex flex-col justify-between
            gap-4 sm:flex-row sm:items-center
          "
                >
                    <div>
                        <p className="text-xs text-zinc-600">
                            {nodes.length} components ·{" "}
                            {edges.length} connections ·{" "}
                            {explanation.trim().length} characters
                        </p>

                        {!canSubmit && !isSubmitting && (
                            <p
                                className="
                  mt-1 text-xs text-zinc-700
                "
                            >
                                Add at least 3 components,
                                2 connections and a 40-character
                                explanation.
                            </p>
                        )}
                    </div>

                    <button
                        type="button"
                        onClick={submitAttempt}
                        disabled={!canSubmit}
                        className="
              inline-flex items-center justify-center
              gap-2 rounded-xl bg-white
              px-5 py-3 text-sm font-semibold
              text-black transition
              hover:bg-zinc-200
              disabled:cursor-not-allowed
              disabled:bg-white/10
              disabled:text-zinc-600
            "
                    >
                        {isSubmitting ? (
                            <>
                                <LoaderCircle
                                    size={16}
                                    className="animate-spin"
                                />

                                Saving attempt...
                            </>
                        ) : (
                            <>
                                <BrainCircuit size={16} />
                                Submit architecture
                            </>
                        )}
                    </button>
                </div>
            </section>

            {submissionError && (
                <div
                    className="
            mt-4 rounded-xl
            border border-red-400/15
            bg-red-400/[0.05]
            px-4 py-3 text-sm text-red-300
          "
                >
                    {submissionError}
                </div>
            )}

            {submissionResult && (
                <div
                    className="
            mt-4 rounded-xl
            border border-emerald-400/15
            bg-emerald-400/[0.05]
            px-5 py-4
          "
                >
                    <h3
                        className="
              font-semibold text-emerald-300
            "
                    >
                        Architecture saved successfully
                    </h3>

                    <p
                        className="
              mt-2 text-sm leading-6
              text-zinc-400
            "
                    >
                        {submissionResult.checks.componentCount}
                        {" "}components and{" "}
                        {submissionResult.checks.connectionCount}
                        {" "}connections were stored.
                    </p>

                    <p
                        className="
              mt-2 text-xs text-zinc-500
            "
                    >
                        Attempt status:{" "}
                        {submissionResult.status}
                    </p>

                    {submissionResult.checks
                        .disconnectedComponents.length > 0 && (
                        <div className="mt-4">
                            <p
                                className="
                  text-sm font-medium
                  text-amber-300
                "
                            >
                                Disconnected components
                            </p>

                            <ul
                                className="
                  mt-2 list-disc space-y-1
                  pl-5 text-sm text-zinc-400
                "
                            >
                                {submissionResult.checks
                                    .disconnectedComponents
                                    .map((component) => (
                                        <li key={component}>
                                            {component}
                                        </li>
                                    ))}
                            </ul>
                        </div>
                    )}

                    {submissionResult.checks
                        .warnings.length > 0 && (
                        <div className="mt-4">
                            <p
                                className="
                  text-sm font-medium
                  text-amber-300
                "
                            >
                                Warnings
                            </p>

                            <ul
                                className="
                  mt-2 list-disc space-y-1
                  pl-5 text-sm text-zinc-400
                "
                            >
                                {submissionResult.checks
                                    .warnings.map((warning) => (
                                        <li key={warning}>
                                            {warning}
                                        </li>
                                    ))}
                            </ul>
                        </div>
                    )}
                </div>
            )}

            <div
                className="
          mt-4 rounded-xl border
          border-sky-400/10
          bg-sky-400/[0.04] px-4 py-3
          text-xs leading-5 text-zinc-500
        "
            >
                Double-click a component to rename it.
                Select a component or connection and press
                Delete to remove it.
            </div>
        </div>
    );
}