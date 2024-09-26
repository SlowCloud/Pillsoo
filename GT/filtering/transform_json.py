import json

# 기존 JSON 데이터 로드
with open('updated_supplement_data.json', 'r', encoding='utf-8') as infile:
    data = json.load(infile)

# 데이터 변환
transformed_data = []
for item in data:
    transformed_item = {
        "supplementSeq": item["supplementSeq"],
        "fields": {
            "PILL_NAME": item["PILL_NAME"],
            "EXPIRATION_DATE": item["EXPIRATION_DATE"],
            "APPEARANCE": item["appearance"],
            "DOSE_AMOUNT": item["DOSE_AMOUNT"],
            "STORAGE_METHOD": item["STORAGE_METHOD"],
            "DOSE_GUIDE": item["DOSE_GUIDE"],
            "FUNCTIONALITY": item["functionality"],
            "IMAGE_URL": item["IMAGE_URL"],
            "PREPROCESSED_TEXT": item["PREPROCESSED_TEXT"]  # 추가된 필드
        }
    }
    transformed_data.append(transformed_item)

# 변환된 데이터를 새로운 JSON 파일에 저장
with open('new_supplement_data.json', 'w', encoding='utf-8') as outfile:
    json.dump(transformed_data, outfile, ensure_ascii=False, indent=2)

print("변환 완료! 새로운 JSON 파일이 생성되었습니다.")
