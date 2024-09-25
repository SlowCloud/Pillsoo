package org.sos.pillsoo.auth.contoller;

import org.sos.pillsoo.auth.dto.CustomUserDetails;
import org.sos.pillsoo.auth.dto.SignupDto;
import org.sos.pillsoo.auth.dto.UserUpdateDto;
import org.sos.pillsoo.auth.exception.CustomException;
import org.sos.pillsoo.auth.service.UserService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.util.Collection;
import java.util.Iterator;

@RestController
@RequestMapping("/api/v1")
public class AuthController {

    private final UserService userService;

    public AuthController(UserService userService) {
        this.userService = userService;
    }

    @PostMapping("/signup")
    public ResponseEntity<String> signup(@RequestBody SignupDto signupDto) {
//        userService.SignupProcess(signupDto);
//        return ResponseEntity.ok("회원가입 완료");

        try {
            userService.SignupProcess(signupDto);
            return ResponseEntity.ok("회원가입 완료");
        } catch (CustomException e) {
            return ResponseEntity
                    .status(e.getErrorCode().getHttpStatus())
                    .body(e.getErrorCode().getMessage());
        }
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

    @PatchMapping("/update")
    public ResponseEntity<?> update(@AuthenticationPrincipal CustomUserDetails customUserDetails, @RequestBody UserUpdateDto userUpdateDto) {
        userService.updateProcess(customUserDetails.getUsername(), userUpdateDto);
        return ResponseEntity.ok().build();
    }

}
