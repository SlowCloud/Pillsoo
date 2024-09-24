from fastapi import FastAPI
from .similarity import router as similarity_router
from .preprocess import preprocess_and_save
from .database import SessionLocal

app = FastAPI()

# 유사도 계산 API 라우터 추가
app.include_router(similarity_router)

# 서버 시작 시 DB 데이터 전처리
@app.on_event("startup")
def startup_event():
    db = SessionLocal()
    preprocess_and_save(db)
    db.close()
