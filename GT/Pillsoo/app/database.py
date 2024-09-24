from sqlalchemy import create_engine
# 수정된 코드
from sqlalchemy.orm import declarative_base,sessionmaker


DATABASE_URL = "mysql+pymysql://root:ssafypasswordj11e205@j11e205.p.ssafy.io:30306/SOS"


engine = create_engine(DATABASE_URL)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
Base = declarative_base()

# DB 세션을 반환하는 의존성
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()
