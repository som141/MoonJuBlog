package blog.moonju.moonjublogapi.domain;

import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
@Entity @Table(name = "board",
        indexes = @Index(name = "idx_board_writer_created", columnList = "writer_id, created_at"))
public class Board {
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name="writer_id", nullable=false, foreignKey = @ForeignKey(name="fk_board_writer"))
    private User writer;

    @Column(length = 255, nullable = false)
    private String title;

    @Lob @Column(nullable=false, columnDefinition = "MEDIUMTEXT")
    private String content;

    @CreationTimestamp
    @Column(name="created_at", nullable=false, updatable=false)
    private LocalDateTime createdAt;

    @UpdateTimestamp
    @Column(name="updated_at", nullable=false)
    private LocalDateTime updatedAt;

    @Column(name="favorite_count", nullable=false)
    private int favoriteCount = 0; // 트리거가 갱신

    @Column(name="comment_count", nullable=false)
    private int commentCount = 0;  // 트리거가 갱신

    @Column(name="view_count", nullable=false)
    private int viewCount = 0;     // 앱에서 증가 가능

    @OneToMany(mappedBy="board", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<Image> images = new ArrayList<>();
}