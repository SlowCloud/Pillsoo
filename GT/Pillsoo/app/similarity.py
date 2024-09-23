from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.metrics.pairwise import cosine_similarity
from konlpy.tag import Okt
from typing import List, Tuple
# import concurrent.futures

import ray

ray.init(num_cpus=16, num_gpus=1, ignore_reinit_error=True)

# Okt 객체 생성
okt = Okt()

# 전처리 함수 (명사 추출)
def preprocess_text(text: str) -> str:
    nouns = okt.nouns(text)
    return ' '.join(nouns)

# 단일 단어에 대한 유사도 계산 함수 (Ray 병렬 처리)
@ray.remote
def calculate_similarity_for_word(word: str, db_items: List[Tuple[int, str, str, str, str]]) -> List[Tuple[int, str, str, str, str, float]]:
    # DB에서 가져온 FUNCTIONALITY를 전처리
    db_texts = [preprocess_text(f"{item[3]}") for item in db_items]

    # 입력된 단어와 DB의 텍스트를 벡터화
    texts = [word] + db_texts
    vectorizer = TfidfVectorizer().fit_transform(texts)
    vectors = vectorizer.toarray()

    # 유사도 계산
    cosine_sim = cosine_similarity(vectors[0:1], vectors[1:])
    similarity_scores = list(enumerate(cosine_sim[0]))

    return similarity_scores

# 병렬 처리로 단어별 유사도 계산
def calculate_similarity(input_text: str, db_items: List[Tuple[int, str, str, str, str]]) -> List[Tuple[int, str, str, str, str]]:
    # 입력 텍스트를 단어로 분리
    words = preprocess_text(input_text).split()

    # Ray를 사용한 병렬 처리
    futures = [calculate_similarity_for_word.remote(word, db_items) for word in words]
    results = ray.get(futures)

    # 결과를 저장할 딕셔너리
    combined_scores = {}

    # 유사도 점수를 합산
    for similarity_scores in results:
        for idx, score in similarity_scores:
            if idx not in combined_scores:
                combined_scores[idx] = score
            else:
                combined_scores[idx] += score

    # 유사도 점수에 따라 상위 3개의 결과 정렬
    sorted_scores = sorted(combined_scores.items(), key=lambda x: x[1], reverse=True)
    top_matches = sorted_scores[:3]

    return [db_items[i[0]] for i in top_matches]  # 상위 3개의 데이터 반환

# if __name__ == "__main__":
#     ray.init(num_cpus=16, num_gpus=1, ignore_reinit_error=True)

if __name__ == "__main__":
    if not ray.is_initialized():
        ray.init(num_cpus=16, num_gpus=1, ignore_reinit_error=True)

'''
# 단일 단어에 대한 유사도 계산
def calculate_similarity_for_word(word: str, db_items: List[Tuple[int, str, str, str, str]]) -> List[Tuple[int, str, str, str, str, float]]:
    # DB에서 가져온 FUNCTIONALITY와 PILL_NAME을 전처리
    db_texts = [preprocess_text(f"{item[3]}") for item in db_items]

    # 입력된 단어와 DB의 텍스트를 벡터화
    texts = [word] + db_texts
    vectorizer = TfidfVectorizer().fit_transform(texts)
    vectors = vectorizer.toarray()

    # 유사도 계산
    cosine_sim = cosine_similarity(vectors[0:1], vectors[1:])
    similarity_scores = list(enumerate(cosine_sim[0]))
    
    return similarity_scores

# 병렬 처리를 통해 단어별로 유사도 계산
def calculate_similarity(input_text: str, db_items: List[Tuple[int, str, str, str, str]]) -> List[Tuple[int, str, str, str, str]]:
    # 입력 텍스트를 단어로 분리
    words = preprocess_text(input_text).split()

    # 결과를 저장할 리스트
    combined_scores = {}

    # 병렬 처리로 각 단어에 대해 유사도 계산
    with concurrent.futures.ThreadPoolExecutor() as executor:
        futures = {executor.submit(calculate_similarity_for_word, word, db_items): word for word in words}
        
        for future in concurrent.futures.as_completed(futures):
            word = futures[future]
            try:
                similarity_scores = future.result()
                
                # 유사도 점수를 합산
                for idx, score in similarity_scores:
                    if idx not in combined_scores:
                        combined_scores[idx] = score
                    else:
                        combined_scores[idx] += score
            except Exception as exc:
                print(f'{word} generated an exception: {exc}')

    # 유사도 순으로 정렬하여 상위 3개 반환
    sorted_scores = sorted(combined_scores.items(), key=lambda x: x[1], reverse=True)
    top_matches = sorted_scores[:3]

    return [db_items[i[0]] for i in top_matches]  # 상위 3개의 데이터 반환
'''

