pipeline {
    agent any

    options {
        timestamps()
        disableConcurrentBuilds()
    }

    environment {
        DOCKERHUB_USERNAME = 'samiksha1195'
        APP_HOST = '10.0.2.54'
        IMAGE_TAG = "${BUILD_NUMBER}"
    }

    stages {
        stage('Checkout') {
            steps {
                checkout scm
            }
        }

        stage('Build and Test') {
            steps {
                sh '''
                    docker build -t "$DOCKERHUB_USERNAME/blog-frontend:$IMAGE_TAG" ./frontend
                    docker build -t "$DOCKERHUB_USERNAME/blog-backend:$IMAGE_TAG" ./backend
                '''
            }
        }

        stage('Push Images') {
            steps {
                withCredentials([
                    usernamePassword(
                        credentialsId: 'dockerhub-creds',
                        usernameVariable: 'DH_USER',
                        passwordVariable: 'DH_TOKEN'
                    )
                ]) {
                    sh '''
                        set +x
                        echo "$DH_TOKEN" | docker login \
                            --username "$DH_USER" --password-stdin

                        docker push "$DOCKERHUB_USERNAME/blog-frontend:$IMAGE_TAG"
                        docker push "$DOCKERHUB_USERNAME/blog-backend:$IMAGE_TAG"

                        docker logout
                    '''
                }
            }
        }

        stage('Deploy') {
            steps {
                sshagent(credentials: ['app-ssh-key']) {
                    sh '''
                        ssh -o StrictHostKeyChecking=yes \
                            ec2-user@"$APP_HOST" \
                            "cd /opt/blog/app && \
                             sed -i 's/^IMAGE_TAG=.*/IMAGE_TAG=$IMAGE_TAG/' .env && \
                             docker compose pull && \
                             docker compose up -d --remove-orphans"
                    '''
                }
            }
        }
    }

    post {
        always {
            echo 'Pipeline finished. Check stage results above.'
        }
    }
}
