from sqlalchemy import create_engine
from sqlalchemy.orm import declarative_base,sessionmaker
import redis

# MySQL 데이터베이스 URL 설정
DATABASE_URL = "mysql+pymysql://root:ssafypasswordj11e205@j11e205.p.ssafy.io:30306/SOS"

# SQLAlchemy 엔진과 세션 설정
engine = create_engine(DATABASE_URL)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
Base = declarative_base()

# Redis 클라이언트 설정
try:
    r = redis.Redis(host='localhost', port=6379, db=0)
except redis.exceptions.ConnectionError as e:
    r = None  # Redis가 사용 불가한 경우 None으로 설정

# DB 세션을 반환하는 의존성
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()
