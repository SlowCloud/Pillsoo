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

@Component
@Aspect
public class ControllerAspect {

    @Pointcut("within(org.sos.pillsoo..*Controller)")
    void controllerPointcut() {}

    @Before("controllerPointcut()")
    public void controllerLogging(JoinPoint joinPoint) {

        CodeSignature signature = (CodeSignature) joinPoint.getSignature();
        Logger logger = LoggerFactory.getLogger(signature.getDeclaringType());

        logger.info("ENTER {}", joinPoint.getSignature().getName());
        logger.info(getParamNameLog(signature));
        logger.info(getParamValueLog(joinPoint));

        Authentication authentication = SecurityContextHolder.getContextHolderStrategy().getContext().getAuthentication();
        if(authentication != null) {
            logger.info("Connected User :: {}", authentication);
        }

    }

    private static String getParamNameLog(CodeSignature signature) {
        return Arrays.stream(signature.getParameterNames())
                .collect(Collectors.joining(", ", "PARAMS :: ", ""));
    }

    private static String getParamValueLog(JoinPoint joinPoint) {
        return Arrays.stream(joinPoint.getArgs())
                .map(Object::toString)
                .collect(Collectors.joining(", ", "PARAM VALUES :: ", ""));
    }
}
