package org.sos.pillsoo.alarm.fcm;

import com.google.auth.oauth2.GoogleCredentials;
import com.google.firebase.FirebaseApp;
import com.google.firebase.FirebaseOptions;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.core.io.ClassPathResource;

import java.io.IOException;

@Configuration
public class FCMConfig {
    @Bean
    public FirebaseApp firebaseApp() throws IOException {
        // 서비스 계정 키 파일 로드
        GoogleCredentials credentials = GoogleCredentials.fromStream(
                new ClassPathResource("/serviceAccountKey.json").getInputStream());

        // FirebaseOptions 설정
        FirebaseOptions options = FirebaseOptions.builder()
                .setCredentials(credentials)
                .build();

        // FirebaseApp 초기화
        return FirebaseApp.initializeApp(options);
    }
}
