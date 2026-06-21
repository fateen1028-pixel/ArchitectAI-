const API_URL = import.meta.env.VITE_API_URL;

if (!API_URL) {
    throw new Error(
        "VITE_API_URL is not configured",
    );
}

async function request(path, options = {}) {
    const response = await fetch(
        `${API_URL}${path}`,
        {
            ...options,
            headers: {
                "Content-Type": "application/json",
                ...options.headers,
            },
        },
    );

    if (!response.ok) {
        let message = "Request failed";

        try {
            const errorBody = await response.json();

            message =
                errorBody.detail
                ?? errorBody.message
                ?? message;
        } catch {
            // The server did not return JSON.
        }

        throw new Error(
            `${message} (${response.status})`,
        );
    }

    if (response.status === 204) {
        return null;
    }

    return response.json();
}

export const api = {
    getTopics() {
        return request("/api/topics");
    },

    getTopicLessons(topicSlug) {
        return request(
            `/api/topics/${encodeURIComponent(topicSlug)}/lessons`,
        );
    },

    getLesson(topicSlug, lessonSlug) {
        return request(
            `/api/topics/${encodeURIComponent(topicSlug)}/lessons/`
            + encodeURIComponent(lessonSlug),
        );
    },

    getChallenges() {
        return request("/api/challenges");
    },

    getChallenge(challengeSlug) {
        return request(
            `/api/challenges/${encodeURIComponent(challengeSlug)}`,
        );
    },

    submitAttempt(challengeSlug, attempt) {
        return request(
            `/api/challenges/${
                encodeURIComponent(challengeSlug)
            }/attempts`,
            {
                method: "POST",
                body: JSON.stringify(attempt),
            },
        );
    },

    getAttempt(attemptId) {
        return request(
            `/api/attempts/${encodeURIComponent(attemptId)}`,
        );
    },

    evaluateAttempt(attemptId) {
        return request(
            `/api/attempts/${
                encodeURIComponent(attemptId)
            }/evaluate`,
            {
                method: "POST",
            },
        );
    },
};