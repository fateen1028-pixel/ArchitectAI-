package com.fateen.systemdesigncoachapi.lesson;

import com.fateen.systemdesigncoachapi.lesson.Lesson;

public record LessonDetailResponse(
        Long id,
        Long topicId,
        String topicName,
        String topicSlug,
        String title,
        String slug,
        String summary,
        String content,
        Integer estimatedMinutes,
        Integer displayOrder
) {

    public static LessonDetailResponse from(
            Lesson lesson
    ) {
        return new LessonDetailResponse(
                lesson.getId(),
                lesson.getTopic().getId(),
                lesson.getTopic().getName(),
                lesson.getTopic().getSlug(),
                lesson.getTitle(),
                lesson.getSlug(),
                lesson.getSummary(),
                lesson.getContent(),
                lesson.getEstimatedMinutes(),
                lesson.getDisplayOrder()
        );
    }
}