package blog.moonju.moonjublogapi;

import jakarta.persistence.Column;
import jakarta.persistence.Embeddable;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.Getter;
import lombok.Setter;
import org.hibernate.Hibernate;

import java.util.Objects;

@Getter
@Setter
@Embeddable
public class FavoriteId implements java.io.Serializable {
    private static final long serialVersionUID = -3104661608001525113L;
    @NotNull
    @Column(name = "board_number", nullable = false)
    private Integer boardNumber;

    @Size(max = 50)
    @NotNull
    @Column(name = "user_email", nullable = false, length = 50)
    private String userEmail;

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || Hibernate.getClass(this) != Hibernate.getClass(o)) return false;
        FavoriteId entity = (FavoriteId) o;
        return Objects.equals(this.boardNumber, entity.boardNumber) &&
                Objects.equals(this.userEmail, entity.userEmail);
    }

    @Override
    public int hashCode() {
        return Objects.hash(boardNumber, userEmail);
    }

}