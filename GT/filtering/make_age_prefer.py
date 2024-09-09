import json

# final_pill_data_modified.json 파일 열기
with open('final_pill_data_modified.json', 'r', encoding='utf-8') as file:
    data = json.load(file)

# 변환된 데이터를 담을 리스트 생성
new_data = []

# 원본 JSON의 각 항목을 순회
for item in data:
    pill_pk = item['pk']
    age_groups = item['fields']['AGE_GROUPS']
    
    # 각 AGE_GROUP에 대해 새로운 딕셔너리 생성
    for age_group in age_groups:
        new_item = {
            "pk": len(new_data) + 1,  # 새로운 pk 값 생성
            "fields": {
                "PILL_pk": pill_pk,
                "AGE_GROUPS": age_group
            }
        }
        new_data.append(new_item)

# 변환된 데이터를 새로운 JSON 파일로 저장
with open('new_pill_data.json', 'w', encoding='utf-8') as outfile:
    json.dump(new_data, outfile, ensure_ascii=False, indent=4)

print("새로운 JSON 파일 생성 완료: new_pill_data.json")
