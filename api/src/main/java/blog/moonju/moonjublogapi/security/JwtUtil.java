package blog.moonju.moonjublogapi.security;

import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.security.Keys;
import javax.crypto.SecretKey;
import java.nio.charset.StandardCharsets;
import java.util.Date;

public class JwtUtil {
    private final SecretKey key;
    public JwtUtil(String secret) { this.key = Keys.hmacShaKeyFor(secret.getBytes(StandardCharsets.UTF_8)); }
    public String generateToken(String subject, long expiryMillisFromNow) {
        long now = System.currentTimeMillis();
        return Jwts.builder()
                .setSubject(subject)
                .setIssuedAt(new Date(now))
                .setExpiration(new Date(now + expiryMillisFromNow))
                .signWith(key)
                .compact();
    }
}