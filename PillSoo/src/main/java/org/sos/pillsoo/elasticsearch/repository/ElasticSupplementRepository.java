package org.sos.pillsoo.elasticsearch.repository;

import org.sos.pillsoo.elasticsearch.entity.ElasticSupplement;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.elasticsearch.annotations.Query;
import org.springframework.data.elasticsearch.repository.ElasticsearchRepository;

public interface ElasticSupplementRepository extends ElasticsearchRepository<ElasticSupplement, Long> {

    @Query("""
    {
      "function_score": {
        "query": {
          "multi_match": {
            "query": "#{#text}",
            "fields": ["pill_name^3", "functionality"]
          }
        },
        "field_value_factor": {
          "field": "click_count",
          "modifier": "log1p"
        },
        "boost_mode": "sum"
      }
    }
    """)
    Page<ElasticSupplement> searchWithText(String text, Pageable pageable);
}
