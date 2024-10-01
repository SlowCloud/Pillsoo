package org.sos.pillsoo.alarm.service;



import lombok.RequiredArgsConstructor;
import org.sos.pillsoo.alarm.dto.AlarmReqDto;
import org.sos.pillsoo.alarm.dto.AlarmResDto;
import org.sos.pillsoo.alarm.dto.GetAlarmsResDto;
import org.sos.pillsoo.alarm.entity.Alarm;
import org.sos.pillsoo.alarm.fcm.FCMService;
import org.sos.pillsoo.alarm.mapper.AlarmMapper;
import org.sos.pillsoo.cabinet.entity.Cabinet;
import org.sos.pillsoo.alarm.repository.AlarmRepository;
import org.sos.pillsoo.cabinet.repository.CabinetRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;

import java.time.LocalTime;
import java.util.List;
import java.util.stream.Collectors;

@RequiredArgsConstructor
@Service
public class AlarmService {

    private final AlarmRepository alarmRepository;
    private final CabinetRepository cabinetRepository;
    private final FCMService fcmService;
    private final AlarmMapper alarmMapper;

    // 알람 목록 조회
    public List<GetAlarmsResDto> getAlarmsByUserSeq(int userSeq) {
        List<Alarm> alarms = alarmRepository.findByCabinet_User_UserSeq(userSeq);
        return alarms.stream().map(alarmMapper::toGetAlarmsResDto).collect(Collectors.toList());
    }

    // 알람 추가
    public AlarmResDto addAlarm(int userSeq, AlarmReqDto alarmReqDto) {
        Cabinet cabinet = cabinetRepository.findByUser_UserSeqAndSupplement_SupplementSeq(userSeq, alarmReqDto.getSupplementSeq())
                .orElseThrow(() -> new RuntimeException("Cabinet entry not found"));

        Alarm alarm = new Alarm();
        alarm.setCabinet(cabinet);
        alarm.setTime(alarmReqDto.getTime());
        alarm.setTurnOn(true);

        Alarm savedAlarm = alarmRepository.save(alarm);
        return convertAlarmToDto(savedAlarm);
    }

    // 알람 수정
    public AlarmResDto updateAlarm(long alarmSeq, AlarmReqDto alarmReqDto) {
        Alarm alarm = alarmRepository.findById(alarmSeq).orElseThrow(() -> new RuntimeException("Alarm not found"));
        alarm.setTime(alarmReqDto.getTime());
        Alarm updatedAlarm = alarmRepository.save(alarm);
        return convertAlarmToDto(updatedAlarm);
    }


    // 알람 제거
    public void removeAlarm(long alarmSeq) {
        alarmRepository.deleteById(alarmSeq);
    }


    // 특정 시간마다 isTurnOn인 알림들에게 push 알림.
    @Scheduled(cron = "0 * * * * *")  // 매분 0초에 실행
    public void checkAndSendAlarms() {
        LocalTime now = LocalTime.now().withSecond(0).withNano(0);  // 현재 시간의 초와 나노초를 0으로 설정
        List<Alarm> alarms = alarmRepository.findByTimeAndIsTurnOnTrue(now);

        for (Alarm alarm : alarms) {
            String fcmToken = alarm.getCabinet().getUser().getFcmToken();
            String supplementName = alarm.getCabinet().getSupplement().getPillName();

            try {
                fcmService.sendPushNotification(fcmToken,
                        "영양제 복용 시간",
                        supplementName + " 복용 시간입니다!");
            } catch (Exception e) {
                // 로깅 처리
                e.printStackTrace();
            }
        }
    }

    // convert To Dto
    private AlarmResDto convertAlarmToDto(Alarm alarm) {
        AlarmResDto dto = new AlarmResDto();
        dto.setAlarmSeq(alarm.getAlarmSeq());
        dto.setUserSeq(alarm.getCabinet().getUser().getUserSeq());
        dto.setSupplementSeq(alarm.getCabinet().getSupplement().getSupplementSeq());
        dto.setTime(alarm.getTime());
        dto.setTurnOn(alarm.isTurnOn());
        return dto;
    }
}
