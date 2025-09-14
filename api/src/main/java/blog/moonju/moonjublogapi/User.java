package blog.moonju.moonjublogapi;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@Entity
@Table(name = "user", schema = "blogdb")
public class User {
    @Id
    @Size(max = 50)
    @Column(name = "email", nullable = false, length = 50)
    private String email;

    @Size(max = 100)
    @NotNull
    @Column(name = "password", nullable = false, length = 100)
    private String password;

    @Size(max = 20)
    @NotNull
    @Column(name = "nickname", nullable = false, length = 20)
    private String nickname;

    @Size(max = 20)
    @NotNull
    @Column(name = "tel_number", nullable = false, length = 20)
    private String telNumber;

    @NotNull
    @Lob
    @Column(name = "address", nullable = false)
    private String address;

    @Lob
    @Column(name = "address_detail")
    private String addressDetail;

    @Lob
    @Column(name = "profile_image")
    private String profileImage;

}