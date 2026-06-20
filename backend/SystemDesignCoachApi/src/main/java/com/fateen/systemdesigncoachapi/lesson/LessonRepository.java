package com.fateen.systemdesigncoachapi.lesson;

import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface LessonRepository
        extends JpaRepository<Lesson, Long> {

    List<Lesson>
    findAllByTopicSlugOrderByDisplayOrderAsc(
            String topicSlug
    );

    Optional<Lesson>
    findByTopicSlugAndSlug(
            String topicSlug,
            String lessonSlug
    );
}
