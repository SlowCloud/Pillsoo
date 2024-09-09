# 유사도 알고리즘
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.metrics.pairwise import cosine_similarity

def calculate_similarity(input_text, db_items):
    db_texts = [item[2] for item in db_items]  # FUNCTIONALITY 열만 추출
    texts = [input_text] + db_texts
    vectorizer = TfidfVectorizer().fit_transform(texts)
    vectors = vectorizer.toarray()
    
    cosine_sim = cosine_similarity(vectors[0:1], vectors[1:])
    similarity_scores = list(enumerate(cosine_sim[0]))
    sorted_scores = sorted(similarity_scores, key=lambda x: x[1], reverse=True)
    
    top_matches = sorted_scores[:3]
    return [db_items[i[0]] for i in top_matches]  # 상위 3개의 데이터 반환
