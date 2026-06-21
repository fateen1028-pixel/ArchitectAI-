package com.fateen.systemdesigncoachapi.attempt;

import com.fateen.systemdesigncoachapi.challenge.Challenge;
import jakarta.persistence.*;
import lombok.Getter;
import org.hibernate.annotations.JdbcTypeCode;
import org.hibernate.type.SqlTypes;
import tools.jackson.databind.JsonNode;

import java.time.Instant;
import java.util.UUID;

@Entity
@Table(name = "attempts")
public class Attempt {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @ManyToOne(
            fetch = FetchType.LAZY,
            optional = false
    )
    @JoinColumn(
            name = "challenge_id",
            nullable = false
    )
    private Challenge challenge;

    @JdbcTypeCode(SqlTypes.JSON)
    @Column(
            name = "design_json",
            nullable = false,
            columnDefinition = "jsonb"
    )
    private tools.jackson.databind.JsonNode designJson;

    @Column(
            nullable = false,
            columnDefinition = "TEXT"
    )
    private String explanation;

    @Getter
    @JdbcTypeCode(SqlTypes.JSON)
    @Column(
            name = "public_checks_json",
            nullable = false,
            columnDefinition = "jsonb"
    )
    private tools.jackson.databind.JsonNode publicChecksJson;

    @Getter
    @JdbcTypeCode(SqlTypes.JSON)
    @Column(
            name = "internal_checks_json",
            nullable = false,
            columnDefinition = "jsonb"
    )
    private tools.jackson.databind.JsonNode internalChecksJson;

    @Getter
    @Enumerated(EnumType.STRING)
    @Column(
            nullable = false,
            length = 30
    )
    private AttemptStatus status;

    @Getter
    private Integer score;

    @Getter
    @JdbcTypeCode(SqlTypes.JSON)
    @Column(
            name = "feedback_json",
            columnDefinition = "jsonb"
    )
    private tools.jackson.databind.JsonNode feedbackJson;

    @Getter
    @Column(
            name = "created_at",
            nullable = false,
            updatable = false
    )
    private Instant createdAt;

    @Column(
            name = "updated_at",
            nullable = false
    )
    private Instant updatedAt;

    protected Attempt() {
        // Required by JPA
    }

    public Attempt(
            Challenge challenge,
            tools.jackson.databind.JsonNode designJson,
            String explanation,
            tools.jackson.databind.JsonNode publicChecksJson,
            tools.jackson.databind.JsonNode internalChecksJson
    ) {
        this.challenge = challenge;
        this.designJson = designJson;
        this.explanation = explanation;
        this.publicChecksJson = publicChecksJson;
        this.internalChecksJson = internalChecksJson;
        this.status = AttemptStatus.PENDING;
    }

    @PrePersist
    void prePersist() {
        Instant now = Instant.now();

        createdAt = now;
        updatedAt = now;
    }

    @PreUpdate
    void preUpdate() {
        updatedAt = Instant.now();
    }

    public void markCompleted(
            int score,
            tools.jackson.databind.JsonNode feedbackJson
    ) {
        this.score = score;
        this.feedbackJson = feedbackJson;
        this.status = AttemptStatus.COMPLETED;
    }

    public void markFailed() {
        this.status = AttemptStatus.FAILED;
    }

    public UUID getId() {
        return id;
    }

    public Challenge getChallenge() {
        return challenge;
    }

    public tools.jackson.databind.JsonNode getDesignJson() {
        return designJson;
    }

    public String getExplanation() {
        return explanation;
    }

    public void markEvaluating() {
        this.status = AttemptStatus.EVALUATING;
    }


}