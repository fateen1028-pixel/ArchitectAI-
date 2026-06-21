package com.fateen.systemdesigncoachapi.attempt;

import com.fateen.systemdesigncoachapi.ai.EvaluationContext;
import com.fateen.systemdesigncoachapi.ai.EvaluationFeedback;
import com.fateen.systemdesigncoachapi.ai.SystemDesignAiService;
import com.fateen.systemdesigncoachapi.attempt.dto.AttemptDetailResponse;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import java.util.UUID;

@Service
public class AttemptEvaluationService {

    private static final Logger logger =
            LoggerFactory.getLogger(
                    AttemptEvaluationService.class
            );

    private final AttemptEvaluationStateService
            stateService;

    private final SystemDesignAiService aiService;
    private final AttemptService attemptService;

    public AttemptEvaluationService(
            AttemptEvaluationStateService
                    stateService,
            SystemDesignAiService aiService,
            AttemptService attemptService
    ) {
        this.stateService = stateService;
        this.aiService = aiService;
        this.attemptService = attemptService;
    }

    public AttemptDetailResponse evaluate(
            UUID attemptId
    ) {
        EvaluationContext context =
                stateService.beginEvaluation(
                        attemptId
                );

        try {
            EvaluationFeedback feedback =
                    aiService.evaluate(context);

            stateService.completeEvaluation(
                    attemptId,
                    feedback
            );

            return attemptService.getAttempt(
                    attemptId
            );

        } catch (ResponseStatusException exception) {
            stateService.failEvaluation(attemptId);
            throw exception;

        } catch (Exception exception) {
            logger.error(
                    "AI evaluation failed for attempt {}",
                    attemptId,
                    exception
            );

            stateService.failEvaluation(attemptId);

            throw new ResponseStatusException(
                    HttpStatus.BAD_GATEWAY,
                    "AI evaluation failed. Retry the attempt.",
                    exception
            );
        }
    }
}