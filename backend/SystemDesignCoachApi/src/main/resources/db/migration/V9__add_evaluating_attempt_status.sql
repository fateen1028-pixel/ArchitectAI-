ALTER TABLE attempts
DROP CONSTRAINT chk_attempt_status;

ALTER TABLE attempts
    ADD CONSTRAINT chk_attempt_status
        CHECK (
            status IN (
                       'PENDING',
                       'EVALUATING',
                       'COMPLETED',
                       'FAILED'
                )
            );