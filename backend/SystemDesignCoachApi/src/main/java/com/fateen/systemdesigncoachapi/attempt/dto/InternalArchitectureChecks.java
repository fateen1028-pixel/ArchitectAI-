package com.fateen.systemdesigncoachapi.attempt.dto;

import java.util.List;

public record InternalArchitectureChecks(
        List<com.fateen.systemdesigncoachapi.attempt.dto.MissingExpectedComponent> missingExpectedComponents,
        boolean containsClient,
        boolean containsPersistentStorage
) {
}