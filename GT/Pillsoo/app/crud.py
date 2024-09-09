from sqlalchemy.orm import Session
from .models import Supplement

def get_functionality_items(db: Session):
    return db.query(Supplement.supplementSeq,
                    Supplement.pill_name,
                    Supplement.functionality).all()
