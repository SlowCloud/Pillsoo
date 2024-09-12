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
    - name: kaniko
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
    }

    stages {
        stage("Build Docker Image & Push to Docker Hub") {
            steps {
                container("kaniko") {
                    script {
                        def dockerfile = "Dockerfile"
                        def context = "./PillSoo"
                        def image = "${DOCKERHUB_USERNAME}/pillsoo-spring:latest"
                        sh "/kaniko/executor --context ${context} --dockerfile ${dockerfile} --destination ${image}"
                    }
                }
                container("kaniko") {
                        def dockerfile = "Dockerfile"
                        def context = "./GT/Pillsoo"
                        def image = "${DOCKERHUB_USERNAME}/pillsoo-python:latest"
                        sh "/kaniko/executor --context ${context} --dockerfile ${dockerfile} --destination ${image}"
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
