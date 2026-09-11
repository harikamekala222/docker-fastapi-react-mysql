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
                    echo "Copying application..."

                    rm -rf "${APP_DIR:?}"/*
                    rm -rf "${APP_DIR:?}"/.[!.]* "${APP_DIR:?}"/..?* 2>/dev/null || true

                    cp -r . "${APP_DIR}/"

                    rm -rf "${APP_DIR}/.git"

                    chown -R jenkins:jenkins "${APP_DIR}"

                    echo "Application copied successfully."
                '''
            }
        }

        stage('Check Compose') {
            steps {
                sh '''
                    cd "${APP_DIR}"

                    echo "Checking Docker Compose configuration..."

                    docker compose \
                        --env-file "${ENV_FILE}" \
                        config -q

                    echo "Docker Compose configuration is valid."
                '''
            }
        }

        stage('Build Images') {
            steps {
                sh '''
                    cd "${APP_DIR}"

                    echo "Building Docker images..."

                    docker compose \
                        --env-file "${ENV_FILE}" \
                        build

                    echo "Docker images built successfully."
                '''
            }
        }

        stage('Start Containers') {
            steps {
                sh '''
                    cd "${APP_DIR}"

                    echo "Checking existing containers..."

                    if docker compose \
                        --env-file "${ENV_FILE}" \
                        ps -q | grep -q .; then

                        echo "Existing application containers found."
                        echo "Stopping and removing existing containers..."

                        docker compose \
                            --env-file "${ENV_FILE}" \
                            down

                    else
                        echo "No existing application containers found."
                    fi

                    echo "Checking mysql-container..."

                    if docker ps -a --format '{{.Names}}' | grep -qx 'mysql-container'; then

                        echo "mysql-container already exists."
                        echo "Removing mysql-container..."

                        docker rm -f mysql-container

                    else
                        echo "mysql-container does not exist."
                    fi

                    echo "Starting containers..."

                    docker compose \
                        --env-file "${ENV_FILE}" \
                        up -d

                    echo "Containers started successfully."
                '''
            }
        }

        stage('Verify') {
            steps {
                sh '''
                    cd "${APP_DIR}"

                    echo "Waiting for containers..."

                    sleep 10

                    echo "Container status:"

                    docker compose \
                        --env-file "${ENV_FILE}" \
                        ps

                    echo "Deployment verification completed."
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
