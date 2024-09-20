
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.metrics.pairwise import cosine_similarity
from konlpy.tag import Okt
from typing import List, Tuple

# Okt 객체 생성
okt = Okt()

# 전처리 함수 (명사 추출)
def preprocess_text(text: str) -> str:
    nouns = okt.nouns(text)
    return ' '.join(nouns)

# 유사도 계산 함수
def calculate_similarity(input_text: str, db_items: List[Tuple[int, str, str, str, str]]) -> List[Tuple[int, str, str, str, str]]:
    # 유저 입력 텍스트 전처리 (명사만 추출)
    preprocessed_input = preprocess_text(input_text)
    
    # DB에서 가져온 FUNCTIONALITY와 PILL_NAME을 결합한 텍스트도 전처리
    db_texts = [preprocess_text(f"{item[3]}") for item in db_items]

    # 입력된 텍스트와 DB의 텍스트를 결합
    texts = [preprocessed_input] + db_texts
    vectorizer = TfidfVectorizer().fit_transform(texts)
    vectors = vectorizer.toarray()
    
    # 유사도 계산
    cosine_sim = cosine_similarity(vectors[0:1], vectors[1:])
    similarity_scores = list(enumerate(cosine_sim[0]))
    
    # 유사도 순으로 정렬하여 상위 3개 반환
    sorted_scores = sorted(similarity_scores, key=lambda x: x[1], reverse=True)
    top_matches = sorted_scores[:3]
    
    return [db_items[i[0]] for i in top_matches]  # 상위 3개의 데이터 반환
