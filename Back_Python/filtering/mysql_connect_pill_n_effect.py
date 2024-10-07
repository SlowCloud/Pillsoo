import mysql.connector
import json

# MySQL 연결 설정
conn = mysql.connector.connect(
    host="j11e205.p.ssafy.io",
    user="root",
    password="ssafypasswordj11e205",
    database="SOS",
    port=30306
)
cursor = conn.cursor()

# JSON 파일 읽기
with open('supplement_effect_categories.json', 'r', encoding='utf-8') as file:
    data = json.load(file)

# MySQL 테이블 생성 쿼리 (이미 테이블이 존재할 경우 생략 가능)
create_table_query = """
CREATE TABLE IF NOT EXISTS Effect_Categories (
    effect_seq INT AUTO_INCREMENT PRIMARY KEY,
    supplement_seq INT,
    effect_name VARCHAR(255)
);
"""
cursor.execute(create_table_query)

# 데이터 삽입을 위한 쿼리
for record in data:
    fields = record['fields']
    cursor.execute("""
        INSERT INTO Effect_Categories 
        (supplement_seq, effect_name)
        VALUES (%s, %s)
    """, (
        fields['supplement_seq'],
        fields['effect_name']
    ))

# 커밋 및 연결 닫기
conn.commit()
cursor.close()
conn.close()

print("JSON 파일 데이터를 성공적으로 삽입했습니다.")

'''
눈 건강
피부 건강
체지방
혈관
간 건강
장 건강
스트레스
수면
면역
콜레스테롤
뼈 건강
노화
항산화
소화
혈압
혈당
치아
관절
갑상선
'''
# 총 19개 종류의 건강 카테고리가 있음
