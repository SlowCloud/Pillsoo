package org.sos.pillsoo.auth.contoller;

import org.sos.pillsoo.auth.dto.SignupDto;
import org.sos.pillsoo.auth.service.SignupService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.util.Collection;
import java.util.Iterator;

@RestController
@RequestMapping("/api/v1")
public class AuthController {

    private final SignupService signupService;

    public AuthController(SignupService signupService) {
        this.signupService = signupService;
    }

    @PostMapping("/signup")
    public ResponseEntity<String> signup(@RequestBody SignupDto signupDto) {
        signupService.SignupProcess(signupDto);
        return ResponseEntity.ok("회원가입 완료");
    }

    @PostMapping("/logout-success")
    public ResponseEntity<Void> logoutSuccess() {
        return ResponseEntity.ok(null);
    }

    // 권한 확인용 role user or admin
    @GetMapping("/admin")
    public String adminP() {
        return "Admin Controller";
    }

    // home(main)
    @GetMapping("/")
    public String mainP() {

        String username = SecurityContextHolder.getContext().getAuthentication().getName();

        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        Collection<? extends GrantedAuthority> authorities = authentication.getAuthorities();
        Iterator<? extends GrantedAuthority> iterator = authorities.iterator();
        GrantedAuthority auth = iterator.next();
        String role = auth.getAuthority();

        return "Main Contoller " + username + " " + role;
    }

}
