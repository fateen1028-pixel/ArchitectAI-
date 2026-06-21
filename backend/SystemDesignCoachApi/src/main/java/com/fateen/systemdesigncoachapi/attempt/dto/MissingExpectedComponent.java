package com.fateen.systemdesigncoachapi.attempt.dto;

public record MissingExpectedComponent(
        String componentType,
        String label,
        String reason
) {
}