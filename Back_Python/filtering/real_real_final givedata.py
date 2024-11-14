import json
import pymysql

# MySQL 데이터베이스 연결 정보
db_config = {
    'host': 'REMOVED',
    'user': 'root',
    'password': 'REMOVED',
    'database': 'SOS',
    'port' : 30306
}

# JSON 파일 경로
json_file_path = 'new_supplement_data.json'

# 데이터베이스 연결
connection = pymysql.connect(**db_config)

try:
    with connection.cursor() as cursor:
        # JSON 파일 읽기
        with open(json_file_path, 'r', encoding='utf-8') as file:
            data = json.load(file)

        # 데이터 삽입을 위한 리스트
        insert_data = []

        # 데이터 준비
        for item in data:
            supplement_seq = item['supplementSeq']
            fields = item['fields']
            pill_name = fields['PILL_NAME']
            expiration_date = fields['EXPIRATION_DATE']
            appearance = fields['appearance']
            dose_amount = fields['DOSE_AMOUNT']
            storage_method = fields['STORAGE_METHOD']
            dose_guide = fields['DOSE_GUIDE']
            functionality = fields['functionality']
            image_url = fields['IMAGE_URL']
            preprocessed_text = fields['PREPROCESSED_TEXT']
            
            insert_data.append((supplement_seq, pill_name, expiration_date, appearance,
                                dose_amount, storage_method, dose_guide, functionality,
                                image_url, preprocessed_text))

        # SQL 삽입문
        sql = """
        INSERT INTO Supplement_backup_copy (supplementSeq, PILL_NAME, EXPIRATION_DATE, appearance, 
                                DOSE_AMOUNT, STORAGE_METHOD, DOSE_GUIDE, functionality, 
                                IMAGE_URL, PREPROCESSED_TEXT)
        VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s, %s)
        """

        # 배치 삽입
        cursor.executemany(sql, insert_data)

        # 커밋
        connection.commit()

finally:
    connection.close()

print("데이터가 성공적으로 삽입되었습니다.")