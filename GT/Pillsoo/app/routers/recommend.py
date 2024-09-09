# 클라이언트로부터 입력을 받아 유사도 계산 후 상위 3개의 데이터를 반환하는 API

from fastapi import APIRouter, Depends, Query
from sqlalchemy.orm import Session
from ..database import get_db
from ..crud import get_functionality_items
from ..similarity import calculate_similarity

router = APIRouter()

@router.get("/api/v1/recommend/survey")
def recommend_supplements(client_text: str = Query(..., description="Client input text"), db: Session = Depends(get_db)):
    db_items = get_functionality_items(db)
    top_matches = calculate_similarity(client_text, db_items)
    
    # 반환할 형식에 맞게 변환
    result = [
        {
            "supplementSeq": item[0],
            "pill_name": item[1],
            "functionality": item[2]
        }
        for item in top_matches
    ]
    
    return result
