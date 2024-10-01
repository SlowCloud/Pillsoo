package org.sos.pillsoo.cabinet.controller;


import org.sos.pillsoo.auth.dto.CustomUserDetails;
import org.sos.pillsoo.cabinet.dto.AlarmDto;
import org.sos.pillsoo.cabinet.service.AlarmService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
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
    public List<AlarmDto> getAlarms(@AuthenticationPrincipal CustomUserDetails userDetails) {
        int userSeq = userDetails.getUserSeq();
        return alarmService.getAlarmsByUserSeq(userSeq);
    }

    // 알람 추가
    @PostMapping
    public void addAlarm(@RequestBody AlarmDto alarmDto, @AuthenticationPrincipal CustomUserDetails userDetails) {
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
