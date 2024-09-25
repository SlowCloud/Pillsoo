package org.sos.pillsoo.log;

import org.aspectj.lang.JoinPoint;
import org.aspectj.lang.annotation.Aspect;
import org.aspectj.lang.annotation.Before;
import org.aspectj.lang.annotation.Pointcut;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Component;

@Component
@Aspect
public class ControllerAspect {

    @Pointcut("within(org.sos.pillsoo..*Controller)")
    void controllerPointcut() {}

    @Before("controllerPointcut()")
    public void controllerLogging(JoinPoint joinPoint) {
        Logger logger = LoggerFactory.getLogger(joinPoint.getSignature().getDeclaringType());

        logger.info("ENTER {} ::", joinPoint.getSignature().getName());

        StringBuilder stringBuilder = new StringBuilder();
        for(Object param : joinPoint.getArgs()) {
            if (param != null) {
                stringBuilder
                        .append(param.getClass().getSimpleName())
                        .append("=")
                        .append(param)
                        .append(System.lineSeparator());
            }
        }

        logger.info(stringBuilder.toString());
    }
}
