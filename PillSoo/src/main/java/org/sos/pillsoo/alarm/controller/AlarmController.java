package org.sos.pillsoo.alarm.controller;


import org.sos.pillsoo.alarm.dto.AlarmReqDto;
import org.sos.pillsoo.alarm.dto.AlarmResDto;
import org.sos.pillsoo.alarm.dto.GetAlarmsResDto;
import org.sos.pillsoo.alarm.entity.Alarm;
import org.sos.pillsoo.auth.dto.CustomUserDetails;
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
    public List<GetAlarmsResDto> getAlarms() {
        // JWT 토큰에서 userSeq를 가져옴
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        CustomUserDetails userDetails = (CustomUserDetails) authentication.getPrincipal(); // 사용자 정보에서 userSeq를 가져옴
        int userSeq = userDetails.getUserSeq(); // userSeq를 userDetails에서 가져옴

        return alarmService.getAlarmsByUserSeq(userSeq);
    }

    // 알람 추가
    @PostMapping
    public AlarmResDto addAlarm(@RequestBody AlarmReqDto alarmReqDto) {
        // JWT 토큰에서 userSeq를 가져옴
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        CustomUserDetails userDetails = (CustomUserDetails) authentication.getPrincipal(); // 사용자 정보에서 userSeq를 가져옴
        int userSeq = userDetails.getUserSeq();

        return alarmService.addAlarm(userSeq, alarmReqDto);
    }


    // 알람 수정
    @PatchMapping("/{alarmSeq}")
    public AlarmResDto updateAlarm(@PathVariable long alarmSeq, @RequestBody AlarmReqDto alarmReqDto) {
        return alarmService.updateAlarm(alarmSeq, alarmReqDto);
    }

    // 알람 제거
    @DeleteMapping("/{alarmSeq}")
    public void removeAlarm(@PathVariable long alarmSeq) {
        alarmService.removeAlarm(alarmSeq);
    }

}
