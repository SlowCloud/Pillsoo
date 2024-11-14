
'''sql
CREATE TABLE Age_Prefer (
    id INT AUTO_INCREMENT PRIMARY KEY,
    PILL_pk INT,
    AGE_GROUPS VARCHAR(50)
);
'''

import json
import mysql.connector

# MySQL 연결
conn = mysql.connector.connect(
    host="REMOVED",
    user="root",
    password="REMOVED",
    database="SOS",
    port = 30306              # MySQL 포트 번호
)
cursor = conn.cursor()

# JSON 파일 열기
with open('Age_Prefer.json', 'r', encoding='utf-8') as file:
    data = json.load(file)

# 데이터 삽입
for record in data:
    fields = record['fields']
    cursor.execute("""
        INSERT INTO Age_Prefer (PILL_pk, AGE_GROUPS)
        VALUES (%s, %s)
    """, (
        fields['PILL_pk'],
        fields['AGE_GROUPS']
    ))

# 커밋 및 연결 닫기
conn.commit()
cursor.close()
conn.close()
