# 9/9

## 데이터 전처리

### 개요

- 박재현 군이 전처리한 pill_data.xlsx 파일을 json 파일로 변환 시켜야 한다.
  - > json 화 시켜야 하는 이유 : 
    - MySQL에 데이터를 넣을 때 json 파일로 변환 시켜야 한다.
    - Cold start 때 유저의 연령 별로 유저에게 영양제를 추천해줘야 하는데 연령별로 추천해줘야하는 영양제에 관한 정보가 없다.

- pill_data.xlsx : 박재현 군이 전처리한 영양제 데이터 파일

- xlsx_to_json.py : xlsx 파일 -> json 파일 

- pill_data.json : 영양제 정보 데이터

- pill_age.json : 연령 별로 권장되는 영양제 데이터

- pill_data_add_age_groups.json : pill_data.json에 AGE_GROUPS 태그를 매핑한 데이터

- Age_Prefer.json : 나이별 권장되는 영양제 데이터

### 솔루션

1. xlsx파일을 json 파일로 변환한다.
2. json 파일이 조금 난잡하므로 깔끔하게 처리한다.
3. 연령별로 복용 권장되는 영양제에 관한 기사, 논문을 서칭한다.
4. 식품의약품안전처에서 권장하는 데이터를 참고하여 pill_age.json을 생성한다.
  - https://www.stcarollo.or.kr/0401/5683
5. pill_age.json 데이터의 age_group 데이터가 PILL_NAME 와 단어 경계 검사를 했을때 해당한다면 해당하는 영양제 데이터에 AGE_GROUPS 태그를 부여한다.
6. pill_age.json 데이터의 supplements의 데이터가 pill_data.json 의 PILL_NAME, FUNCITONALITY 와 단어 경계 검사 했을 때 해당한다면 해당하는 영양제 데이터에 AGE_GROUPS 태그를 부여한다.
7. pill_data_add_age_groups.json 생성
8. 하지만 이럴 경우 제 1정규화를 만족하지 못한다.

  ```json
  {
      "pk": 2020,
      "fields": {
          "PILL_NAME": "리얼메디 국대 초임계 알티지(rTG) 오메가 3",
          "EXPIRATION_DATE": "제조일로부터 24개월까지",
          "APPEARANCE": "이미, 이취가 없으며 고유의 향미를 지닌 연한 노란 연두색의 내용물을 함유한 투명색 장방형 연질캡슐",
          "DOSE_AMOUNT": "1일 1회, 1회 1캡슐을 충분한 물과 함께 섭취",
          "STORAGE_METHOD": "고온다습한 곳이나 직사광선을 피하여 서늘한 곳에 보관.",
          "DOSE_GUIDE": "(가) 의약품(항응고제, 항혈소판제, 혈압강하제 등) 복용 시 전문가와 상담할 것 (나) 개인에 따라 피부 관련 이상반응이 발생할 수 있음 (다) 이상사례 발생 시 섭취를 중단하고 전문가와 상담할 것 (가) 고칼슘혈증이 있거나 의약품 복용 시 전문가와 상담할 것 (나) 이상사례 발생 시 섭취를 중단하고 전문가와 상담할 것",
          "FUNCTIONALITY": "혈중 중성지질 개선·혈행 개선·건조한 눈을 개선하여 눈 건강에 도움을 줄 수 있음 ①칼슘과 인이 흡수되고 이용되는데 필요②뼈의 형성과 유지에 필요③골다공증발생 위험 감소에 도움을 줌 ①항산화 작용을 하여 유해산소로부터 세포를 보호하는데 필요",
          "IMAGE_URL": "https://shopping-phinf.pstatic.net/main_2896879/28968796586.20240321105116.jpg",
          "AGE_GROUPS": [
              "50대",
              "20대"
          ]
      }
  }
  ```

  - 이런 형태의 json 파일을 만들어야 한다.

  ```json
  {
      "pk": 576,
      "fields": {
          "PILL_pk": 2020,
          "AGE_GROUPS": "50대"
      }
  },
  {
      "pk": 577,
      "fields": {
          "PILL_pk": 2020,
          "AGE_GROUPS": "20대"
      }
  }
  ```
9. make_age_prefer.py 로 위의 형태와 같게 json 파일을 만드는 코드를 작성한다.
10. Age_Prefer.json, pill_data.json 데이터를 MySQL에 연동하여 사용하면 된다.
