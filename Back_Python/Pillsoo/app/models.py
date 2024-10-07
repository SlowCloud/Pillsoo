from sqlalchemy import Column, Integer, String,Text, ForeignKey, BigInteger
from .database import Base

class Supplement(Base):
    __tablename__ = 'Supplement'
    
    supplementSeq = Column(Integer, primary_key=True, index=True)
    pill_name = Column(String, index=True)
    functionality = Column(String, index=True)
    preprocessed_text = Column(Text)
    image_url = Column(String, index=True)
    dose_guide = Column(String, index=True)

class Age_Prefer(Base):
    __tablename__ = 'Age_Prefer'

    prefer_seq = Column(Integer, primary_key=True, index=True)
    PILL_pk = Column(Integer, ForeignKey('Supplement.supplementSeq'))
    AGE_GROUPS = Column(String(50))
    dose_guide = Column(String, index=True)

class SupplementViewDaily(Base):
    __tablename__ = 'supplement_view_daily'  # 뷰 이름을 사용

    supplementSeq = Column(Integer, primary_key=True)
    pill_name = Column(String)
    functionality = Column(String)
    preprocessed_text = Column(String)
    image_url = Column(String)
    dose_guide = Column(String)
    click_count = Column(Integer)  # 뷰에 click_count가 존재하는지 확인
