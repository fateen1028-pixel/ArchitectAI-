package com.fateen.systemdesigncoachapi.ai;

import tools.jackson.databind.JsonNode;
import com.fateen.systemdesigncoachapi.attempt.dto.MissingExpectedComponent;

import java.util.List;
import java.util.UUID;

public record EvaluationContext(
        UUID attemptId,
        String challengeTitle,
        String challengeDescription,
        List<String> functionalRequirements,
        List<String> nonFunctionalRequirements,
        List<MissingExpectedComponent> missingExpectedComponents,
        boolean containsClient,
        boolean containsPersistentStorage,
        JsonNode design,
        String explanation
) {
}