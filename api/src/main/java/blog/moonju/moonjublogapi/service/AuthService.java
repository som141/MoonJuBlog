package blog.moonju.moonjublogapi.service;


import blog.moonju.moonjublogapi.domain.User;
import blog.moonju.moonjublogapi.repository.UserRepository;
import blog.moonju.moonjublogapi.security.JwtUtil;
import blog.moonju.moonjublogapi.dto.AuthDtos.*;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.dao.DataAccessException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class AuthService {
    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtUtil jwtUtil;
    private final long expiryMinutes;

    public AuthService(UserRepository userRepository,
                       PasswordEncoder passwordEncoder,
                       JwtUtil jwtUtil,
                       @Value("${app.jwt.expiry-minutes}") long expiryMinutes) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
        this.jwtUtil = jwtUtil;
        this.expiryMinutes = expiryMinutes;
    }

    @Transactional(readOnly = true)
    public boolean signIn(SignInRequest req) {
        try {
            return userRepository.findByEmail(req.email())
                    .map(u -> passwordEncoder.matches(req.password(), u.getPassword()))
                    .orElse(false);
        } catch (DataAccessException e) { throw new RuntimeException("DB_ERROR", e); }
    }

    @Transactional
    public SignUpSuccess signUp(SignUpRequest req) {
        try {
            if (userRepository.existsByEmail(req.email())) throw new IllegalStateException("EMAIL_DUP");
            User u = User.builder()
                    .email(req.email())
                    .password(passwordEncoder.encode(req.password()))
                    .nickname(req.nickname())
                    .telNumber(req.tellnumber())
                    .address(req.address())
                    .addressDetail(req.addressDetail())
                    .build();
            userRepository.save(u);
            long expiryMs = expiryMinutes * 60 * 1000;
            String token = jwtUtil.generateToken(String.valueOf(u.getId()), expiryMs); // subject = userId
            return SignUpSuccess.of(token, System.currentTimeMillis()+expiryMs, u.getId());
        } catch (DataAccessException e) { throw new RuntimeException("DB_ERROR", e); }
    }
}