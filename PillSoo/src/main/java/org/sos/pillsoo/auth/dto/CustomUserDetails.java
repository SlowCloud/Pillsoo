package org.sos.pillsoo.auth.dto;

import org.sos.pillsoo.auth.entity.User;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;

import java.util.ArrayList;
import java.util.Collection;

public class CustomUserDetails implements UserDetails {

    private final User userEntity;

    public CustomUserDetails(User userEntity) {
        this.userEntity = userEntity;
    }

    // userSeq 반환 메서드 추가
    public int getUserSeq() {
        return userEntity.getUserSeq();
    }

    public String getUserNickname() {
        return userEntity.getNickname();
    }

    public String getUserGender() {
        return userEntity.getGender();
    }

    public int getUserAge() {
        return userEntity.getAge();
    }

    @Override
    public Collection<? extends GrantedAuthority> getAuthorities() {
        Collection<GrantedAuthority> authorities = new ArrayList<>();
        // userEntity의 역할(Role)을 권한으로 반환
        authorities.add(new SimpleGrantedAuthority(userEntity.getRole()));
        return authorities;
    }

    @Override
    public String getPassword() {
        return userEntity.getPassword();
    }

    @Override
    public String getUsername() {
        return userEntity.getUserId();
    }

    @Override
    public boolean isAccountNonExpired() {
        return true;
    }

    @Override
    public boolean isAccountNonLocked() {
        return true;
    }

    @Override
    public boolean isCredentialsNonExpired() {
        return true;
    }

    @Override
    public boolean isEnabled() {
        return true;
    }
}
