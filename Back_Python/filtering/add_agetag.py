import json
import re

# JSON 파일 경로
pill_age_file = 'pill_age.json'
pill_data_file = 'pill_data.json'
output_file = 'matched_age_groups.json'

# JSON 파일 읽기
with open(pill_age_file, 'r', encoding='utf-8') as age_file:
    supplement_data = json.load(age_file)

with open(pill_data_file, 'r', encoding='utf-8') as data_file:
    product_data = json.load(data_file)

# 나이대와 보충제 정보를 엄격하게 매칭하기 위한 함수
def is_exact_match(text, pattern):
    return bool(re.search(rf'\b{re.escape(pattern)}\b', text))

# 나이대와 보충제 정보를 매핑할 딕셔너리
age_group_map = {}

# 나이대와 보충제 데이터 검색
for item in supplement_data:
    supplements = item['fields']['supplements']
    age_group = item['fields']['age_group']
    
    # 보충제 이름을 나이대와 매핑
    for supplement in supplements:
        if supplement not in age_group_map:
            age_group_map[supplement] = []
        age_group_map[supplement].append(age_group)
    
    # age_group 자체도 매핑
    if age_group not in age_group_map:
        age_group_map[age_group] = []

# 나이대와 관련된 키워드 리스트 (10대, 20대 등)
age_keywords = ["10대", "20대", "30대", "40대", "50대", "60대"]

# 보충제 정보에 나이대 추가
updated_product_data = []

# 연속된 공백을 하나의 공백으로 변환하는 함수
def clean_whitespace(text):
    return re.sub(r'\s+', ' ', text).strip()

for product in product_data:
    pill_name = clean_whitespace(product['fields']['PILL_NAME'])  # PILL_NAME 공백 정리
    functionality = clean_whitespace(product['fields']['FUNCTIONALITY'])  # FUNCTIONALITY 공백 정리
    expiration_date = clean_whitespace(product['fields'].get('EXPIRATION_DATE', ''))  # EXPIRATION_DATE 공백 정리
    
    # 보충제 이름과 기능성 정보로 나이대 찾기
    matched_age_groups = set()
    
    # PILL_NAME과 FUNCTIONALITY에서 나이대 검색
    for supplement, age_groups in age_group_map.items():
        if is_exact_match(pill_name, supplement) or is_exact_match(functionality, supplement):
            matched_age_groups.update(age_groups)
    
    # PILL_NAME에서 나이대 키워드 직접 검색하여 추가
    for keyword in age_keywords:
        if keyword in pill_name:
            matched_age_groups.add(keyword)
    
    # 결과를 새 JSON 파일에 저장
    updated_product = {
        "pk": product["pk"],
        "fields": {
            "PILL_NAME": pill_name,
            "EXPIRATION_DATE": expiration_date,  # EXPIRATION_DATE 공백 정리 추가
            "APPEARANCE": clean_whitespace(product['fields'].get('APPEARANCE', '')),  # APPEARANCE 공백 정리
            "DOSE_AMOUNT": clean_whitespace(product['fields'].get('DOSE_AMOUNT', '')),  # DOSE_AMOUNT 공백 정리
            "STORAGE_METHOD": clean_whitespace(product['fields'].get('STORAGE_METHOD', '')),  # STORAGE_METHOD 공백 정리
            "DOSE_GUIDE": clean_whitespace(product['fields'].get('DOSE_GUIDE', '')),  # DOSE_GUIDE 공백 정리
            "FUNCTIONALITY": functionality,
            "IMAGE_URL": product['fields'].get('IMAGE_URL', ''),
            "age_groups": list(matched_age_groups)  # 새로운 필드에 나이대 추가
        }
    }
    
    updated_product_data.append(updated_product)

# 새로운 JSON 파일로 저장
with open(output_file, 'w', encoding='utf-8') as out_file:
    json.dump(updated_product_data, out_file, ensure_ascii=False, indent=4)

print(f"Updated JSON file created: {output_file}")
