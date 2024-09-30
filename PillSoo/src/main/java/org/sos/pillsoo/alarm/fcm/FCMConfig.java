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
        
        // 파이어베이스가 중복 초기화 되는 에러 처리
        if (FirebaseApp.getApps().isEmpty()) {
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
        return FirebaseApp.getInstance();
    }
}
