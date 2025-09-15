package blog.moonju.moonjublogapi.domain;

import jakarta.persistence.Column;
import jakarta.persistence.Embeddable;
import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@EqualsAndHashCode
@Embeddable
public class FavoriteId implements java.io.Serializable {
    @Column(name = "board_id")
    private Long boardId;
    @Column(name = "user_id")
    private Long userId;
}

