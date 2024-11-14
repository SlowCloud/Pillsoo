
import json
import pymysql

# effect_category.json 파일을 읽어옵니다.
with open('effect_category.json', 'r', encoding='utf-8') as file:
    effect_categories = json.load(file)

# MySQL 데이터베이스에 연결
connection = pymysql.connect(
    host='REMOVED',
    user='root',
    password='REMOVED',
    database='SOS',
    port = 30306
)

try:
    with connection.cursor() as cursor:
        # Supplement 테이블에서 데이터를 조회합니다.
        cursor.execute("SELECT supplementSeq, PREPROCCESSED_TEXT FROM Supplement")
        supplements = cursor.fetchall()

        effect_mapping = []
        
        # preprocessed_text와 일치하는 effect_category가 있는지 확인합니다.
        for supplement in supplements:
            supplementSeq, preprocessed_text = supplement
            for effect in effect_categories:
                effect_pk = effect['pk']
                effect_category = effect['fields']['effect_category']
                
                if effect_category in preprocessed_text:
                    effect_mapping.append({
                        "effect_seq": effect_pk,
                        "supplementSeq": supplementSeq,
                        "effect_name": effect_category
                    })
finally:
    connection.close()

# 결과를 새로운 JSON 파일에 저장합니다.
with open('effect_mapping.json', 'w', encoding='utf-8') as file:
    json.dump(effect_mapping, file, ensure_ascii=False, indent=4)

print("JSON 파일이 성공적으로 생성되었습니다.")
