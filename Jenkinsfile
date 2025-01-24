pipeline {
    agent any

    stages {
        stage('Clone Repository') {
            steps {
                echo 'Cloning repository from GitHub...'
                // Clones the repository from GitHub (configured in the Jenkins job)
                checkout scm
            }
        }

        stage('Deploy to Server') {
            steps {
                echo 'Deploying to production server...'

                // Copy docker-compose.yaml to the remote server
                sh '''
                scp -o StrictHostKeyChecking=no docker-compose.yaml root@192.168.1.3:/home/user/app/
                '''

                // Deploy the application using Docker Compose on the target server
                sh '''
                ssh -o StrictHostKeyChecking=no root@192.168.1.3<< EOF
                cd /home/user/app/
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
