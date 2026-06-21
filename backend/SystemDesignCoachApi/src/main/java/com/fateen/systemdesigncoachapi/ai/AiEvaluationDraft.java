package com.fateen.systemdesigncoachapi.ai;

import com.fasterxml.jackson.annotation.JsonPropertyDescription;

import java.util.List;

public record AiEvaluationDraft(

        @JsonPropertyDescription(
                "Integer score from 0 to 100 for functional "
                        + "and non-functional requirements coverage."
        )
        Integer requirementsCoverageScore,

        @JsonPropertyDescription(
                "Integer score from 0 to 100 for scalability, "
                        + "traffic handling and bottlenecks."
        )
        Integer scalabilityScore,

        @JsonPropertyDescription(
                "Integer score from 0 to 100 for reliability, "
                        + "availability and failure handling."
        )
        Integer reliabilityScore,

        @JsonPropertyDescription(
                "Integer score from 0 to 100 for storage choices, "
                        + "data flow, consistency and persistence."
        )
        Integer dataDesignScore,

        @JsonPropertyDescription(
                "Exactly 3 specific strengths in the submitted design. "
                        + "Each item must be no more than 35 words."
        )
        List<String> strengths,

        @JsonPropertyDescription(
                "Between 1 and 4 critical technical problems. "
                        + "Each item must be no more than 35 words."
        )
        List<String> criticalIssues,

        @JsonPropertyDescription(
                "Exactly 3 concrete improvements for the design. "
                        + "Each item must be no more than 35 words."
        )
        List<String> recommendations,

        @JsonPropertyDescription(
                "A concise improved architecture flow containing "
                        + "no more than 180 words."
        )
        String improvedArchitecture,

        @JsonPropertyDescription(
                "Exactly one concise technical follow-up question "
                        + "that tests deeper system-design understanding."
        )
        String followUpQuestion
) {
}