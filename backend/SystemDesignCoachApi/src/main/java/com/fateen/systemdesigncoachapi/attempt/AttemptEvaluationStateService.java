package com.fateen.systemdesigncoachapi.attempt;

import tools.jackson.databind.ObjectMapper;
import com.fateen.systemdesigncoachapi.ai.EvaluationContext;
import com.fateen.systemdesigncoachapi.ai.EvaluationFeedback;
import com.fateen.systemdesigncoachapi.attempt.dto.InternalArchitectureChecks;
import com.fateen.systemdesigncoachapi.challenge.Challenge;
import com.fateen.systemdesigncoachapi.challenge.ChallengeRequirement;
import com.fateen.systemdesigncoachapi.challenge.RequirementType;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

import java.util.List;
import java.util.UUID;

@Service
public class AttemptEvaluationStateService {

    private final AttemptRepository attemptRepository;
    private final ObjectMapper objectMapper;

    public AttemptEvaluationStateService(
            AttemptRepository attemptRepository,
            ObjectMapper objectMapper
    ) {
        this.attemptRepository =
                attemptRepository;

        this.objectMapper =
                objectMapper;
    }

    @Transactional
    public EvaluationContext beginEvaluation(
            UUID attemptId
    ) {
        Attempt attempt = attemptRepository
                .findByIdForUpdate(attemptId)
                .orElseThrow(() ->
                        new ResponseStatusException(
                                HttpStatus.NOT_FOUND,
                                "Attempt not found"
                        )
                );

        if (
                attempt.getStatus()
                        == AttemptStatus.COMPLETED
        ) {
            throw new ResponseStatusException(
                    HttpStatus.CONFLICT,
                    "Attempt has already been evaluated"
            );
        }

        if (
                attempt.getStatus()
                        == AttemptStatus.EVALUATING
        ) {
            throw new ResponseStatusException(
                    HttpStatus.CONFLICT,
                    "Attempt evaluation is already running"
            );
        }

        /*
         * FAILED attempts are allowed to retry.
         */
        attempt.markEvaluating();

        Challenge challenge =
                attempt.getChallenge();

        List<String> functionalRequirements =
                challenge.getRequirements()
                        .stream()
                        .filter(requirement ->
                                requirement
                                        .getRequirementType()
                                        == RequirementType
                                        .FUNCTIONAL
                        )
                        .map(
                                ChallengeRequirement
                                        ::getDescription
                        )
                        .toList();

        List<String> nonFunctionalRequirements =
                challenge.getRequirements()
                        .stream()
                        .filter(requirement ->
                                requirement
                                        .getRequirementType()
                                        == RequirementType
                                        .NON_FUNCTIONAL
                        )
                        .map(
                                ChallengeRequirement
                                        ::getDescription
                        )
                        .toList();

        InternalArchitectureChecks internalChecks =
                objectMapper.convertValue(
                        attempt.getInternalChecksJson(),
                        InternalArchitectureChecks.class
                );

        return new EvaluationContext(
                attempt.getId(),
                challenge.getTitle(),
                challenge.getDescription(),
                functionalRequirements,
                nonFunctionalRequirements,
                internalChecks
                        .missingExpectedComponents(),
                internalChecks.containsClient(),
                internalChecks
                        .containsPersistentStorage(),
                attempt.getDesignJson(),
                attempt.getExplanation()
        );
    }

    @Transactional
    public void completeEvaluation(
            UUID attemptId,
            EvaluationFeedback feedback
    ) {
        Attempt attempt = attemptRepository
                .findByIdForUpdate(attemptId)
                .orElseThrow(() ->
                        new ResponseStatusException(
                                HttpStatus.NOT_FOUND,
                                "Attempt not found"
                        )
                );

        if (
                attempt.getStatus()
                        != AttemptStatus.EVALUATING
        ) {
            throw new ResponseStatusException(
                    HttpStatus.CONFLICT,
                    "Attempt is not currently evaluating"
            );
        }

        attempt.markCompleted(
                feedback.overallScore(),
                objectMapper.valueToTree(feedback)
        );
    }

    @Transactional
    public void failEvaluation(
            UUID attemptId
    ) {
        Attempt attempt = attemptRepository
                .findByIdForUpdate(attemptId)
                .orElse(null);

        if (
                attempt != null
                        && attempt.getStatus()
                        == AttemptStatus.EVALUATING
        ) {
            attempt.markFailed();
        }
    }
}