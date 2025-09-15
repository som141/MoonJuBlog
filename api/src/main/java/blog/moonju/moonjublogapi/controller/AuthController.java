package blog.moonju.moonjublogapi.controller;

import blog.moonju.moonjublogapi.dto.AuthDtos;
import blog.moonju.moonjublogapi.dto.CommonDtos;
import blog.moonju.moonjublogapi.service.AuthService;
import jakarta.validation.Valid;
import org.springframework.http.*;
import org.springframework.web.bind.annotation.*;

@RestController @RequestMapping("/api")
public class AuthController {
    private final AuthService authService;
    public AuthController(AuthService authService){ this.authService = authService; }

    @PostMapping("/signIn")
    public ResponseEntity<?> signIn(@Valid @RequestBody AuthDtos.SignInRequest req){
        try {
            boolean ok = authService.signIn(req);
            return ok ? ResponseEntity.ok(CommonDtos.SimpleSuccess.ok())
                    : ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(CommonDtos.ErrorResponse.signInFailed());
        } catch (RuntimeException e){
            if ("DB_ERROR".equals(e.getMessage())) {
                return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(CommonDtos.ErrorResponse.dbError());
            }
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(CommonDtos.ErrorResponse.dbError());
        }
    }

    @PostMapping("/signUp")
    public ResponseEntity<?> signUp(@Valid @RequestBody AuthDtos.SignUpRequest req){
        try {
            return ResponseEntity.ok(authService.signUp(req));
        } catch (IllegalStateException e){
            if ("EMAIL_DUP".equals(e.getMessage())) return ResponseEntity.badRequest().body(CommonDtos.ErrorResponse.emailDuplicated());
            return ResponseEntity.badRequest().body(CommonDtos.ErrorResponse.badRequest());
        } catch (RuntimeException e){
            if ("DB_ERROR".equals(e.getMessage())) return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(CommonDtos.ErrorResponse.dbError());
            return ResponseEntity.badRequest().body(CommonDtos.ErrorResponse.badRequest());
        }
    }

    @GetMapping("/health") public CommonDtos.SimpleSuccess health(){ return CommonDtos.SimpleSuccess.ok(); }
}
