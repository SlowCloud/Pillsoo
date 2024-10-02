
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.metrics.pairwise import cosine_similarity
from konlpy.tag import Okt
from typing import List, Tuple

import ray

from .database import es

# 명사 뿐만 아니라 형용사, 동사 등도 포함한 전처리
@ray.remote
def preprocess_text(text: str) -> str:
    okt = Okt()
    tokens = okt.pos(text, stem=True)  # 형태소 분석 및 어근 추출
    important_words = [word for word, pos in tokens if pos in ['Noun', 'Verb', 'Adjective']]  # 명사, 동사, 형용사만 추출
    return ' '.join(important_words)

# Elasticsearch 검색 결과를 기존 result 형식으로 변환하는 함수
def convert_es_result_to_custom_format(es_results: List[dict]) -> List[dict]:
    custom_results = []
    
    for hit in es_results:
        source = hit["_source"]  # Elasticsearch의 _source에서 데이터를 추출
        custom_result = {
            "supplementSeq": source.get("supplementseq"),
            "pill_name": source.get("pill_name"),
            "functionality": source.get("functionality"),
            "dose_guide": source.get("dose_guide"),
            "image_url": source.get("image_url")
        }
        custom_results.append(custom_result)
    
    return custom_results

# Elasticsearch 검색 함수
def search_in_elasticsearch(words):
    print(words)
    # 쿼리 생성
    
    query = {
        "query": {
            "bool": {
                "should": [
                    {
                        "match": {
                            "preprocessed_text": words
                        }
                    }
                ]
            }
        }
    }

    # Elasticsearch 검색 호출
    response = es.search(index="pillsoo_supplement_view", body=query, size=3)
    # print("Elasticsearch 응답:", response)

    # Elasticsearch 결과를 기존 형식으로 변환
    es_results = response["hits"]["hits"]
    
    # print("Elasticsearch 검색 결과:", es_results)
    
    custom_results = convert_es_result_to_custom_format(es_results)
    # print("변환된 결과:", custom_results)
    
    return custom_results

# 최종 추천 함수
def recommend_supplements(input_text: str) -> List[dict]:
    # 입력 텍스트를 전처리 (Ray 병렬 처리)
    preprocessed_text = ray.get(preprocess_text.remote(input_text))
    print(f"Preprocessed text: {preprocessed_text}")

    # 전처리된 텍스트로 Elasticsearch 검색 수행
    recommendations = search_in_elasticsearch(preprocessed_text)
    
    return recommendations