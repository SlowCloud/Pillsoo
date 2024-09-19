pipeline {
    agent {
        kubernetes {
            yaml """
apiVersion: v1
kind: Pod
metadata:
  labels:
    jenkins/agent-type: kaniko
  namespace: jenkins
spec:
  containers:
    - name: kaniko-spring
      image: gcr.io/kaniko-project/executor:debug
      command:
        - /busybox/cat
      tty: true
      volumeMounts:
        - name: docker-config
          mountPath: /kaniko/.docker/
    - name: kaniko-python
      image: gcr.io/kaniko-project/executor:debug
      command:
        - /busybox/cat
      tty: true
      volumeMounts:
        - name: docker-config
          mountPath: /kaniko/.docker/
  volumes:
    - name: docker-config
      secret:
        secretName: docker-config
            """
        }
    }

    environment {
        DOCKERHUB_USERNAME = "slowcloud"
        GITLAB_TOKEN = credentials("GITLAB_TOKEN")
    }

    stages {
      stage("build and push") {
        parallel {
          stage("build spring and push") {
            steps {
              container("kaniko-spring") {
                script {
                  def dockerfile = "Dockerfile"
                  def context = "./PillSoo"
                  def image = "${DOCKERHUB_USERNAME}/pillsoo-spring:${env.BUILD_NUMBER}"
                  sh "/kaniko/executor --context ${context} --dockerfile ${dockerfile} --destination ${image}"
                }
              }
            }
          }
          stage("build python and push") {
            steps {
              container("kaniko-python") {
                script {
                  def dockerfile = "Dockerfile"
                  def context = "./GT/Pillsoo"
                  def image = "${DOCKERHUB_USERNAME}/pillsoo-python:${env.BUILD_NUMBER}"
                  sh "/kaniko/executor --context ${context} --dockerfile ${dockerfile} --destination ${image}"
                }
              }
            }
          }
        }
      }
      stage {
        stage("update manifest") {
          steps {
            script {
              sh '''
              # 1. 최신 manifest 리포지토리 가져오기
              git pull https://jenkins:${env.GITLAB_TOKEN}@lab.ssafy.com/s11-bigdata-recom-sub1/S11P21E205

              # 2. 이미지 태그 갱신
              sed -i "s|slowcloud/pillsoo-spring.*|slowcloud/pillsoo-spring:${env.BUILD_NUMBER}|g" service-deployment.yml
              sed -i "s|slowcloud/pillsoo-python.*|slowcloud/pillsoo-python:${env.BUILD_NUMBER}|g" service-deployment.yml

              # 3. 변경 사항 추가 및 커밋
              git add service-deployment.yml
              git commit -m "Update images: spring to ${env.BUILD_NUMBER}, python to ${env.BUILD_NUMBER}"

              # 4. 변경 사항 푸시
              git push https://jenkins:${env.GITLAB_TOKEN}@lab.ssafy.com/s11-bigdata-recom-sub1/S11P21E205
              '''
            }
          }
        }
      }
    }

    post {
        always {
            echo "The process is completed."
        }
    }
}
