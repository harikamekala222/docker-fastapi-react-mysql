pipeline {
    agent any

    environment {
        APP_DIR  = "/opt/fastapi-jenkins/app"
        ENV_FILE = "/opt/fastapi-jenkins/env/root.env"
    }

    stages {

        stage('Deploy') {
            steps {
                sh '''
                    set -e

                    echo "Preparing application..."

                    rm -rf "${APP_DIR:?}"/*
                    rm -rf "${APP_DIR:?}"/.[!.]*
                    rm -rf "${APP_DIR:?}"/..?*

                    # Copy application without Git metadata
                    cp -a . "${APP_DIR}/"
                    rm -rf "${APP_DIR}/.git"

                    chown -R jenkins:jenkins "${APP_DIR}"

                    cd "${APP_DIR}"

                    echo "Checking Docker Compose..."
                    docker compose \
                        --env-file "${ENV_FILE}" \
                        config -q

                    echo "Checking existing containers..."

                    if docker compose \
                        --env-file "${ENV_FILE}" \
                        ps -q | grep -q .; then

                        echo "Stopping existing containers..."

                        docker compose \
                            --env-file "${ENV_FILE}" \
                            down
                    fi

                    echo "Building images..."

                    docker compose \
                        --env-file "${ENV_FILE}" \
                        build

                    echo "Starting application..."

                    docker compose \
                        --env-file "${ENV_FILE}" \
                        up -d

                    echo "Deployment successful."

                    echo "Container status:"
                    docker compose \
                        --env-file "${ENV_FILE}" \
                        ps
                '''
            }
        }
    }

    post {
        failure {
            sh '''
                if [ -f "${APP_DIR}/docker-compose.yml" ]; then
                    cd "${APP_DIR}"

                    docker compose \
                        --env-file "${ENV_FILE}" \
                        ps || true

                    docker compose \
                        --env-file "${ENV_FILE}" \
                        logs --tail=50 || true
                fi
            '''
        }

        success {
            echo "Deployment completed successfully."
        }
    }
}
