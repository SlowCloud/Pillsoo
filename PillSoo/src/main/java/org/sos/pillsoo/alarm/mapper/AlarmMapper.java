package org.sos.pillsoo.alarm.mapper;

import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.sos.pillsoo.alarm.dto.GetAlarmsResDto;
import org.sos.pillsoo.alarm.entity.Alarm;

@Mapper(componentModel = "spring")
public interface AlarmMapper {
    @Mapping(target = "userSeq", source = "alarm.cabinet.user.userSeq")
    @Mapping(target = "supplementSeq", source = "alarm.cabinet.supplement.supplementSeq")
    @Mapping(target = "supplementName", source = "alarm.cabinet.supplement.pillName")
    GetAlarmsResDto toGetAlarmsResDto(Alarm alarm);
}
