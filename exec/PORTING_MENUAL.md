# 🛬 포팅 메뉴얼

## 목차

- [포팅 메뉴얼](#포팅-메뉴얼)
    - [목차](#목차)
    - [버전 정보](#-버전-정보)
    - [포트 정보](#-포트-정보)
    - [커스텀 옵션 설정](#️커스텀-옵션-설정)
        - [Back_Java](#back_java)
        - [Back_Python](#back_python)

## 버전 정보

- DB
    - mysql: 9.0.1
    - redis: 7.4.1
    - mongo: 8.0.0
- Back_Java
    - java: 17
    - spring boot: 3.3.3
- Back_Python
    - python: 3.9 (recommended)
    - fastapi: 0.115.0
- Backend
    - elasticsearch: 8.15.2 (recommended)
    - logstash: 8.15.2 (recommended)
- Infra 
    - kubernetes: 1.31
    - jenkins: 2.479 (jdk17)
    - argocd: 2.12.4
    - ingress-nginx: helm-chart-4.11.2
    - cert-manager: 1.16
- tools
    - jira
    - figma
    - git, gitlab
    - notion, mattermost

## 포트 정보

- DB
    - mysql
        - 3306
    - redis
        - 6379
    - mongo
        - 27017
- Backend
    - Back_Python
        - 8000
    - Back_Java
        - 8080
    - elasticsearch
        - 9200

## ️커스텀 옵션 설정

### Back_Java

시작하기에 앞서, `application.properties`에서 DB 주소를 변경해주어야 합니다.

해당 속성들을 다음과 같이 변경해주세요.
```properties
# mysql 서버 주소를 입력해주세요. <>는 생략해주시면 됩니다.
spring.datasource.url=<your-mysql-server>

# mysql에서 사용할 아이디, 비밀번호를 작성해주세요.
spring.datasource.username=<your-mysql-id>
spring.datasource.password=<your-mysql-password>

# Back_Python 서버의 주소입니다.
flask.api.url=<your-fastapi-server>
```

### Back_Python

`Pillsoo/app/database.py` 파일에서 DB 주소를 변경해주면 됩니다.
