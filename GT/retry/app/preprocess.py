from sqlalchemy.orm import Session
from konlpy.tag import Okt
from .database import Supplement

okt = Okt()

# 전처리 함수
def preprocess_text(text):
    nouns = okt.nouns(text)
    return ' '.join(nouns)

# MySQL에서 데이터를 가져와 전처리 후 DB에 업데이트
def preprocess_and_save(db: Session):
    supplements = db.query(Supplement).all()
    
    for supplement in supplements:
        combined_text = f"{supplement.pill_name} {supplement.functionality}"
        preprocessed_text = preprocess_text(combined_text)
        
        supplement.preprocessed_text = preprocessed_text  # 전처리된 텍스트 저장
    
    db.commit()  # 변경 사항 DB에 반영
