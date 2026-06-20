package com.fateen.systemdesigncoachapi.lesson;

import com.fateen.systemdesigncoachapi.lesson.Lesson;

public record LessonSummaryResponse(
        Long id,
        String title,
        String slug,
        String summary,
        Integer estimatedMinutes,
        Integer displayOrder
) {

    public static LessonSummaryResponse from(
            Lesson lesson
    ) {
        return new LessonSummaryResponse(
                lesson.getId(),
                lesson.getTitle(),
                lesson.getSlug(),
                lesson.getSummary(),
                lesson.getEstimatedMinutes(),
                lesson.getDisplayOrder()
        );
    }
}