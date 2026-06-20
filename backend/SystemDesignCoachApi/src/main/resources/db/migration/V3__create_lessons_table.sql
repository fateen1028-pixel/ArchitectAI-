CREATE TABLE lessons
(
    id                BIGSERIAL PRIMARY KEY,
    topic_id          BIGINT       NOT NULL,
    title             VARCHAR(150) NOT NULL,
    slug              VARCHAR(150) NOT NULL,
    summary           VARCHAR(500) NOT NULL,
    content           TEXT         NOT NULL,
    estimated_minutes INTEGER      NOT NULL,
    display_order     INTEGER      NOT NULL,
    created_at        TIMESTAMPTZ  NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT fk_lessons_topic
        FOREIGN KEY (topic_id)
            REFERENCES topics (id)
            ON DELETE CASCADE,

    CONSTRAINT uq_lesson_topic_slug
        UNIQUE (topic_id, slug),

    CONSTRAINT uq_lesson_topic_display_order
        UNIQUE (topic_id, display_order),

    CONSTRAINT chk_lesson_estimated_minutes
        CHECK (estimated_minutes > 0),

    CONSTRAINT chk_lesson_display_order
        CHECK (display_order > 0)
);