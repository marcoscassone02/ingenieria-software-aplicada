pipeline {
    agent any

    environment {
        // Ajustá estos valores a tu cuenta de DockerHub
        DOCKERHUB_CREDENTIALS = credentials('Dockerhub')  
        DOCKERHUB_REPO = "marcoscassone/ingenieriasoftwareaplicada"
        APP_NAME = "ingenieriasoftwareaplicada"
    }

    stages {
        stage('Checkout') {
            steps {
                git branch: 'main',
                    url: 'https://github.com/tuusuario/tu-repo.git'
            }
        }

        stage('Build with Maven') {
            steps {
                sh './mvnw clean package -DskipTests'
            }
        }

        stage('Run tests') {
            steps {
                sh './mvnw test'
            }
        }

        stage('Build Docker image') {
            steps {
                script {
                    sh """
                        docker build -t $DOCKERHUB_REPO:latest .
                    """
                }
            }
        }

        stage('Push Docker image') {
            steps {
                script {
                    sh """
                        echo "$DOCKERHUB_CREDENTIALS_PSW" | docker login -u "$DOCKERHUB_CREDENTIALS_USR" --password-stdin
                        docker push $DOCKERHUB_REPO:latest
                    """
                }
            }
        }
    }
} 