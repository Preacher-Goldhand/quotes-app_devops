# Deployment of Web Application via Jenkins on Production Environment 

This is a web-based application designed for managing Kanban boards and the tasks assigned to them. The system allows users to create boards, define columns (such as "To Do," "In Progress," "Completed"), and manage tasks with various statuses, priorities, and assignments. The application allows to send a notification messeage via a built-in SMTP server.

## Features

- **Create, edit and delete a quote and their author**: Users can create, edit and delete multiple quotes and assign an author to them.
- **View a list of all quotes**: All quotes can be viewed as a list.
- **Containarization**: Web app, database and frontend were containered by Docker in a single docker-compose file.
- **Jenkins CI/CD process**: Deploying docker-compose file and other configs on the production environment via Jenkins.

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
     
### Steps to set up the application

1. Clone the repository:
    ```bash
    git clone https://github.com/Preacher-Goldhand/bugtracker-restapi.git
    cd bugtracker-restapi
    ```

2. Set up the backend:
    - Run the migrations to set up the database schema:
        ```bash
        dotnet ef database update
        ```

    - Start the backend server:
        ```bash
        dotnet run
        ```

3. Set up the frontend:
    - Navigate to the frontend folder:
        ```bash
        cd Bugtracker.Client
        ```

    - Install dependencies using npm:
        ```bash
        npm install
        ```

    - Start the frontend server:
        ```bash
        ng serve
        ```


## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

