package org.sos.pillsoo.mykit.controller;

import org.sos.pillsoo.mykit.dto.AlarmDto;
import org.sos.pillsoo.mykit.service.AlarmService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/alarm")
public class AlarmController {

    @Autowired
    private AlarmService alarmService;

    // 알람 목록 조회
    @GetMapping
    public List<AlarmDto> getAlarms(@RequestParam int userSeq) {
        return alarmService.getAlarmsByUserSeq(userSeq);
    }

    // 알람 추가
    @PostMapping
    public void addAlarm(@RequestParam int userSeq, @RequestBody AlarmDto alarmDto) {
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
