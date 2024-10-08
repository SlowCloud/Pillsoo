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
    - name: git
      image: alpine/git
      command:
        - sleep
      args:
        - infinity
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
                buildAndPush 'pillsoo-spring', './Pillsoo'
              }
            }
          }
          stage("build python and push") {
            steps {
              container("kaniko-python") {
                buildAndPush 'pillsoo-python', './GT/Pillsoo'
              }
            }
          }
        }
      }
      stage("update manifest") {
        steps {
          container("git") {
            script {
              sh """
              # 1. 최신 manifest 리포지토리 가져오기
              cd /
              git clone https://jenkins:${env.gitlab_token}@lab.ssafy.com/sju9417/j11e205-manifest
              cd j11e205-manifest

              # 2. 이미지 태그 갱신
              sed -i "s|slowcloud/pillsoo-spring.*|slowcloud/pillsoo-spring:${env.build_number}|g" service-deployment.yml
              sed -i "s|slowcloud/pillsoo-python.*|slowcloud/pillsoo-python:${env.build_number}|g" service-deployment.yml

              # 3. 변경 사항 추가 및 커밋
              git config --global user.email "sju9417@gmail.com"
              git config --global user.name "jenkins"
              git add service-deployment.yml
              git commit -m "update images: spring to ${env.build_number}, python to ${env.build_number}"

              # 4. 변경 사항 푸시
              git push https://jenkins:${env.gitlab_token}@lab.ssafy.com/sju9417/j11e205-manifest master
              """
            }
          }
        }
      }
    }

    post {
        always {
            echo "the process is completed."
        }
    }

  def buildAndPush(app_name, context) {
    script {
      def image = "${DOCKERHUB_USERNAME}/${app_name}:${env.BUILD_NUMBER}"
      sh "/kaniko/executor --context ${context} --destination ${image} --cache=true --cache-repo=${DOCKERHUB_USERNAME}/${image}-cache"
    }
  }
}
