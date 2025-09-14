package blog.moonju.moonjublogapi;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.Getter;
import lombok.Setter;
import org.hibernate.annotations.ColumnDefault;

import java.time.Instant;

@Getter
@Setter
@Entity
@Table(name = "board", schema = "blogdb")
public class Board {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "board_number", nullable = false)
    private Integer id;

    @Size(max = 255)
    @NotNull
    @Column(name = "title", nullable = false)
    private String title;

    @NotNull
    @Lob
    @Column(name = "content", nullable = false)
    private String content;

    @NotNull
    @ColumnDefault("CURRENT_TIMESTAMP")
    @Column(name = "write_datetime", nullable = false)
    private Instant writeDatetime;

    @NotNull
    @ColumnDefault("0")
    @Column(name = "favorite_count", nullable = false)
    private Integer favoriteCount;

    @NotNull
    @ColumnDefault("0")
    @Column(name = "comment_count", nullable = false)
    private Integer commentCount;

    @NotNull
    @ColumnDefault("0")
    @Column(name = "view_count", nullable = false)
    private Integer viewCount;

    @NotNull
    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "writer_email", nullable = false)
    private blog.moonju.moonjublogapi.User writerEmail;

}