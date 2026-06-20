package com.fateen.systemdesigncoachapi.topic;

import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface TopicRepository
        extends JpaRepository<Topic, Long> {

    List<Topic> findAllByOrderByDisplayOrderAsc();

    Optional<Topic> findBySlug(String slug);

    boolean existsBySlug(String slug);
}
