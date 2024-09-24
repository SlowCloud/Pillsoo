from sqlalchemy import create_engine, Column, Integer, String, Text
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker

DATABASE_URL = "mysql+pymysql://root:ssafypasswordj11e205@j11e205.p.ssafy.io:30306/SOS"

engine = create_engine(DATABASE_URL)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
Base = declarative_base()

# Supplement 모델 정의
class Supplement(Base):
    __tablename__ = 'Supplement'

    supplementSeq = Column(Integer, primary_key=True, index=True)
    pill_name = Column(String, index=True)
    functionality = Column(String, index=True)
    preprocessed_text = Column(Text)  # 전처리된 텍스트를 저장할 필드 추가
