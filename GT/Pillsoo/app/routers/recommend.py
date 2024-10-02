# app/routers/recommend.py

import hashlib
import json
from fastapi import APIRouter, Depends, Query
from sqlalchemy.orm import Session
from datetime import datetime, timedelta
from ..database import get_db, r, mongo_collection
from ..crud import get_top_supplements_by_age_and_click_count, get_random_supplements_by_age
from ..similarity import preprocess_text, search_in_elasticsearch
from typing import List, Dict, Any
import ray

from elasticsearch import Elasticsearch
import random

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

    # 3. 입력 텍스트를 전처리
    sep_word_ref = preprocess_text.remote(client_text)
    sep_word = ray.get(sep_word_ref)  # ObjectRef를 실제 값으로 변환

    # 4. Elasticsearch에서 검색 수행
    elasticsearch_results = search_in_elasticsearch(sep_word)
    # print("Elasticsearch 검색 결과:", elasticsearch_results)  # Elasticsearch 결과 출력
    
    # 5. Elasticsearch 결과를 Redis와 MongoDB에 저장
    if r:
        r.set(cache_key, json.dumps(elasticsearch_results), ex=86400)  # Redis에 저장
    
    # MongoDB에 만료 시간이 있는 문서 저장 (1주일 TTL)
    expire_at = datetime.utcnow() + timedelta(seconds=604800)  # 현재 시간으로부터 1주일 후 만료
    mongo_collection.insert_one({"client_text": client_text, "result": elasticsearch_results, "expireAt": expire_at})  # MongoDB에 저장

    # 6. Elasticsearch 결과 반환
    return elasticsearch_results

@router.get("/api/v1/recommend")
def recommend_supplements_by_age(age: int, db: Session = Depends(get_db)) -> List[Dict[str, Any]]:
    # 나이에 맞는 AGE_GROUPS 구하기
    if 10 <= age < 20:
        age_group = "10대"
    elif 20 <= age < 30:
        age_group = "20대"
    elif 30 <= age < 40:
        age_group = "30대"
    elif 40 <= age < 50:
        age_group = "40대"
    elif 50 <= age < 60:
        age_group = "50대"
    elif age >= 60:
        age_group = "60대 이상"
    
    # 해당 나이 그룹에서 click_count가 10 이상인 상위 3개의 영양제를 가져옴
    top_supplements = get_top_supplements_by_age_and_click_count(db, age_group)

    # 만약 상위 3개의 영양제가 없다면 해당 나이 그룹에 맞는 영양제를 무작위로 추천
    if not top_supplements or len(top_supplements) < 3:
        # 나이에 맞는 영양제를 무작위로 가져옴
        random_supplements = get_random_supplements_by_age(db, age_group)

        if random_supplements:
            # 무작위로 가져온 영양제가 있으면, 3개 이하로 샘플링
            supplements = random.sample(random_supplements, min(3, len(random_supplements)))
            is_random = True  # 랜덤으로 선택된 경우
        else:
            supplements = []  # 나이에 맞는 영양제가 없으면 빈 리스트 반환
            is_random = True  # 결과가 없으므로 랜덤으로 처리
    else:
        # click_count가 높은 영양제를 반환
        supplements = top_supplements
        is_random = False  # 클릭 수로 선택된 경우

    # 결과 반환
    result = [
        {
            "supplementSeq": item.supplementSeq,
            "pill_name": item.pill_name,
            "functionality": item.functionality,
            "image_url": item.image_url,
            "dose_guide": item.dose_guide,
            "is_random": is_random  # is_random 필드 추가
        }
        for item in supplements
    ]

    return result
