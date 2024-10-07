package org.sos.pillsoo.callFast.controller;

import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import org.sos.pillsoo.callFast.dto.RecommendReqDto;
import org.sos.pillsoo.callFast.dto.RecommendResDto;
import org.sos.pillsoo.callFast.dto.TextBasedReqDto;
import org.sos.pillsoo.callFast.dto.TextBasedResDto;
import org.sos.pillsoo.callFast.service.CallFastApiService;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/v1")
public class CallFastApiController {

    private final CallFastApiService callFastApiService;

    public CallFastApiController(CallFastApiService callFastApiService) {
        this.callFastApiService = callFastApiService;
    }

    @GetMapping("/recommend")
    public RecommendResDto[] getRecommendations(@RequestParam @Min(1) @Max(130) int age) {
        RecommendReqDto request = new RecommendReqDto();
        request.setAge(age);
        return callFastApiService.getRecommendations(request);
    }

    @GetMapping("/recommend/survey")
    public TextBasedResDto[] getTextBasedRecommendations(@RequestParam("client_text") @NotBlank String clientText) {
        TextBasedReqDto request = new TextBasedReqDto();
        request.setClientText(clientText);
        return callFastApiService.getTextBasedRecommendations(request);
    }

}
