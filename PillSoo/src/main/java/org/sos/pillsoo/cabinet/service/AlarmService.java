package org.sos.pillsoo.mykit.service;

<<<<<<< Updated upstream:PillSoo/src/main/java/org/sos/pillsoo/mykit/service/AlarmService.java
import org.sos.pillsoo.mykit.dto.AlarmDto;
import org.sos.pillsoo.mykit.entity.Alarm;
import org.sos.pillsoo.mykit.entity.Cabinet;
import org.sos.pillsoo.mykit.repository.AlarmRepository;
import org.sos.pillsoo.mykit.repository.CabinetRepository;
=======
import org.sos.pillsoo.alarm.dto.AlarmDto;
import org.sos.pillsoo.alarm.entity.Alarm;
import org.sos.pillsoo.cabinet.entity.Cabinet;
import org.sos.pillsoo.alarm.repository.AlarmRepository;
import org.sos.pillsoo.cabinet.repository.CabinetRepository;
>>>>>>> Stashed changes:PillSoo/src/main/java/org/sos/pillsoo/alarm/service/AlarmService.java
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class AlarmService {

    @Autowired
    private AlarmRepository alarmRepository;

    @Autowired
    private CabinetRepository cabinetRepository;

    // 알람 목록 조회
    public List<AlarmDto> getAlarmsByUserSeq(int userSeq) {
        List<Alarm> alarms = alarmRepository.findByCabinet_User_UserSeq(userSeq);
        return alarms.stream().map(this::convertToDto).collect(Collectors.toList());
    }

    // 알람 추가
    public void addAlarm(int userSeq, int supplementSeq, AlarmDto alarmDto) {
        // 사용자의 Cabinet(영양제) 항목 조회
        Cabinet cabinet = cabinetRepository.findByUser_UserSeqAndSupplement_SupplementSeq(userSeq, supplementSeq)
                .orElseThrow(() -> new RuntimeException("Cabinet entry not found"));

        Alarm alarm = new Alarm();
<<<<<<< Updated upstream:PillSoo/src/main/java/org/sos/pillsoo/mykit/service/AlarmService.java
        alarm.setCabinet(cabinet); // Cabinet 객체 설정
=======
//        alarm.setCabinet(cabinet); // Cabinet 객체 설정
//        alarm.setAlarm(a);
>>>>>>> Stashed changes:PillSoo/src/main/java/org/sos/pillsoo/alarm/service/AlarmService.java
        alarm.setAlarm(alarmDto.getAlert());
        alarm.setUsed(alarmDto.isTurnOn());
        alarmRepository.save(alarm);
    }

    // 알람 수정
    public void updateAlarm(long alarmSeq, AlarmDto alarmDto) {
        Alarm alarm = alarmRepository.findById(alarmSeq).orElseThrow();
        alarm.setAlarm(alarmDto.getAlert());
        alarm.setUsed(alarmDto.isTurnOn());
        alarmRepository.save(alarm);
    }

    // 알람 제거
    public void removeAlarm(long alarmSeq) {
        alarmRepository.deleteById(alarmSeq);
    }

    private AlarmDto convertToDto(Alarm alarm) {
        AlarmDto dto = new AlarmDto();
        dto.setAlarmSeq(alarm.getAlarmSeq());
        dto.setSupplementSeq(alarm.getCabinet().getSupplement().getSupplementSeq());
        dto.setPillName(alarm.getCabinet().getSupplement().getPillName());
        dto.setAlert(alarm.getAlarm());
        dto.setTurnOn(alarm.isUsed());
        return dto;
    }
}
