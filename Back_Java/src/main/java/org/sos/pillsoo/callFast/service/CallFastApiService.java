package org.sos.pillsoo.callFast.service;


import org.sos.pillsoo.callFast.dto.RecommendReqDto;
import org.sos.pillsoo.callFast.dto.RecommendResDto;
import org.sos.pillsoo.callFast.dto.TextBasedReqDto;
import org.sos.pillsoo.callFast.dto.TextBasedResDto;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

@Service
public class CallFastApiService {
    private final RestTemplate restTemplate;
    private final String flaskApiUrl;

    public CallFastApiService(RestTemplate restTemplate, @Value("${flask.api.url}") String flaskApiUrl) {
        this.restTemplate = restTemplate;
        this.flaskApiUrl = flaskApiUrl;
    }

    public RecommendResDto[] getRecommendations(RecommendReqDto request) {
        String url = flaskApiUrl + "/api/v1/recommend?age=" + request.getAge();
        return restTemplate.getForObject(url, RecommendResDto[].class);
    }

    public TextBasedResDto[] getTextBasedRecommendations(TextBasedReqDto request) {
        String url = flaskApiUrl + "/api/v1/recommend/survey?client_text=" + request.getClientText();
        return restTemplate.getForObject(url, TextBasedResDto[].class);
    }
}
