package org.sos.pillsoo.auth.service;

import org.sos.pillsoo.auth.dto.SignupDto;
import org.sos.pillsoo.auth.entity.User;
import org.sos.pillsoo.auth.repository.UserRepository;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;

import java.sql.Timestamp;

@Service
public class SignupService {

    private final UserRepository userRepository;
    private final BCryptPasswordEncoder bCryptPasswordEncoder;

    Timestamp timestamp = new Timestamp(System.currentTimeMillis());

    public SignupService(UserRepository userRepository, BCryptPasswordEncoder bCryptPasswordEncoder) {
        this.userRepository = userRepository;
        this.bCryptPasswordEncoder = bCryptPasswordEncoder;
    }

    public void SignupProcess(SignupDto signupDto) {
        String userId = signupDto.getUserId();
        String userPassword = signupDto.getPassword();

        Boolean isExist =userRepository.existsByUserId(userId);
        if (isExist) {
            System.out.println("이미 존재하는 유저 아이디입니다.");
            return ;
        }

        User user = new User();
        user.setUserId(userId);
        user.setPassword(bCryptPasswordEncoder.encode(userPassword));
        user.setUserName(signupDto.getName());
        user.setAge(signupDto.getAge());
//        user.setGender(signupDto.getGender());
        user.setCreatedAt(timestamp);
        if(signupDto.isGender()){
            user.setGender("F");
        } else {
            user.setGender("M");
        }

        userRepository.save(user);

        System.out.println(user.getUserName() + "가 회원가입 함");
    }
}
