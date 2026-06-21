package com.fateen.systemdesigncoachapi.attempt;

import jakarta.persistence.LockModeType;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Lock;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.Optional;
import java.util.UUID;

public interface AttemptRepository
        extends JpaRepository<Attempt, UUID> {

    @Lock(LockModeType.PESSIMISTIC_WRITE)
    @Query("""
            SELECT attempt
            FROM Attempt attempt
            WHERE attempt.id = :attemptId
            """)
    Optional<Attempt> findByIdForUpdate(
            @Param("attemptId")
            UUID attemptId
    );
}