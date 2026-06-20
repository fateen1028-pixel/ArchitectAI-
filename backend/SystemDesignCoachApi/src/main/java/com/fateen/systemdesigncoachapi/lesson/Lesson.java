package com.fateen.systemdesigncoachapi.lesson;

import com.fateen.systemdesigncoachapi.topic.Topic;
import jakarta.persistence.*;
import lombok.Getter;

import java.time.Instant;

@Getter
@Entity
@Table(
        name = "lessons",
        uniqueConstraints = {
                @UniqueConstraint(
                        name = "uq_lesson_topic_slug",
                        columnNames = {
                                "topic_id",
                                "slug"
                        }
                ),
                @UniqueConstraint(
                        name = "uq_lesson_topic_display_order",
                        columnNames = {
                                "topic_id",
                                "display_order"
                        }
                )
        }
)
public class Lesson {

    @Id
    @GeneratedValue(
            strategy = GenerationType.IDENTITY
    )
    private Long id;

    @ManyToOne(
            fetch = FetchType.LAZY,
            optional = false
    )
    @JoinColumn(
            name = "topic_id",
            nullable = false
    )
    private Topic topic;

    @Column(
            nullable = false,
            length = 150
    )
    private String title;

    @Column(
            nullable = false,
            length = 150
    )
    private String slug;

    @Column(
            nullable = false,
            length = 500
    )
    private String summary;

    @Column(
            nullable = false,
            columnDefinition = "TEXT"
    )
    private String content;

    @Column(
            name = "estimated_minutes",
            nullable = false
    )
    private Integer estimatedMinutes;

    @Column(
            name = "display_order",
            nullable = false
    )
    private Integer displayOrder;

    @Column(
            name = "created_at",
            nullable = false,
            updatable = false
    )
    private Instant createdAt;

    protected Lesson() {
        // Required by JPA
    }

}