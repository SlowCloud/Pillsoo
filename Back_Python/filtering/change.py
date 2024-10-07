import json

# 파일을 불러오는 함수
def load_json_file(file_path):
    with open(file_path, 'r', encoding='utf-8') as f:
        return json.load(f)

# 파일을 저장하는 함수
def save_json_file(data, file_path):
    with open(file_path, 'w', encoding='utf-8') as f:
        json.dump(data, f, ensure_ascii=False, indent=4)

# "age_groups"를 "AGE_GROUPS"로 바꾸는 함수
def change_age_groups_key(data):
    for item in data:
        if 'fields' in item and 'age_groups' in item['fields']:
            # 기존 "age_groups" 값을 "AGE_GROUPS"로 변경
            item['fields']['AGE_GROUPS'] = item['fields'].pop('age_groups')
    return data

# 실행 코드
input_file = 'final_pill_data.json'
output_file = 'final_pill_data_modified.json'

# 파일 로드
pill_data = load_json_file(input_file)

# "age_groups"를 "AGE_GROUPS"로 변경
modified_data = change_age_groups_key(pill_data)

# 변경된 데이터를 파일에 저장
save_json_file(modified_data, output_file)

print(f'파일이 성공적으로 변환되었습니다: {output_file}')
