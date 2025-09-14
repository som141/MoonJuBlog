package blog.moonju.moonjublogapi;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.Getter;
import lombok.Setter;
import org.hibernate.annotations.ColumnDefault;

@Getter
@Setter
@Entity
@Table(name = "search_word", schema = "blogdb")
public class SearchWord {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "sequence", nullable = false)
    private Integer id;

    @Size(max = 255)
    @NotNull
    @Column(name = "search_word", nullable = false)
    private String searchWord;

    @Size(max = 255)
    @Column(name = "relation_word")
    private String relationWord;

    @NotNull
    @ColumnDefault("0")
    @Column(name = "relation", nullable = false)
    private Boolean relation = false;

}