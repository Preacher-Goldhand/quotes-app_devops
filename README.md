# Deployment of Web Application via Jenkins on Production Environment

This is a web-based application designed for managing quotes. The application is a part of the DevOps process.

## Features

- **Create, edit and delete a quote and their author**: Users can create, edit and delete multiple quotes and assign an author to them.
- **View a list of all quotes**: All quotes can be viewed as a list.
- **Containarization**: Web app, database, and frontend were containerized by Docker in a single `docker-compose` file.
- **Jenkins CI/CD process**: Deploying `docker-compose` file and other configs on the production environment via Jenkins.

## Tech Stack

- **Frontend**: 
  - JS, HTML, CSS
  - Nginx 
- **Backend**: 
  - Express.js
- **Database**: 
  - PostgreSQL
- **Containerization**:
   - Docker
- **Jenkins**:
  - CI/CD process

### CI/CD Process Overview (Jenkins)

The CI/CD pipeline in Jenkins is designed to automate the deployment of the web application to the production environment. Here's a step-by-step explanation:

1. **Clone Repository**:
   - The pipeline first checks if the `.git` directory exists locally.
   - If not, it clones the GitHub repository containing the application code.

2. **Prepare Configurations**:
   - The pipeline verifies the presence of the required configuration directory (`configs`).
   - If the directory is missing, the pipeline stops with an error message to prevent incomplete deployments.

3. **Deploy to Server**:
   - The pipeline establishes an SSH connection to the remote server.
   - It ensures the application directory (`/home/${TARGET_USER}/app`) exists on the server, creating it if necessary.
   - Files such as the `docker-compose.yaml`, configuration files, and static assets are transferred to the server using `scp`.
   - On the server, the pipeline executes the following steps:
     - Stops existing Docker containers using `docker-compose down`.
     - Starts new containers using `docker-compose up -d`.
     - Monitors the status of the containers, waiting up to 5 minutes to ensure all containers are running. If the timeout is reached, the process fails.

4. **Post-Build Actions**:
   - On success, a message "Deployment was successful!" is displayed.
   - On failure, an error message "Deployment failed. Check the logs for details." is shown, helping users troubleshoot issues.

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.
