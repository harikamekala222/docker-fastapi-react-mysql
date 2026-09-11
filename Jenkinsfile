pipeline {
    agent any

    environment {
        APP_DIR  = "/opt/fastapi-jenkins/app"
        ENV_FILE = "/opt/fastapi-jenkins/env/root.env"
    }

    stages {

        stage('Copy Application') {
            steps {
                sh '''
                    rm -rf ${APP_DIR}/*
                    cp -r . ${APP_DIR}/
                    rm -rf ${APP_DIR}/.git

                    chown -R jenkins:jenkins ${APP_DIR}
                '''
            }
        }

        stage('Check Compose') {
            steps {
                sh '''
                    cd ${APP_DIR}

                    docker compose \
                        --env-file ${ENV_FILE} \
                        config -q
                '''
            }
        }

        stage('Stop Existing Containers') {
            steps {
                sh '''
                    cd ${APP_DIR}

                    if docker compose \
                        --env-file ${ENV_FILE} \
                        ps -q | grep -q .; then

                        echo "Existing containers found. Stopping..."

                        docker compose \
                            --env-file ${ENV_FILE} \
                            down

                    else
                        echo "No existing containers found."
                    fi
                '''
            }
        }

        stage('Build Images') {
            steps {
                sh '''
                    cd ${APP_DIR}

                    docker compose \
                        --env-file ${ENV_FILE} \
                        build
                '''
            }
        }

        stage('Start Containers') {
            steps {
                sh '''
                    cd ${APP_DIR}

                    docker compose \
                        --env-file ${ENV_FILE} \
                        up -d
                '''
            }
        }

        stage('Verify') {
            steps {
                sh '''
                    cd ${APP_DIR}

                    sleep 10

                    docker compose \
                        --env-file ${ENV_FILE} \
                        ps
                '''
            }
        }
    }

    post {
        success {
            echo "Deployment successful."
        }

        failure {
            echo "Deployment failed."
        }
    }
}
