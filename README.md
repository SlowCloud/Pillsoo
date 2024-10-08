# Pillsoo

![Pillsoo](resource/PillSooLogo.png)

## 목차

- [프로젝트 소개](#프로젝트-소개)
- [주요 기능](#주요-기능)
- [차별점 및 독창성](#차별점-및-독창성)
- [서비스 화면](#서비스-화면)
- [주요 기술 스택](#주요-기술-스택)
    - [Frontend](#frontend)
    - [Backend](#backend)
    - [DB](#db)
    - [Infra](#infra)
- [산출물](산출물)
    - [인프라 아키텍처](#인프라-아키텍처)
    - [ERD](#erd)
    - [포팅 메뉴얼](#포팅-메뉴얼)

## 프로젝트 소개

## 주요 기능

- 영양제 검색
- 영양제 OCR 촬영
- 사용자 정보 기반 영양제 추천
- 영양제 복용 목록 관리
- 영양제 알람 관리

## 차별점 및 독창성

1. **정확도 및 클릭 횟수 기반 검색**
    - 엘라스틱서치의 정확도 기반 검색으로 영양제 검색 가능
    - 클릭 횟수를 반영하여 인기 있는 영양제가 상단에 노출되도록 구성
2. **추천 서비스 콜드 부팅 대비**
    - 영양제 별 태그를 구성하여 사용자 데이터가 적을 때에도 추천 시스템 작동 가능
3. **OCR을 통한 텍스트 검색**
    - OCR을 통해 영양제를 검색하여 복용 중인 영양제 등록 가능
4. **문장형 텍스트 기반 검색**
    - 증세 또는 원하는 기능을 문장형으로 작성하여 영양제 검색 가능
5. **빠른 검색을 위한 검색 데이터 캐싱**
    - 동일한 검색에 대해 빠른 응답이 가능하도록 캐싱 구현
6. **JWT 기반 인증**
    - JWT 기반 인증으로 서버 부담이 적은 접근제어 구현

## 서비스 화면

## 주요 기술 스택

Badges from [here](https://github.com/alexandresanlim/Badges4-README.md-Profile) 

### Frontend

![Typescript](https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white)

![React Native](https://img.shields.io/badge/react_native-%2320232a.svg?style=for-the-badge&logo=react&logoColor=%2361DAFB)
![Axios](https://img.shields.io/badge/axios-671ddf?&style=for-the-badge&logo=axios&logoColor=white)
![Redux](https://img.shields.io/badge/Redux-593D88?style=for-the-badge&logo=redux&logoColor=white)
![Firebase](https://img.shields.io/badge/firebase-ffca28?style=for-the-badge&logo=firebase&logoColor=black)
![Google Cloud](https://img.shields.io/badge/GoogleCloud-%234285F4.svg?style=for-the-badge&logo=google-cloud&logoColor=white)

### Backend

![Java](https://img.shields.io/badge/java-%23ED8B00.svg?style=for-the-badge&logo=openjdk&logoColor=white)
![Python](https://img.shields.io/badge/python-3670A0?style=for-the-badge&logo=python&logoColor=ffdd54)

![Spring Boot](https://img.shields.io/badge/Spring_Boot-6DB33F?style=for-the-badge&logo=spring-boot&logoColor=white)
![Spring Security](https://img.shields.io/badge/Spring_Security-6DB33F?style=for-the-badge&logo=Spring-Security&logoColor=white)
![FastAPI](https://img.shields.io/badge/fastapi-109989?style=for-the-badge&logo=FASTAPI&logoColor=white)
![ElasticSearch](https://img.shields.io/badge/-ElasticSearch-005571?style=for-the-badge&logo=elasticsearch)

### DB

![MySQL](https://img.shields.io/badge/mysql-4479A1.svg?style=for-the-badge&logo=mysql&logoColor=white)
![MongoDB](https://img.shields.io/badge/MongoDB-%234ea94b.svg?style=for-the-badge&logo=mongodb&logoColor=white)
![Redis](https://img.shields.io/badge/redis-%23DD0031.svg?style=for-the-badge&logo=redis&logoColor=white)

### Infra

![Kubernetes](https://img.shields.io/badge/kubernetes-%23326ce5.svg?style=for-the-badge&logo=kubernetes&logoColor=white)
![Argo CD](https://img.shields.io/badge/Argo%20CD-1e0b3e?style=for-the-badge&logo=argo&logoColor=#d16044)
![Jenkins](https://img.shields.io/badge/Jenkins-49728B?style=for-the-badge&logo=jenkins&logoColor=white)

### Tools

![Git](https://img.shields.io/badge/git-%23F05033.svg?style=for-the-badge&logo=git&logoColor=white)
![GitLab](https://img.shields.io/badge/gitlab-%23181717.svg?style=for-the-badge&logo=gitlab&logoColor=white)
![Jira](https://img.shields.io/badge/jira-%230A0FFF.svg?style=for-the-badge&logo=jira&logoColor=white)
![Notion](https://img.shields.io/badge/Notion-%23000000.svg?style=for-the-badge&logo=notion&logoColor=white)

## 산출물

### 인프라 아키텍처

![Infra](resource/infra.png)

### ERD

![ERD](resource/erd.png)

## 포팅 메뉴얼