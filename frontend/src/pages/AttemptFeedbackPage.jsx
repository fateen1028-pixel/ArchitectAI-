import {
    AlertTriangle,
    ArrowLeft,
    BrainCircuit,
    CheckCircle2,
    CircleX,
    Database,
    Gauge,
    Lightbulb,
    LoaderCircle,
    Network,
    RefreshCw,
    ShieldCheck,
    Sparkles,
    Target,
} from "lucide-react";
import {
    Link,
    useParams,
} from "react-router";
import {
    useCallback,
    useEffect,
    useRef,
    useState,
} from "react";

import { api } from "../api/apiClient.js";

const POLL_INTERVAL_MS = 1500;
const MAX_POLL_ATTEMPTS = 40;

function wait(milliseconds) {
    return new Promise((resolve) => {
        window.setTimeout(resolve, milliseconds);
    });
}

function ScoreCard({
                       title,
                       score,
                       icon: Icon,
                   }) {
    const getScoreStyle = () => {
        if (score >= 80) {
            return {
                text: "text-emerald-300",
                background: "bg-emerald-400/10",
                border: "border-emerald-400/15",
            };
        }

        if (score >= 60) {
            return {
                text: "text-amber-300",
                background: "bg-amber-400/10",
                border: "border-amber-400/15",
            };
        }

        return {
            text: "text-red-300",
            background: "bg-red-400/10",
            border: "border-red-400/15",
        };
    };

    const style = getScoreStyle();

    return (
        <article
            className={`
        rounded-2xl border p-5
        ${style.border}
        ${style.background}
      `}
        >
            <div
                className="
          flex items-center justify-between
          gap-3
        "
            >
        <span
            className="
            flex size-10 items-center
            justify-center rounded-xl
            bg-black/20 text-zinc-300
          "
        >
          <Icon size={19} />
        </span>

                <span
                    className={`
            text-3xl font-semibold
            ${style.text}
          `}
                >
          {score}
        </span>
            </div>

            <p
                className="
          mt-4 text-sm font-medium
          text-zinc-300
        "
            >
                {title}
            </p>

            <div
                className="
          mt-4 h-1.5 overflow-hidden
          rounded-full bg-black/20
        "
            >
                <div
                    className="
            h-full rounded-full bg-current
          "
                    style={{
                        width: `${score}%`,
                    }}
                />
            </div>
        </article>
    );
}

function FeedbackList({
                          title,
                          items,
                          icon: Icon,
                          variant = "neutral",
                      }) {
    const variants = {
        positive: {
            border: "border-emerald-400/15",
            background: "bg-emerald-400/[0.04]",
            icon: "text-emerald-300",
            bullet: "text-emerald-300",
        },

        negative: {
            border: "border-red-400/15",
            background: "bg-red-400/[0.04]",
            icon: "text-red-300",
            bullet: "text-red-300",
        },

        warning: {
            border: "border-amber-400/15",
            background: "bg-amber-400/[0.04]",
            icon: "text-amber-300",
            bullet: "text-amber-300",
        },

        neutral: {
            border: "border-sky-400/15",
            background: "bg-sky-400/[0.04]",
            icon: "text-sky-300",
            bullet: "text-sky-300",
        },
    };

    const style = variants[variant];

    if (!items?.length) {
        return null;
    }

    return (
        <section
            className={`
        rounded-2xl border p-6
        ${style.border}
        ${style.background}
      `}
        >
            <div className="flex items-center gap-3">
                <Icon
                    size={20}
                    className={style.icon}
                />

                <h2 className="font-semibold">
                    {title}
                </h2>
            </div>

            <ul className="mt-5 space-y-3">
                {items.map((item, index) => (
                    <li
                        key={`${item}-${index}`}
                        className="
              flex gap-3 text-sm
              leading-7 text-zinc-400
            "
                    >
            <span
                className={`
                mt-3 size-1.5 shrink-0
                rounded-full bg-current
                ${style.bullet}
              `}
            />

                        {item}
                    </li>
                ))}
            </ul>
        </section>
    );
}

function EvaluatingState() {
    return (
        <div
            className="
        flex min-h-[65vh] flex-col
        items-center justify-center
        rounded-3xl border border-white/8
        bg-white/[0.025]
        px-6 text-center
      "
        >
            <div
                className="
          relative flex size-20
          items-center justify-center
          rounded-3xl
          bg-violet-400/10
          text-violet-300
        "
            >
                <BrainCircuit size={34} />

                <LoaderCircle
                    size={86}
                    className="
            absolute animate-spin
            text-violet-400/30
          "
                />
            </div>

            <h1
                className="
          mt-7 text-2xl font-semibold
          tracking-tight
        "
            >
                Evaluating your architecture
            </h1>

            <p
                className="
          mt-3 max-w-lg text-sm
          leading-7 text-zinc-500
        "
            >
                Gemini is checking requirements coverage,
                scalability, reliability, data design and
                possible failure points.
            </p>

            <div
                className="
          mt-7 flex items-center gap-2
          text-xs text-zinc-600
        "
            >
                <Sparkles size={14} />
                This may take several seconds
            </div>
        </div>
    );
}

function FailedState({
                         message,
                         onRetry,
                         isRetrying,
                     }) {
    return (
        <div
            className="
        flex min-h-[65vh] flex-col
        items-center justify-center
        rounded-3xl border border-red-400/15
        bg-red-400/[0.035]
        px-6 text-center
      "
        >
            <CircleX
                size={38}
                className="text-red-300"
            />

            <h1
                className="
          mt-6 text-2xl font-semibold
        "
            >
                Evaluation failed
            </h1>

            <p
                className="
          mt-3 max-w-lg text-sm
          leading-7 text-zinc-500
        "
            >
                {message}
            </p>

            <button
                type="button"
                onClick={onRetry}
                disabled={isRetrying}
                className="
          mt-7 inline-flex items-center
          gap-2 rounded-xl bg-white
          px-5 py-3 text-sm font-semibold
          text-black transition
          hover:bg-zinc-200
          disabled:cursor-not-allowed
          disabled:opacity-50
        "
            >
                {isRetrying ? (
                    <LoaderCircle
                        size={16}
                        className="animate-spin"
                    />
                ) : (
                    <RefreshCw size={16} />
                )}

                Retry evaluation
            </button>
        </div>
    );
}

export default function AttemptFeedbackPage() {
    const { attemptId } = useParams();

    const [attempt, setAttempt] =
        useState(null);

    const [pageStatus, setPageStatus] =
        useState("loading");

    const [error, setError] =
        useState("");

    const [isRetrying, setIsRetrying] =
        useState(false);

    const evaluationStartedRef =
        useRef(false);

    const pollAttempt = useCallback(async () => {
        for (
            let pollNumber = 0;
            pollNumber < MAX_POLL_ATTEMPTS;
            pollNumber += 1
        ) {
            const currentAttempt =
                await api.getAttempt(attemptId);

            setAttempt(currentAttempt);

            if (
                currentAttempt.status === "COMPLETED"
                || currentAttempt.status === "FAILED"
            ) {
                return currentAttempt;
            }

            await wait(POLL_INTERVAL_MS);
        }

        throw new Error(
            "Evaluation is taking longer than expected. Refresh the page and check again.",
        );
    }, [attemptId]);

    const evaluateAttempt =
        useCallback(async () => {
            setPageStatus("evaluating");
            setError("");

            try {
                const evaluatedAttempt =
                    await api.evaluateAttempt(attemptId);

                setAttempt(evaluatedAttempt);

                if (
                    evaluatedAttempt.status === "COMPLETED"
                ) {
                    setPageStatus("success");
                    return;
                }

                const finalAttempt =
                    await pollAttempt();

                if (finalAttempt.status === "COMPLETED") {
                    setPageStatus("success");
                } else {
                    setError(
                        "The AI provider could not evaluate this attempt.",
                    );
                    setPageStatus("failed");
                }
            } catch (evaluationError) {
                /*
                 * The evaluation request may return 409 when
                 * another request already started evaluation.
                 *
                 * Fetch the latest state and recover.
                 */
                try {
                    const currentAttempt =
                        await api.getAttempt(attemptId);

                    setAttempt(currentAttempt);

                    if (
                        currentAttempt.status === "COMPLETED"
                    ) {
                        setPageStatus("success");
                        return;
                    }

                    if (
                        currentAttempt.status === "EVALUATING"
                    ) {
                        const finalAttempt =
                            await pollAttempt();

                        if (
                            finalAttempt.status === "COMPLETED"
                        ) {
                            setPageStatus("success");
                        } else {
                            setPageStatus("failed");
                        }

                        return;
                    }

                    setError(
                        evaluationError.message
                        ?? "AI evaluation failed",
                    );

                    setPageStatus("failed");
                } catch {
                    setError(
                        evaluationError.message
                        ?? "AI evaluation failed",
                    );

                    setPageStatus("failed");
                }
            }
        }, [
            attemptId,
            pollAttempt,
        ]);

    useEffect(() => {
        async function initializePage() {
            setPageStatus("loading");
            setError("");

            try {
                const currentAttempt =
                    await api.getAttempt(attemptId);

                setAttempt(currentAttempt);

                if (
                    currentAttempt.status === "COMPLETED"
                ) {
                    setPageStatus("success");
                    return;
                }

                if (
                    currentAttempt.status === "EVALUATING"
                ) {
                    setPageStatus("evaluating");

                    const finalAttempt =
                        await pollAttempt();

                    if (
                        finalAttempt.status === "COMPLETED"
                    ) {
                        setPageStatus("success");
                    } else {
                        setError(
                            "The evaluation could not be completed.",
                        );
                        setPageStatus("failed");
                    }

                    return;
                }

                if (
                    (
                        currentAttempt.status === "PENDING"
                        || currentAttempt.status === "FAILED"
                    )
                    && !evaluationStartedRef.current
                ) {
                    evaluationStartedRef.current = true;
                    await evaluateAttempt();
                }
            } catch (requestError) {
                setError(
                    requestError.message
                    ?? "Unable to load the attempt",
                );

                setPageStatus("failed");
            }
        }

        initializePage();
    }, [
        attemptId,
        evaluateAttempt,
        pollAttempt,
    ]);

    const retryEvaluation =
        useCallback(async () => {
            if (isRetrying) {
                return;
            }

            setIsRetrying(true);
            evaluationStartedRef.current = true;

            try {
                await evaluateAttempt();
            } finally {
                setIsRetrying(false);
            }
        }, [
            evaluateAttempt,
            isRetrying,
        ]);

    if (
        pageStatus === "loading"
        || pageStatus === "evaluating"
    ) {
        return <EvaluatingState />;
    }

    if (
        pageStatus === "failed"
        || !attempt
    ) {
        return (
            <FailedState
                message={
                    error
                    || "Unable to evaluate this attempt."
                }
                onRetry={retryEvaluation}
                isRetrying={isRetrying}
            />
        );
    }

    const feedback = attempt.feedback;

    if (!feedback) {
        return (
            <FailedState
                message="The attempt completed without feedback."
                onRetry={retryEvaluation}
                isRetrying={isRetrying}
            />
        );
    }

    return (
        <div>
            <Link
                to={
                    `/challenges/${attempt.challengeSlug}`
                    + "/workspace"
                }
                className="
          inline-flex items-center gap-2
          text-sm text-zinc-400
          transition hover:text-white
        "
            >
                <ArrowLeft size={15} />
                Back to workspace
            </Link>

            <header
                className="
          mt-7 overflow-hidden rounded-3xl
          border border-white/10
          bg-white/[0.035] p-7
          sm:p-10
        "
            >
                <div
                    className="
            flex flex-col justify-between
            gap-8 lg:flex-row
            lg:items-center
          "
                >
                    <div className="max-w-2xl">
                        <div
                            className="
                inline-flex items-center gap-2
                rounded-full
                border border-violet-400/15
                bg-violet-400/[0.07]
                px-3 py-1.5
                text-sm text-violet-300
              "
                        >
                            <BrainCircuit size={15} />
                            AI architecture review
                        </div>

                        <h1
                            className="
                mt-5 text-3xl font-semibold
                tracking-tight sm:text-5xl
              "
                        >
                            Your system-design feedback
                        </h1>

                        <p
                            className="
                mt-4 max-w-xl text-sm
                leading-7 text-zinc-500
              "
                        >
                            The result combines deterministic
                            backend checks with structured AI
                            evaluation.
                        </p>
                    </div>

                    <div
                        className="
              flex size-40 shrink-0
              flex-col items-center
              justify-center rounded-full
              border-8 border-violet-400/15
              bg-violet-400/[0.05]
            "
                    >
            <span
                className="
                text-5xl font-semibold
                text-violet-300
              "
            >
              {feedback.overallScore}
            </span>

                        <span
                            className="
                mt-1 text-xs uppercase
                tracking-[0.2em]
                text-zinc-500
              "
                        >
              Overall
            </span>
                    </div>
                </div>
            </header>

            <section
                className="
          mt-6 grid gap-4
          sm:grid-cols-2 xl:grid-cols-4
        "
            >
                <ScoreCard
                    title="Requirements"
                    score={
                        feedback.requirementsCoverageScore
                    }
                    icon={Target}
                />

                <ScoreCard
                    title="Scalability"
                    score={feedback.scalabilityScore}
                    icon={Gauge}
                />

                <ScoreCard
                    title="Reliability"
                    score={feedback.reliabilityScore}
                    icon={ShieldCheck}
                />

                <ScoreCard
                    title="Data design"
                    score={feedback.dataDesignScore}
                    icon={Database}
                />
            </section>

            <section
                className="
          mt-6 grid gap-4 lg:grid-cols-2
        "
            >
                <FeedbackList
                    title="What you did well"
                    items={feedback.strengths}
                    icon={CheckCircle2}
                    variant="positive"
                />

                <FeedbackList
                    title="Critical problems"
                    items={feedback.criticalIssues}
                    icon={AlertTriangle}
                    variant="negative"
                />

                <FeedbackList
                    title="Recommendations"
                    items={feedback.recommendations}
                    icon={Lightbulb}
                    variant="neutral"
                />

                {feedback.missingComponents?.length > 0 && (
                    <section
                        className="
              rounded-2xl border
              border-amber-400/15
              bg-amber-400/[0.04] p-6
            "
                    >
                        <div className="flex items-center gap-3">
                            <Network
                                size={20}
                                className="text-amber-300"
                            />

                            <h2 className="font-semibold">
                                Missing components
                            </h2>
                        </div>

                        <div className="mt-5 space-y-4">
                            {feedback.missingComponents.map(
                                (component) => (
                                    <article
                                        key={component.componentType}
                                        className="
                      rounded-xl border
                      border-white/8
                      bg-black/10 p-4
                    "
                                    >
                                        <h3
                                            className="
                        text-sm font-semibold
                        text-amber-200
                      "
                                        >
                                            {component.label}
                                        </h3>

                                        <p
                                            className="
                        mt-2 text-sm leading-6
                        text-zinc-500
                      "
                                        >
                                            {component.reason}
                                        </p>
                                    </article>
                                ),
                            )}
                        </div>
                    </section>
                )}
            </section>

            <section
                className="
          mt-4 rounded-2xl
          border border-violet-400/15
          bg-violet-400/[0.04] p-6
        "
            >
                <div className="flex items-center gap-3">
                    <Network
                        size={20}
                        className="text-violet-300"
                    />

                    <h2 className="font-semibold">
                        Improved architecture
                    </h2>
                </div>

                <p
                    className="
            mt-5 whitespace-pre-wrap
            text-sm leading-8 text-zinc-300
          "
                >
                    {feedback.improvedArchitecture}
                </p>
            </section>

            <section
                className="
          mt-4 rounded-2xl
          border border-sky-400/15
          bg-sky-400/[0.04] p-6
        "
            >
                <div className="flex items-center gap-3">
                    <Sparkles
                        size={20}
                        className="text-sky-300"
                    />

                    <h2 className="font-semibold">
                        Follow-up interview question
                    </h2>
                </div>

                <p
                    className="
            mt-5 text-lg leading-8
            text-zinc-200
          "
                >
                    {feedback.followUpQuestion}
                </p>
            </section>

            {attempt.checks?.warnings?.length > 0 && (
                <section
                    className="
            mt-4 rounded-2xl border
            border-amber-400/15
            bg-amber-400/[0.03] p-6
          "
                >
                    <h2 className="font-semibold">
                        Structural warnings
                    </h2>

                    <ul
                        className="
              mt-4 list-disc space-y-2
              pl-5 text-sm text-zinc-500
            "
                    >
                        {attempt.checks.warnings.map(
                            (warning) => (
                                <li key={warning}>
                                    {warning}
                                </li>
                            ),
                        )}
                    </ul>
                </section>
            )}
        </div>
    );
}