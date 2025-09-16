package blog.moonju.moonjublogapi.config;

import blog.moonju.moonjublogapi.security.JwtUtil;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.servlet.config.annotation.CorsRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;
@Configuration
public class AppConfig implements WebMvcConfigurer {

    @Value("${app.jwt.secret}")
    private String jwtSecret;

    @Override
    public void addCorsMappings(CorsRegistry registry){
        registry.addMapping("/**")
                .allowedOrigins("http://localhost:3000","http://127.0.0.1:3000")
                .allowedMethods("GET","POST","PUT","PATCH","DELETE","OPTIONS")
                .allowedHeaders("Content-Type","Authorization")
                .allowCredentials(true);
    }

    @Bean
    public JwtUtil jwtUtil(){return new JwtUtil(jwtSecret);}
    @Bean
    public PasswordEncoder passwordEncoder(){return new BCryptPasswordEncoder();}
}
