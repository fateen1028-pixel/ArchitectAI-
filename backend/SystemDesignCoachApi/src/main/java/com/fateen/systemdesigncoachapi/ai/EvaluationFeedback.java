package com.fateen.systemdesigncoachapi.ai;

import com.fateen.systemdesigncoachapi.attempt.dto.MissingExpectedComponent;

import java.util.List;

public record EvaluationFeedback(
        int overallScore,
        int requirementsCoverageScore,
        int scalabilityScore,
        int reliabilityScore,
        int dataDesignScore,
        List<String> strengths,
        List<String> criticalIssues,
        List<MissingExpectedComponent> missingComponents,
        List<String> recommendations,
        String improvedArchitecture,
        String followUpQuestion
) {
}