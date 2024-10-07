'''sql
CREATE TABLE Supplements (
    id INT AUTO_INCREMENT PRIMARY KEY,
    PILL_NAME VARCHAR(255),
    EXPIRATION_DATE VARCHAR(100),
    APPEARANCE TEXT,
    DOSE_AMOUNT TEXT,
    STORAGE_METHOD TEXT,
    DOSE_GUIDE TEXT,
    FUNCTIONALITY TEXT,
    IMAGE_URL VARCHAR(255)
);
'''

import json
import mysql.connector

# MySQL 연결
conn = mysql.connector.connect(
    host="j11e205.p.ssafy.io",
    user="root",
    password="ssafypasswordj11e205",
    database="SOS",
    port = 30306
)
cursor = conn.cursor()

# JSON 파일 열기
with open('pill_data.json', 'r', encoding='utf-8') as file:
    data = json.load(file)

# 데이터 삽입
for record in data:
    fields = record['fields']
    cursor.execute("""
        INSERT INTO Supplements 
        (PILL_NAME, EXPIRATION_DATE, APPEARANCE, DOSE_AMOUNT, STORAGE_METHOD, DOSE_GUIDE, FUNCTIONALITY, IMAGE_URL)
        VALUES (%s, %s, %s, %s, %s, %s, %s, %s)
    """, (
        fields['PILL_NAME'],
        fields['EXPIRATION_DATE'],
        fields['APPEARANCE'],
        fields['DOSE_AMOUNT'],
        fields['STORAGE_METHOD'],
        fields['DOSE_GUIDE'],
        fields['FUNCTIONALITY'],
        fields['IMAGE_URL']
    ))

# 커밋 및 연결 닫기
conn.commit()
cursor.close()
conn.close()
