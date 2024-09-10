from fastapi import APIRouter, Depends
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.metrics.pairwise import cosine_similarity
from sqlalchemy.orm import Session
from .database import SessionLocal, Supplement

router = APIRouter()

# DB 세션 의존성
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

# 유사도 계산 API
@router.get("/recommend/similarity")
def calculate_similarity(input_text: str, db: Session = Depends(get_db)):
    # 사전 전처리된 텍스트 불러오기
    supplements = db.query(Supplement).all()
    db_texts = [supplement.preprocessed_text for supplement in supplements]

    # 입력 텍스트 전처리
    vectorizer = TfidfVectorizer()
    texts = [input_text] + db_texts
    vectors = vectorizer.fit_transform(texts).toarray()

    cosine_sim = cosine_similarity(vectors[0:1], vectors[1:])
    similarity_scores = list(enumerate(cosine_sim[0]))
    sorted_scores = sorted(similarity_scores, key=lambda x: x[1], reverse=True)

    top_matches = sorted_scores[:3]
    return [supplements[i[0]] for i in top_matches]  # 상위 3개의 데이터 반환
