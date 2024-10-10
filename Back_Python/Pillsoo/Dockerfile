FROM python:3.9.13

WORKDIR /pillsoo/
COPY ./requirements.txt ./requirements.txt
RUN pip install -r requirements.txt

RUN apt update && apt install openjdk-17-jdk -y

COPY ./app ./app

ENTRYPOINT uvicorn app.main:app --host 0.0.0.0 --reload
EXPOSE 8000
