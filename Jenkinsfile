pipeline {
    agent any

    environment {
        TARGET_SERVER = env.TARGET_SERVER ?: 'default.server.address' 
        TARGET_USER = env.TARGET_USER ?: 'default_user'             
        CONFIG_DIR = 'configs'                                     
        REMOTE_APP_DIR = "/home/${TARGET_USER}/app"                
    }

    stages {
        stage('Clone Repository') {
            steps {
                echo 'Cloning repository from GitHub...'
                checkout scm 
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

                sh '''
                ssh -o StrictHostKeyChecking=no ${TARGET_USER}@${TARGET_SERVER} << EOF
                if [ ! -d ${REMOTE_APP_DIR}/${CONFIG_DIR} ]; then
                    echo "Remote configs directory not found. Copying ${CONFIG_DIR}..."
                    exit 1
                fi
                EOF
                ''' || sh '''
                scp -o StrictHostKeyChecking=no -r ${CONFIG_DIR} ${TARGET_USER}@${TARGET_SERVER}:${REMOTE_APP_DIR}/
                '''

                sh '''
                scp -o StrictHostKeyChecking=no docker-compose.yaml ${TARGET_USER}@${TARGET_SERVER}:${REMOTE_APP_DIR}/
                '''

                sh '''
                ssh -o StrictHostKeyChecking=no ${TARGET_USER}@${TARGET_SERVER} << EOF
                cd ${REMOTE_APP_DIR}
                docker-compose down
                docker-compose pull
                docker-compose up -d --build
                EOF
                '''
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
