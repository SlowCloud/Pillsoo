import json
from konlpy.tag import Okt

# 명사 추출을 위한 함수
def extract_nouns(text):
    okt = Okt()
    nouns = okt.nouns(text)  # 명사 추출
    return ' '.join(nouns)   # 추출된 명사를 공백으로 연결해 반환

# JSON 파일 로드
with open('final_data.json', 'r', encoding='utf-8') as file:
    supplement_data = json.load(file)

# 데이터 처리
for supplement in supplement_data:
    functionality_text = supplement['fields'].get('functionality', '')
    
    # 명사 추출
    nouns = extract_nouns(functionality_text)
    
    # preprocessed 필드에 추가
    supplement['fields']['preprocessed'] = nouns

# 결과를 새로운 JSON 파일로 저장
with open('new_supplement_data_with_preprocessed.json', 'w', encoding='utf-8') as file:
    json.dump(supplement_data, file, ensure_ascii=False, indent=4)

print("명사 추출이 완료된 JSON 파일이 저장되었습니다.")
