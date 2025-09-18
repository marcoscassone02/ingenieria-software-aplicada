pipeline {
    agent any

    environment {
        DOCKERHUB_CREDENTIALS = credentials('dockerhub-cred')
        DOCKERHUB_REPO = "marcoscassone/ingenieriasoftwareaplicada"
    }

    stages {
        stage('Checkout') {
            steps {
                git branch: 'master',
                    url: 'https://github.com/marcoscassone02/ingenieria-software-aplicada.git'
            }
        }

        stage('Build with Maven') {
            steps {
                sh './mvnw clean package -DskipTests -B'
            }
        }

        stage('Build Docker image') {
            steps {
                sh "docker build -t $DOCKERHUB_REPO:latest ."
            }
        }

        stage('Push Docker image') {
            steps {
                sh """
                    echo "$DOCKERHUB_CREDENTIALS_PSW" | docker login -u "$DOCKERHUB_CREDENTIALS_USR" --password-stdin
                    docker push $DOCKERHUB_REPO:latest
                """
            }
        }

        stage('Deploy with Docker Compose') {
            steps {
                script {
                    // detener servicios anteriores si están corriendo
                    sh 'docker-compose down || true'

                    // actualizar imagen
                    sh 'docker-compose pull'

                    // levantar servicios
                    sh 'docker-compose up -d --build'
                }
            }
        }
    }
}
