package blog.moonju.moonjublogapi;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;
import org.hibernate.annotations.OnDelete;
import org.hibernate.annotations.OnDeleteAction;

@Getter
@Setter
@Entity
@Table(name = "favorite", schema = "blogdb")
public class Favorite {
    @EmbeddedId
    private FavoriteId id;

    @MapsId("userEmail")
    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @OnDelete(action = OnDeleteAction.CASCADE)
    @JoinColumn(name = "user_email", nullable = false)
    private blog.moonju.moonjublogapi.User userEmail;

}