import json

# \n을 공백으로 변환하는 함수
def clean_text(text):
    return text.replace('\n', ' ')

# JSON 파일 읽기
def read_json_file(file_path):
    with open(file_path, 'r', encoding='utf-8') as file:
        return json.load(file)

# JSON 파일 쓰기
def write_json_file(file_path, data):
    with open(file_path, 'w', encoding='utf-8') as file:
        json.dump(data, file, ensure_ascii=False, indent=2)

# 데이터 정리
def clean_json_data(data):
    if isinstance(data, dict):
        return {key: clean_json_data(value) for key, value in data.items()}
    elif isinstance(data, list):
        return [clean_json_data(item) for item in data]
    elif isinstance(data, str):
        return clean_text(data)
    else:
        return data

# 파일 경로 설정
input_file_path = 'pill_data.json'
output_file_path = 'cleaned_pill_data.json'

# JSON 데이터 읽기
data = read_json_file(input_file_path)

# 데이터 정리
cleaned_data = clean_json_data(data)

# 정리된 데이터 JSON 파일로 쓰기
write_json_file(output_file_path, cleaned_data)

print(f"Cleaned data has been saved to {output_file_path}")
