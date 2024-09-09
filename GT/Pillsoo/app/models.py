from sqlalchemy import Column, Integer, String
from .database import Base

class Supplement(Base):
    __tablename__ = 'Supplement'
    
    supplementSeq = Column(Integer, primary_key=True, index=True)
    pill_name = Column(String, index=True)
    functionality = Column(String, index=True)
