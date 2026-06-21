package com.fateen.systemdesigncoachapi.ai;

import com.fateen.systemdesigncoachapi.attempt.dto.MissingExpectedComponent;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Objects;

@Service
public class EvaluationValidationService {

    public EvaluationFeedback validateAndBuild(
            AiEvaluationDraft draft,
            List<MissingExpectedComponent>
                    missingExpectedComponents
    ) {
        if (draft == null) {
            throw new IllegalArgumentException(
                    "AI returned no evaluation"
            );
        }

        int requirementsScore = validateScore(
                draft.requirementsCoverageScore(),
                "requirementsCoverageScore"
        );

        int scalabilityScore = validateScore(
                draft.scalabilityScore(),
                "scalabilityScore"
        );

        int reliabilityScore = validateScore(
                draft.reliabilityScore(),
                "reliabilityScore"
        );

        int dataDesignScore = validateScore(
                draft.dataDesignScore(),
                "dataDesignScore"
        );

        List<String> strengths = validateList(
                draft.strengths(),
                "strengths",
                2,
                5
        );

        List<String> criticalIssues = validateList(
                draft.criticalIssues(),
                "criticalIssues",
                1,
                5
        );

        List<String> recommendations = validateList(
                draft.recommendations(),
                "recommendations",
                2,
                5
        );

        String improvedArchitecture = validateText(
                draft.improvedArchitecture(),
                "improvedArchitecture",
                20,
                1500
        );

        String followUpQuestion = validateText(
                draft.followUpQuestion(),
                "followUpQuestion",
                10,
                500
        );

        int overallScore = calculateOverallScore(
                requirementsScore,
                scalabilityScore,
                reliabilityScore,
                dataDesignScore
        );

        return new EvaluationFeedback(
                overallScore,
                requirementsScore,
                scalabilityScore,
                reliabilityScore,
                dataDesignScore,
                strengths,
                criticalIssues,
                List.copyOf(missingExpectedComponents),
                recommendations,
                improvedArchitecture,
                followUpQuestion
        );
    }

    private int validateScore(
            Integer score,
            String fieldName
    ) {
        if (score == null) {
            throw new IllegalArgumentException(
                    fieldName + " is missing"
            );
        }

        if (score < 0 || score > 100) {
            throw new IllegalArgumentException(
                    fieldName
                            + " must be between 0 and 100"
            );
        }

        return score;
    }

    private List<String> validateList(
            List<String> values,
            String fieldName,
            int minimumSize,
            int maximumSize
    ) {
        if (values == null) {
            throw new IllegalArgumentException(
                    fieldName + " is missing"
            );
        }

        List<String> cleanedValues = values
                .stream()
                .filter(Objects::nonNull)
                .map(String::trim)
                .filter(value -> !value.isBlank())
                .distinct()
                .toList();

        if (
                cleanedValues.size() < minimumSize
                        || cleanedValues.size() > maximumSize
        ) {
            throw new IllegalArgumentException(
                    fieldName
                            + " must contain between "
                            + minimumSize
                            + " and "
                            + maximumSize
                            + " items"
            );
        }

        boolean containsOversizedValue =
                cleanedValues.stream()
                        .anyMatch(value ->
                                value.length() > 500
                        );

        if (containsOversizedValue) {
            throw new IllegalArgumentException(
                    fieldName
                            + " contains an oversized item"
            );
        }

        return cleanedValues;
    }

    private String validateText(
            String value,
            String fieldName,
            int minimumLength,
            int maximumLength
    ) {
        if (value == null) {
            throw new IllegalArgumentException(
                    fieldName + " is missing"
            );
        }

        String cleanedValue = value.trim();

        if (
                cleanedValue.length() < minimumLength
                        || cleanedValue.length()
                        > maximumLength
        ) {
            throw new IllegalArgumentException(
                    fieldName
                            + " has an invalid length"
            );
        }

        return cleanedValue;
    }

    private int calculateOverallScore(
            int requirements,
            int scalability,
            int reliability,
            int dataDesign
    ) {
        double weightedScore =
                requirements * 0.30
                        + scalability * 0.25
                        + reliability * 0.25
                        + dataDesign * 0.20;

        return (int) Math.round(weightedScore);
    }
}