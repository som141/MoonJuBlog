package blog.moonju.moonjublogapi.domain;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
@Entity
@Table(name = "search_word")
public class SearchWord {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(length = 100, nullable = false, unique = true)
    private String word;

    @Column(nullable = false)
    private Integer hit;

    @Column(name = "last_searched_at")
    private LocalDateTime lastSearchedAt;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id") // NULL 허용(익명 검색)
    private User user;
}
