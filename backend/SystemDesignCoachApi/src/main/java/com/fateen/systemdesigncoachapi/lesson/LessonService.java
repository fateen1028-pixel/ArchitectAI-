package com.fateen.systemdesigncoachapi.lesson;


import com.fateen.systemdesigncoachapi.lesson.Lesson;
import com.fateen.systemdesigncoachapi.lesson.LessonDetailResponse;
import com.fateen.systemdesigncoachapi.lesson.LessonRepository;
import com.fateen.systemdesigncoachapi.lesson.LessonSummaryResponse;
import com.fateen.systemdesigncoachapi.topic.TopicRepository;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

import java.util.List;

@Service
@Transactional(readOnly = true)
public class LessonService {

    private final LessonRepository lessonRepository;
    private final TopicRepository topicRepository;

    public LessonService(
            LessonRepository lessonRepository,
            TopicRepository topicRepository
    ) {
        this.lessonRepository = lessonRepository;
        this.topicRepository = topicRepository;
    }

    public List<LessonSummaryResponse> getTopicLessons(
            String topicSlug
    ) {
        verifyTopicExists(topicSlug);

        return lessonRepository
                .findAllByTopicSlugOrderByDisplayOrderAsc(
                        topicSlug
                )
                .stream()
                .map(LessonSummaryResponse::from)
                .toList();
    }

    public LessonDetailResponse getLesson(
            String topicSlug,
            String lessonSlug
    ) {
        Lesson lesson = lessonRepository
                .findByTopicSlugAndSlug(
                        topicSlug,
                        lessonSlug
                )
                .orElseThrow(() ->
                        new ResponseStatusException(
                                HttpStatus.NOT_FOUND,
                                "Lesson not found"
                        )
                );

        return LessonDetailResponse.from(lesson);
    }

    private void verifyTopicExists(
            String topicSlug
    ) {
        if (!topicRepository.existsBySlug(topicSlug)) {
            throw new ResponseStatusException(
                    HttpStatus.NOT_FOUND,
                    "Topic not found"
            );
        }
    }
}