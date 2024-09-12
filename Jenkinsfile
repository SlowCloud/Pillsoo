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
    }

    stages {
        parallel {
          stage("build spring and push") {
            steps {
                container("kaniko-spring") {
                    script {
                        def dockerfile = "Dockerfile"
                        def context = "./PillSoo"
                        def image = "${DOCKERHUB_USERNAME}/pillsoo-spring:latest"
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
                          def image = "${DOCKERHUB_USERNAME}/pillsoo-python:latest"
                          sh "/kaniko/executor --context ${context} --dockerfile ${dockerfile} --destination ${image}"
                      }
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
