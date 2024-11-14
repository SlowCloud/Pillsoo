import json
import mysql.connector

# MySQL 연결
conn = mysql.connector.connect(
    host="REMOVED",
    user="root",
    password="ssafypasswordj11e205",
    database="SOS",
    port = 30306
)
cursor = conn.cursor()

# JSON 파일 열기
with open('new_supplement_data_without_jul_su.json', 'r', encoding='utf-8') as file:
    data = json.load(file)
    
# 데이터 삽입
for record in data:
    fields = record['fields']
    cursor.execute("""
        INSERT INTO Supplement_backup 
        (PILL_NAME, EXPIRATION_DATE, appearance, DOSE_AMOUNT, STORAGE_METHOD, DOSE_GUIDE, functionality, IMAGE_URL, PREPROCESSED_TEXT, preprocessed)
        VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s, %s)
    """, (
        fields['PILL_NAME'],
        fields['EXPIRATION_DATE'],
        fields['appearance'],
        fields['DOSE_AMOUNT'],
        fields['STORAGE_METHOD'],
        fields['DOSE_GUIDE'],
        fields['functionality'],
        fields['IMAGE_URL'],
        fields['PREPROCESSED_TEXT'],
        fields['preprocessed']
    ))

# 커밋 및 연결 닫기
conn.commit()
cursor.close()
conn.close()