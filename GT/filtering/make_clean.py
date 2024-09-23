import json

# 기존 JSON 파일 경로
input_file = 'pill_data.json'
# 변환된 JSON 파일 경로
output_file = 'transformed_pill_data.json'

# 기존 JSON 파일 읽기
with open(input_file, 'r', encoding='utf-8') as f:
    original_data = json.load(f)

# 변환된 데이터를 저장할 리스트
transformed_data = []

# 변환 과정
for index, item in enumerate(original_data, start=1):
    # 변환된 항목 생성
    transformed_item = {
        "pk": index,
        "fields": {}
    }
    
    # 모든 필드를 fields에 추가
    for key, value in item.items():
        transformed_item["fields"][key] = value
    
    # 변환된 항목을 리스트에 추가
    transformed_data.append(transformed_item)

# 변환된 데이터 JSON 파일로 저장
with open(output_file, 'w', encoding='utf-8') as f:
    json.dump(transformed_data, f, ensure_ascii=False, indent=2)

print("변환 완료")
