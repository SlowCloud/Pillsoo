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
          "match": {
            "preprocessed_text": "#{#text}"
          }
        },
        "functions": [
          {
            "exp": {
              "click_count": {
                "origin": 1000,
                "scale": 10
              }
            }
          }
        ],
        "score_mode": "sum"
      }
    }
    """)
    Page<ElasticSupplement> searchWithText(String text, Pageable pageable);
}
