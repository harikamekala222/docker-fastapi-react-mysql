pipeline {
    agent any

    environment {
        APP_DIR  = "/opt/fastapi-jenkins/app"
        ENV_FILE = "/opt/fastapi-jenkins/env/root.env"
    }

    options {
        timestamps()
        disableConcurrentBuilds()
        buildDiscarder(
            logRotator(
                numToKeepStr: '10'
            )
        )
    }

    stages {

        stage('Validate Environment') {
            steps {
                sh '''
                    set -e

                    echo "======================================"
                    echo "Validating deployment environment"
                    echo "======================================"

                    echo "Checking Docker..."
                    docker --version

                    echo "Checking Docker Compose..."
                    docker compose version

                    echo "Checking environment file..."
                    test -f "${ENV_FILE}"

                    echo "Checking deployment directory..."
                    mkdir -p "${APP_DIR}"

                    echo "Environment validation successful."
                '''
            }
        }

        stage('Prepare Application') {
            steps {
                sh '''
                    set -e

                    echo "======================================"
                    echo "Preparing application directory"
                    echo "======================================"

                    # Remove previous application files.
                    # ENV_FILE is outside APP_DIR, so it is safe.
                    rm -rf "${APP_DIR:?}"/*

                    # Copy latest SCM checkout
                    cp -a . "${APP_DIR}/"

                    # Make Jenkins the owner
                    chown -R jenkins:jenkins "${APP_DIR}"

                    echo "Application copied to:"
                    echo "${APP_DIR}"

                    ls -la "${APP_DIR}"
                '''
            }
        }

        stage('Validate Docker Compose') {
            steps {
                sh '''
                    set -e

                    cd "${APP_DIR}"

                    echo "======================================"
                    echo "Validating Docker Compose configuration"
                    echo "======================================"

                    test -f docker-compose.yml

                    docker compose \
                        --env-file "${ENV_FILE}" \
                        config -q

                    echo "Docker Compose configuration is valid."
                '''
            }
        }

        stage('Build Docker Images') {
            steps {
                sh '''
                    set -e

                    cd "${APP_DIR}"

                    echo "======================================"
                    echo "Building Docker images"
                    echo "======================================"

                    docker compose \
                        --env-file "${ENV_FILE}" \
                        build

                    echo "Docker images built successfully."
                '''
            }
        }

        stage('Stop Existing Deployment') {
            steps {
                sh '''
                    set -e

                    cd "${APP_DIR}"

                    echo "======================================"
                    echo "Checking existing deployment"
                    echo "======================================"

                    if docker compose \
                        --env-file "${ENV_FILE}" \
                        ps -q | grep -q .; then

                        echo "Existing containers found."
                        echo "Stopping existing deployment..."

                        docker compose \
                            --env-file "${ENV_FILE}" \
                            down

                        echo "Existing deployment stopped."

                    else
                        echo "No existing containers found."
                        echo "Nothing to stop."
                    fi
                '''
            }
        }

        stage('Start Deployment') {
            steps {
                sh '''
                    set -e

                    cd "${APP_DIR}"

                    echo "======================================"
                    echo "Starting application"
                    echo "======================================"

                    docker compose \
                        --env-file "${ENV_FILE}" \
                        up -d

                    echo "Application started successfully."
                '''
            }
        }

        stage('Verify Deployment') {
            steps {
                sh '''
                    set -e

                    cd "${APP_DIR}"

                    echo "======================================"
                    echo "Verifying deployment"
                    echo "======================================"

                    echo "Waiting for containers..."
                    sleep 10

                    echo ""
                    echo "Container status:"
                    docker compose \
                        --env-file "${ENV_FILE}" \
                        ps

                    echo ""
                    echo "Running containers:"
                    docker compose \
                        --env-file "${ENV_FILE}" \
                        ps --status running

                    echo ""
                    echo "Deployment verification completed."
                '''
            }
        }

        stage('Application Logs') {
            steps {
                sh '''
                    cd "${APP_DIR}"

                    echo "======================================"
                    echo "Recent application logs"
                    echo "======================================"

                    echo ""
                    echo "----- Backend -----"

                    docker compose \
                        --env-file "${ENV_FILE}" \
                        logs --tail=30 backend || true

                    echo ""
                    echo "----- Frontend -----"

                    docker compose \
                        --env-file "${ENV_FILE}" \
                        logs --tail=30 frontend || true

                    echo ""
                    echo "----- MySQL -----"

                    docker compose \
                        --env-file "${ENV_FILE}" \
                        logs --tail=20 mysql || true
                '''
            }
        }
    }

    post {

        success {
            echo '''
======================================
DEPLOYMENT SUCCESSFUL
======================================
Application has been deployed successfully.
'''
        }

        failure {
            echo '''
======================================
DEPLOYMENT FAILED
======================================
Collecting Docker Compose status and logs...
'''

            sh '''
                if [ -f "${APP_DIR}/docker-compose.yml" ]; then

                    cd "${APP_DIR}"

                    echo "----- Container Status -----"

                    docker compose \
                        --env-file "${ENV_FILE}" \
                        ps || true

                    echo ""
                    echo "----- Recent Logs -----"

                    docker compose \
                        --env-file "${ENV_FILE}" \
                        logs --tail=50 || true
                fi
            '''
        }

        always {
            echo "Jenkins deployment pipeline completed."
        }
    }
}
