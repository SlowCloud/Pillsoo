package org.sos.pillsoo.alarm.controller;


import lombok.RequiredArgsConstructor;
import org.sos.pillsoo.alarm.dto.AlarmReqDto;
import org.sos.pillsoo.alarm.dto.AlarmResDto;
import org.sos.pillsoo.alarm.dto.GetAlarmsResDto;
import org.sos.pillsoo.alarm.entity.Alarm;
import org.sos.pillsoo.auth.dto.CustomUserDetails;
import org.sos.pillsoo.alarm.service.AlarmService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RequiredArgsConstructor
@RestController
@RequestMapping("/api/v1/alarm")
public class AlarmController {

    private final AlarmService alarmService;

    // 알람 목록 조회
    @GetMapping
    public List<GetAlarmsResDto> getAlarms(@AuthenticationPrincipal CustomUserDetails userDetails) {
        int userSeq = userDetails.getUserSeq();
        return alarmService.getAlarmsByUserSeq(userSeq);
    }

    // 알람 추가
    @PostMapping
    public AlarmResDto addAlarm(@RequestBody AlarmReqDto alarmReqDto, @AuthenticationPrincipal CustomUserDetails userDetails) {
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
