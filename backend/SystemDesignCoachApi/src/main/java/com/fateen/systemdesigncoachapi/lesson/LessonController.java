package com.fateen.systemdesigncoachapi.lesson;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping(
        "/api/topics/{topicSlug}/lessons"
)
public class LessonController {

    private final LessonService lessonService;

    public LessonController(
            LessonService lessonService
    ) {
        this.lessonService = lessonService;
    }

    @GetMapping
    public ResponseEntity<List<LessonSummaryResponse>>
    getTopicLessons(
            @PathVariable String topicSlug
    ) {
        return ResponseEntity.ok(
                lessonService.getTopicLessons(topicSlug)
        );
    }

    @GetMapping("/{lessonSlug}")
    public ResponseEntity<LessonDetailResponse>
    getLesson(
            @PathVariable String topicSlug,
            @PathVariable String lessonSlug
    ) {
        return ResponseEntity.ok(
                lessonService.getLesson(
                        topicSlug,
                        lessonSlug
                )
        );
    }
}