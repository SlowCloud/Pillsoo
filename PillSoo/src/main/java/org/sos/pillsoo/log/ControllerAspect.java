package org.sos.pillsoo.log;

import org.aspectj.lang.JoinPoint;
import org.aspectj.lang.annotation.Aspect;
import org.aspectj.lang.annotation.Before;
import org.aspectj.lang.annotation.Pointcut;
import org.aspectj.lang.reflect.CodeSignature;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Component;

import java.util.Arrays;
import java.util.stream.Collectors;
import java.util.stream.IntStream;

@Component
@Aspect
public class ControllerAspect {

    private static final Logger log = LoggerFactory.getLogger(ControllerAspect.class);

    @Pointcut("within(org.sos.pillsoo..*Controller)")
    void controllerPointcut() {}

    @Before("controllerPointcut()")
    public void controllerLogging(JoinPoint joinPoint) {

        CodeSignature signature = (CodeSignature) joinPoint.getSignature();
        Logger logger = LoggerFactory.getLogger(signature.getDeclaringType());

        logger.info("ENTER {}", joinPoint.getSignature().getName());
        logger.info(getParamLog(joinPoint, signature));

        Authentication authentication = SecurityContextHolder.getContextHolderStrategy().getContext().getAuthentication();
        if(authentication != null) {
            logger.info("Connected User :: {}", authentication);
        }

    }

    private static String getParamLog(JoinPoint joinPoint, CodeSignature signature) {
        String[] parameterNames = signature.getParameterNames();
        Object[] args = joinPoint.getArgs();
        return IntStream.range(0, parameterNames.length)
                .mapToObj(i -> parameterNames[i] + "=" + (args[i] != null ? args[i] : "null"))
                .collect(Collectors.joining(", ", "PARAMS :: ", ""));
    }
}
