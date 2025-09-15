package blog.moonju.moonjublogapi.dto;

import jakarta.validation.constraints.*;

public class AuthDtos {
    public record SignInRequest(@NotBlank @Email String email, @NotBlank String password) {}

    public record SignUpRequest(
            @NotBlank @Email String email,
            @NotBlank @Size(min=8) String password,
            @NotBlank @Size(max=20) String nickname,
            @NotBlank @Pattern(regexp = "^[0-9\\-]{9,20}$") String tellnumber,
            @NotBlank String address,
            String addressDetail
    ) {}

    public record SignUpSuccess(String code, String message, String token, long expireDate, Long userId) {
        public static SignUpSuccess of(String token, long exp, Long userId) {
            return new SignUpSuccess("su","success",token,exp,userId);
        }
    }
}
