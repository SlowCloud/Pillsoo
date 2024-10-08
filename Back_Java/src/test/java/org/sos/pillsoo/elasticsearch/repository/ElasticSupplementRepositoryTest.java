package org.sos.pillsoo.elasticsearch.repository;

import org.junit.jupiter.api.Test;
import org.sos.pillsoo.elasticsearch.entity.ElasticSupplement;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.elasticsearch.core.ElasticsearchOperations;
import org.springframework.web.client.RestTemplate;

@SpringBootTest
class ElasticSupplementRepositoryTest {

    @Autowired
    ElasticSupplementRepository elasticSupplementRepository;

    @Autowired
    ElasticsearchOperations elasticsearchOperations;

    @Test
    void elasticsearchQueryTestWithRestTemplate() {
        RestTemplate restTemplate = new RestTemplate();
        String result = restTemplate.getForObject("http://j11e205-elasticsearch.duckdns.org", String.class);
        System.out.println(result);
    }

    @Test
    void elasticsearchQueryTestWithElasticsearchOperations() {
        ElasticSupplement elasticSupplement = elasticsearchOperations.get("gU4AMpIBWq2v5Ll8JCLE", ElasticSupplement.class);
        System.out.println(elasticSupplement);
    }

    @Test
    void queryTest() {
        Page<ElasticSupplement> supplements = elasticSupplementRepository.searchWithText("비타민", PageRequest.of(0, 5));
        supplements.forEach(System.out::println);
    }

}