from sqlalchemy.orm import Session
from sqlalchemy import func

from .models import Supplement, Age_Prefer, SupplementViewDaily

def get_functionality_items(db: Session):
    return db.query(Supplement.supplementSeq,
                    Supplement.pill_name,
                    Supplement.functionality,
                    Supplement.preprocessed_text,
                    Supplement.dose_guide,
                    Supplement.image_url).all()

def get_top_supplements_by_age_and_click_count(db: Session, age_group: str, limit: int = 3):
    # 나이 그룹에 해당하고 click_count가 10 이상인 영양제만 가져옴
    return db.query(SupplementViewDaily).join(Age_Prefer, SupplementViewDaily.supplementSeq == Age_Prefer.PILL_pk)\
             .filter(SupplementViewDaily.click_count >= 10, Age_Prefer.AGE_GROUPS == age_group)\
             .order_by(SupplementViewDaily.click_count.desc())\
             .limit(limit).all()

def get_random_supplements_by_age(db: Session, age_group: str, limit: int = 3):
    # 나이 그룹에 해당하는 영양제를 무작위로 가져옴 (click_count에 상관없이)
    return db.query(SupplementViewDaily).join(Age_Prefer, SupplementViewDaily.supplementSeq == Age_Prefer.PILL_pk)\
             .filter(Age_Prefer.AGE_GROUPS == age_group)\
             .order_by(func.rand())\
             .limit(limit).all()