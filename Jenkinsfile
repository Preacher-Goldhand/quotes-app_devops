pipeline {
    agent any
    environment {
        CONFIG_DIR = 'configs'
        REMOTE_APP_DIR = "/home/${TARGET_USER}/app"
        GIT_REPO_URL = 'https://github.com/Preacher-Goldhand/quotes-app_devops.git'
    }

    stages {
        stage('Clone Repository') {
            steps {
                script {
                    if (!fileExists('.git')) {
                        echo 'Cloning repository from GitHub...'
                        sh "git clone ${GIT_REPO_URL} ."
                    } else {
                        echo 'Repository already exists. Skipping clone.'
                    }
                }
            }
        }

        stage('Prepare Configs') {
            steps {
                echo "Ensuring ${CONFIG_DIR} directory exists locally..."
                sh '''
                if [ ! -d ${CONFIG_DIR} ]; then
                    echo "Error: ${CONFIG_DIR} directory not found!"
                    exit 1
                fi
                '''
            }
        }

        stage('Deploy to Server') {
            steps {
                echo "Deploying application to ${TARGET_USER}@${TARGET_SERVER}..."

                withCredentials([sshUserPrivateKey(credentialsId: 'cd510649-af79-44a5-b082-2d749cd6b7fb', keyFileVariable: 'SSH_KEY')]) {
                    sh '''
                    echo "Ensuring remote directory exists..."
                    ssh -i ${SSH_KEY} -o StrictHostKeyChecking=no ${TARGET_USER}@${TARGET_SERVER} << EOF
                    REMOTE_APP_DIR=${REMOTE_APP_DIR}
                    if [ ! -d "$REMOTE_APP_DIR" ]; then
                        echo "Creating directory $REMOTE_APP_DIR..."
                        mkdir -p "$REMOTE_APP_DIR"
                    fi
EOF

                    echo "Copying configs to remote server..."
                    scp -i ${SSH_KEY} -o StrictHostKeyChecking=no -r ${CONFIG_DIR} ${TARGET_USER}@${TARGET_SERVER}:${REMOTE_APP_DIR}/

                    echo "Copying docker-compose file..."
                    scp -i ${SSH_KEY} -o StrictHostKeyChecking=no docker-compose.yaml ${TARGET_USER}@${TARGET_SERVER}:${REMOTE_APP_DIR}/

                    echo "Copying public directory to remote server..."
                    scp -i ${SSH_KEY} -o StrictHostKeyChecking=no -r public ${TARGET_USER}@${TARGET_SERVER}:${REMOTE_APP_DIR}/
                    '''
                    
                    echo "Running docker-compose on remote server..."

                    sh '''
                    ssh -tt -i ${SSH_KEY} -o StrictHostKeyChecking=no ${TARGET_USER}@${TARGET_SERVER} << EOF
                    REMOTE_APP_DIR=${REMOTE_APP_DIR}
                    cd "$REMOTE_APP_DIR"
                    if [ ! -f docker-compose.yaml ]; then
                        echo "Error: docker-compose.yaml not found in $REMOTE_APP_DIR!"
                        exit 1
                    fi
                    docker-compose down
                    docker-compose up -d
                    # Wait for containers to be up and running (with a timeout of 5 minutes)
                    timeout 300 sh -c "until docker-compose ps | grep 'Up' > /dev/null; do echo 'Waiting for containers...'; sleep 10; done"
                    echo "Docker containers are up and running!"
EOF
                    '''
                }
            }
        }
    }

    post {
        success {
            echo 'Deployment was successful!'
        }
        failure {
            echo 'Deployment failed. Check the logs for details.'
        }
    }
}
