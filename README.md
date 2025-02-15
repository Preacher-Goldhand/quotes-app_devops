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

## Repo Structure

The project is organized into the following directories and files:

```
-configs/          # Scripts to init environment in docker-compose file  
-iac/              # Vagrant files and scripts to provision servers
-src/              # Application server source code
-public/           # Static files hosted by Nginx 
Dockerfile
docker-compose.yaml
```

## Infrastructure as Code (IaC) with Vagrant

To ensure consistent server environments, Vagrant is used for Infrastructure as Code (IaC). The repository includes a directory `iac` that contains all required configurations and provisioning scripts.

1. **Vagrant Configuration**:
   - The `iac` directory includes configuration files for setting up server environments using Vagrant.

2. **Provisioning Scripts**:
   - Two key scripts are used to provision environments:
     - `jenkins_provision.sh`: Located in `iac/jenkins_infra`, this script provisions servers for Jenkins infrastructure (Jenkins server installation).
     - `prod_provision.sh`: Located in `iac/prod-env_infra`, this script provisions servers for the production environment (Docker installation).
   - These scripts automate the installation of required software, configuration of services, and setup of necessary dependencies for both Jenkins and production environments.
     

## CI/CD Process Overview (Jenkins)

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


## Links: 

Here is a link to Docker image of the application server: https://hub.docker.com/r/preachergoldhand/quotes_app

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.
