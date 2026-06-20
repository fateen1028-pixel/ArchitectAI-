import {
    ArrowLeft,
    Clock3,
    LockKeyhole,
    Play,
} from "lucide-react";
import {
    Link,
    useParams,
} from "react-router";
import {
    useCallback,
    useEffect,
    useState,
} from "react";

import { api } from "../api/apiClient.js";
import DifficultyBadge
    from "../components/DifficultyBadge.jsx";
import ErrorState
    from "../components/ErrorState.jsx";
import LoadingState
    from "../components/LoadingState.jsx";

function RequirementList({
                             title,
                             requirements,
                         }) {
    return (
        <section
            className="
        rounded-2xl border border-white/8
        bg-white/[0.025] p-6
      "
        >
            <h2 className="font-semibold">
                {title}
            </h2>

            <ul className="mt-5 space-y-3">
                {requirements.map((requirement) => (
                    <li
                        key={requirement}
                        className="
              flex gap-3 text-sm
              leading-6 text-zinc-400
            "
                    >
            <span
                className="
                mt-2 size-1.5 shrink-0
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

export default function ChallengeDetailPage() {
    const { challengeSlug } = useParams();

    const [challenge, setChallenge] =
        useState(null);
    const [status, setStatus] =
        useState("loading");
    const [error, setError] =
        useState("");

    const loadChallenge =
        useCallback(async () => {
            setStatus("loading");
            setError("");

            try {
                const data =
                    await api.getChallenge(challengeSlug);

                setChallenge(data);
                setStatus("success");
            } catch (requestError) {
                setError(requestError.message);
                setStatus("error");
            }
        }, [challengeSlug]);

    useEffect(() => {
        loadChallenge();
    }, [loadChallenge]);

    if (status === "loading") {
        return (
            <LoadingState
                message="Loading challenge..."
            />
        );
    }

    if (status === "error") {
        return (
            <ErrorState
                message={error}
                onRetry={loadChallenge}
            />
        );
    }

    return (
        <div>
            <Link
                to="/challenges"
                className="
          inline-flex items-center gap-2
          text-sm text-zinc-400
          transition hover:text-white
        "
            >
                <ArrowLeft size={15} />
                All challenges
            </Link>

            <header
                className="
          mt-8 rounded-3xl
          border border-white/10
          bg-white/[0.035] p-7
          sm:p-10
        "
            >
                <div
                    className="
            flex flex-wrap items-center gap-3
          "
                >
                    <DifficultyBadge
                        difficulty={challenge.difficulty}
                    />

                    <span
                        className="
              flex items-center gap-1.5
              text-sm text-zinc-500
            "
                    >
            <Clock3 size={14} />
                        {challenge.estimatedMinutes} minutes
          </span>
                </div>

                <h1
                    className="
            mt-5 text-3xl font-semibold
            tracking-tight sm:text-5xl
          "
                >
                    {challenge.title}
                </h1>

                <p
                    className="
            mt-5 max-w-3xl leading-8
            text-zinc-400
          "
                >
                    {challenge.description}
                </p>

                <Link
                    to={`/challenges/${challenge.slug}/workspace`}
                    className="
    mt-8 inline-flex items-center gap-2
    rounded-xl bg-white px-5 py-3
    text-sm font-semibold text-black
    transition hover:bg-zinc-200
  "
                >
                    <Play size={16} />
                    Open design workspace
                </Link>
            </header>

            <div
                className="
          mt-6 grid gap-4 lg:grid-cols-2
        "
            >
                <RequirementList
                    title="Functional requirements"
                    requirements={
                        challenge.functionalRequirements
                    }
                />

                <RequirementList
                    title="Non-functional requirements"
                    requirements={
                        challenge.nonFunctionalRequirements
                    }
                />
            </div>

            <div
                className="
          mt-4 flex items-start gap-3
          rounded-2xl border
          border-violet-400/15
          bg-violet-400/[0.05] p-5
        "
            >
                <LockKeyhole
                    size={18}
                    className="
            mt-0.5 shrink-0
            text-violet-300
          "
                />

                <div>
                    <h2 className="text-sm font-semibold">
                        Evaluation rubric is private
                    </h2>

                    <p
                        className="
              mt-1 text-sm leading-6
              text-zinc-500
            "
                    >
                        The recommended components are stored only
                        on the backend. They will be used later to
                        evaluate your submitted architecture.
                    </p>
                </div>
            </div>
        </div>
    );
}