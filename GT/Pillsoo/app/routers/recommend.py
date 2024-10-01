# app/routers/recommend.py

import hashlib
import json
from fastapi import APIRouter, Depends, Query
from sqlalchemy.orm import Session
from datetime import datetime, timedelta
from ..database import get_db, r, mongo_collection
from ..crud import get_functionality_items, get_supplements_by_age
from ..similarity import calculate_similarity, preprocess_text, search_in_elasticsearch
from typing import List, Dict, Any
import ray

# FastAPI 라우터 설정
router = APIRouter()

def generate_cache_key(text: str) -> str:
    # 입력 텍스트를 그대로 사용하여 캐시 키 생성
    return hashlib.md5(text.encode()).hexdigest()

@router.get("/api/v1/recommend/survey")
def recommend_supplements(client_text: str = Query(..., description="Client input text"), db: Session = Depends(get_db)) -> List[Dict[str, Any]]:
    # 캐시 키 생성
    cache_key = generate_cache_key(client_text)

    # 1. Redis에서 캐시된 결과 가져오기
    if r:
        cached_result = r.get(cache_key)
        if cached_result:
            return json.loads(cached_result)

    # 2. MongoDB에서 캐시된 결과 가져오기
    mongo_result = mongo_collection.find_one({"client_text": client_text})
    if mongo_result:
        # MongoDB에 결과가 있으면 Redis에 저장하고 반환 (1일 동안)
        if r:
            r.set(cache_key, json.dumps(mongo_result['result']), ex=86400)
        return mongo_result['result']
    
    # 3. MySQL 데이터베이스에서 아이템 가져오기
    db_items = get_functionality_items(db)  # 여기서 PREPROCESSED_TEXT를 포함한 데이터 가져오기

    # 유사도 계산
    top_matches = calculate_similarity(client_text, db_items)

    # 결과 형식 변환
    result = [
        {
            "supplementSeq": item[0],       # supplementSeq
            "pill_name": item[1],           # pill_name
            "functionality": item[2],       # functionality
            "dose_guide": item[4],          # dose_guide
            "image_url": item[5]            # image_url
        }
        for item in top_matches
    ]

    # 4. Elasticsearch에서 검색 수행
    if result[0]['supplementSeq'] == 1:
        
        sep_word_ref = preprocess_text.remote(client_text)
        sep_word = ray.get(sep_word_ref)  # ObjectRef를 실제 값으로 변환

        # 엘라스틱서치 검색 호출
        elasticsearch_results = search_in_elasticsearch(sep_word)
        # print("Elasticsearch 검색 결과:", elasticsearch_results)  # Elasticsearch 결과 출력
        
        # Elasticsearch 결과를 Redis와 MongoDB에 저장
        if r:
            r.set(cache_key, json.dumps(elasticsearch_results), ex=86400)  # Redis에 저장
        
        # MongoDB에 만료 시간이 있는 문서 저장 (1주일 TTL)
        expire_at = datetime.utcnow() + timedelta(seconds=604800)  # 현재 시간으로부터 1주일 후 만료
        mongo_collection.insert_one({"client_text": client_text, "result": elasticsearch_results, "expireAt": expire_at})  # MongoDB에 저장
        
        return elasticsearch_results  # 필요에 따라 결과를 반환할 수 있음
    
    # 5. MongoDB와 Redis에 결과 저장 (1분동안)
    if r:
        r.set(cache_key, json.dumps(result), ex=86400)  # Redis에 저장

    # MongoDB에 만료 시간이 있는 문서 저장 (1주일 TTL)
    expire_at = datetime.utcnow() + timedelta(seconds=604800)  # 현재 시간으로부터 1주일 후 만료
    mongo_collection.insert_one({"client_text": client_text, "result": result, "expireAt": expire_at})  # MongoDB에 저장
    
    return result

@router.get("/api/v1/recommend")
def recommend_supplements_by_age(age: int, db: Session = Depends(get_db)) -> List[Dict[str, Any]]:
    # 나이에 맞는 영양제 데이터를 가져옴
    db_items = get_supplements_by_age(db, age)

    # 반환할 형식으로 변환
    result = [
        {
            "supplementSeq": item.supplementSeq,
            "pill_name": item.pill_name,
            "functionality": item.functionality,
            "image_url": item.image_url,
            "dose_guide": item.dose_guide
        }
        for item in db_items
    ]

    return result
