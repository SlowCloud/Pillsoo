package org.sos.pillsoo.alarm.controller;


import org.sos.pillsoo.auth.dto.CustomUserDetails;
import org.sos.pillsoo.alarm.dto.AlarmDto;
import org.sos.pillsoo.alarm.service.AlarmService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/alarm")
public class AlarmController {

    @Autowired
    private AlarmService alarmService;

    // 알람 목록 조회
    @GetMapping
    public List<AlarmDto> getAlarms() {
        // JWT 토큰에서 userSeq를 가져옴
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        CustomUserDetails userDetails = (CustomUserDetails) authentication.getPrincipal(); // 사용자 정보에서 userSeq를 가져옴
        int userSeq = userDetails.getUserSeq(); // userSeq를 userDetails에서 가져옴

        return alarmService.getAlarmsByUserSeq(userSeq);
    }

    // 알람 추가
    @PostMapping
    public void addAlarm(@RequestBody AlarmDto alarmDto) {
        // JWT 토큰에서 userSeq를 가져옴
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        CustomUserDetails userDetails = (CustomUserDetails) authentication.getPrincipal(); // 사용자 정보에서 userSeq를 가져옴
        int userSeq = userDetails.getUserSeq();

        alarmService.addAlarm(userSeq, alarmDto.getSupplementSeq(), alarmDto);
    }

    // 알람 수정
    @PatchMapping("/{alarmSeq}")
    public void updateAlarm(@PathVariable long alarmSeq, @RequestBody AlarmDto alarmDto) {
        alarmService.updateAlarm(alarmSeq, alarmDto);
    }

    // 알람 제거
    @DeleteMapping("/{alarmSeq}")
    public void removeAlarm(@PathVariable long alarmSeq) {
        alarmService.removeAlarm(alarmSeq);
    }
}
