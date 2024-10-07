import pandas as pd

# 엑셀 파일을 읽어옵니다 (인코딩 문제 없음)
df = pd.read_excel('pill_data.xlsx')

# DataFrame을 JSON으로 변환합니다
json_data = df.to_json(orient='records', force_ascii=False)

# JSON 데이터를 파일로 저장합니다
with open('pill_data.json', 'w', encoding='utf-8') as f:
    f.write(json_data)
