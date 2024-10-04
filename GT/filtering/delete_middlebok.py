import json

# 중복을 제거하고 특정 문자열 '줄 수'를 제거하는 함수
def process_text(text):
    text = text.replace('줄 수', '')  # '줄 수' 문자열 제거
    words = text.split()  # 단어별로 분리
    unique_words = list(dict.fromkeys(words))  # 순서를 유지한 채 중복 제거
    return ' '.join(unique_words)  # 다시 공백으로 연결

# JSON 파일 로드
with open('new_supplement_data_with_preprocessed.json', 'r', encoding='utf-8') as file:
    supplement_data = json.load(file)

# 데이터 처리
for supplement in supplement_data:
    preprocessed_text = supplement['fields'].get('preprocessed', '')
    
    # '줄 수' 제거 및 중복 단어 제거
    processed_text = process_text(preprocessed_text)
    
    # 처리된 텍스트로 업데이트
    supplement['fields']['preprocessed'] = processed_text

# 결과를 새로운 JSON 파일로 저장
with open('new_supplement_data_without_jul_su.json', 'w', encoding='utf-8') as file:
    json.dump(supplement_data, file, ensure_ascii=False, indent=4)

print("처리가 완료된 JSON 파일이 저장되었습니다.")
