package com.fateen.systemdesigncoachapi.attempt;

import com.fateen.systemdesigncoachapi.attempt.dto.*;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.net.URI;
import java.util.UUID;

@RestController
public class AttemptController {

    private final AttemptService attemptService;
    private final AttemptEvaluationService
            attemptEvaluationService;

    public AttemptController(
            AttemptService attemptService,
            AttemptEvaluationService
                    attemptEvaluationService
    ) {
        this.attemptService = attemptService;
        this.attemptEvaluationService =
                attemptEvaluationService;
    }

    @PostMapping(
            "/api/challenges/{challengeSlug}/attempts"
    )
    public ResponseEntity<AttemptResponse>
    submitAttempt(
            @PathVariable String challengeSlug,
            @Valid @RequestBody
            SubmitAttemptRequest request
    ) {
        AttemptResponse response =
                attemptService.submit(
                        challengeSlug,
                        request
                );

        return ResponseEntity
                .created(
                        URI.create(
                                "/api/attempts/"
                                        + response.id()
                        )
                )
                .body(response);
    }

    @GetMapping("/api/attempts/{attemptId}")
    public ResponseEntity<AttemptDetailResponse>
    getAttempt(
            @PathVariable UUID attemptId
    ) {
        return ResponseEntity.ok(
                attemptService.getAttempt(attemptId)
        );
    }

    @PostMapping(
            "/api/attempts/{attemptId}/evaluate"
    )
    public ResponseEntity<AttemptDetailResponse>
    evaluateAttempt(
            @PathVariable UUID attemptId
    ) {
        return ResponseEntity.ok(
                attemptEvaluationService.evaluate(
                        attemptId
                )
        );
    }
}