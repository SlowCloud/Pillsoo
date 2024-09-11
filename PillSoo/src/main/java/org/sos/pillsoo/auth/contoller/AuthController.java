package org.sos.pillsoo.auth.contoller;

import org.sos.pillsoo.auth.dto.SignupDto;
import org.sos.pillsoo.auth.service.SignupService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

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
}
