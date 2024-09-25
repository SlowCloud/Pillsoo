package org.sos.pillsoo.auth.service;

import org.sos.pillsoo.auth.dto.SignupDto;
import org.sos.pillsoo.auth.dto.UserUpdateDto;
import org.sos.pillsoo.auth.entity.User;
import org.sos.pillsoo.auth.repository.UserRepository;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.sql.Timestamp;

@Service
public class UserService {

    private final UserRepository userRepository;
    private final BCryptPasswordEncoder bCryptPasswordEncoder;

    Timestamp timestamp = new Timestamp(System.currentTimeMillis());

    public UserService(UserRepository userRepository, BCryptPasswordEncoder bCryptPasswordEncoder) {
        this.userRepository = userRepository;
        this.bCryptPasswordEncoder = bCryptPasswordEncoder;
    }

    public void SignupProcess(SignupDto signupDto) {
        String userId = signupDto.getUserId();
        String userPassword = signupDto.getPassword();

        Boolean isExist = userRepository.existsByUserId(userId);
        if (isExist) {
            System.out.println("이미 존재하는 유저 아이디입니다.");
            return;
        }

        User user = new User();
        user.setUserId(userId);
        user.setPassword(bCryptPasswordEncoder.encode(userPassword));
        user.setNickname(signupDto.getNickname());
        user.setAge(signupDto.getAge());
        user.setCreatedAt(timestamp);
        user.setRole("ROLE_USER");
        if (signupDto.isGender()) {
            user.setGender("F");
        } else {
            user.setGender("M");
        }

        userRepository.save(user);

        System.out.println(user.getNickname() + "가 회원가입 함");
    }

    @Transactional
    public void updateProcess (String userId, UserUpdateDto userUpdateDto) {
        User user = userRepository.findByUserId(userId);
        user.setNickname(userUpdateDto.getNickname());
        user.setAge(userUpdateDto.getAge());
        user.setGender(userUpdateDto.getGender());
        user.setPassword(bCryptPasswordEncoder.encode(userUpdateDto.getPassword()));

        userRepository.save(user);
    }
}
