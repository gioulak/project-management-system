# Project Management System --Report

## Project Overview
The project impliments a Project Management System using microservices architecture. The system contains 3 backend services(User,Team,Task) and a React-based frontend. These services are all containerix=zed with Docker and deployed on Google Cloud Platform.

### Microservices

#### 1. User Service (port 8080)
- **Database:** MySql 8.0
- User authentication (signup, signin, logout)
- JWT token generation and validation
- Password reset function
- User role mangement (Admin, Team Leader, Member)
- User activation by admin

#### 2. Team Service (port 8081)
- **Database:** MongoDB 7
- Team creation and mangement
- Team member assignment
- Team leader creation
- Team infos retrieval

#### 3. Task Service (port 8082)
- **Database**: MongoDB 7
- Task CRUD operations
- Task status mangement(TODO, IN_PROGRESS, DONE)
- Assign tasks to team members
- Filter tasks based on team and status

#### 4. Frontern (port 3000)
- **Framework:** Next.js with React 19
- Responsive UI with dark theme
- Redux state management
- RTK Query for API calls
- Kanban board for visualizing the tasks
- Access control based on their role

## Used Technologies

### Backend
- **Runtime:** Node.js 20
- **Framework:** Express.js
- **Auth:** JWT(jsonwebtoken), bcryptjs
- **Database:** - MySQL 8.0
                - MongoDB 7
- **Email:** Nodemailer
- **Environment:** dotenv

### Frontend
- **Framework:** Next.js 16.1.1
- **UI Library:** React 19.2.3
- **Language:** TypeScript
- **State Mangement:** Redux Toolkit, RTK Query
- **Styling:** Tailwind CSS v4
- **Icons:** Licide React 0.460.0

### DevOps
- **Containerization:** Docker 29.1.3, Docker Compose v5.0.0
- **Cloud Platform:**  GCP
- **VM Instance:** Compute Engine(e2-medium, ubuntu 24.04)
- **Version Control:** Git, GitHub
- **Region:** europe-west1

## Deployment

### 1. Setup

### VM Creation
The VM instances used are:
name: microservices-server
machine type: e2-medium (2 vCPUS, 4 GB memory)
os: Ubuntu 24.04 LTS
Boot Disk: 10 GB Standard Persisten Disk

### Firewall Config
The ports used:
- port 3000: Frontend access
- port 8080: user service api
- port 8081: team service api
- port 8082: task service api

### 2. Project Deployment
The project is cloned with the command:
```bash
git clone https://github.com/gioulak/project-managemt-system.git
cd project-managemnt-system
```

#### Environment Config
File .env with configurations:
```env
MYSQL_ROOT_PASSWORD=root123456
MYSQL_DATABASE=pms_users
MYSQL_USER=pms_user
MYSQL_PASSWORD=pmsuser123456

MONGO_INITDB_ROOT_USERNAME=admin
MONGO_INITDB_ROOT_PASSWORD=mong0123

JWT_SECRET=ef053ad1c3198bc3

# API URLs for the forntend
NEXT_PUBLIC_API_BASE_URL=http://localhost:8080
NEXT_PUBLIC_TEAM_API_URL=http://localhost:8081
NEXT_PUBLIC_TASK_API_URL=http://localhost:8082
```

### Deploy Services

Building and starting all the services:
```bash
docker compose --env-file .env -f docker-compose.prod.yml build
docker compose --env-file .env -f docker-compose.prod.yml up -d

docker compose --env-file .env -f docker-compose.prod.yml ps
```

## Access Application

### URLS
- **Frontend:** http://34.38.187.213:3000
- **User Service:** http://34.38.187.213:8080
- **Team Service:** http://34.38.187.213:8081
- **Task Service:** http://34.38.187.213:8082

### Credentials for admin
```
Username: admin
Password: admin123
```

## Implementation Features

### Authentication
- User signup with email validation
- Login with JWT tokens
- Password hashing with bcrypt
- Passwort reset with email
- Role-based access: - Amdin: full access
                     - Team Leader: Team, taks management
                     - Memebr: View and update assigned tasks

### User Mangement
- Amdin only
- View users
- Activate/deactivate user accounts
- update user roles(team_leader, member)
- Search and filter users

### Team Management
- Create new temas
- assign team leaders
- Add/Delete team members
- View team Details

### Task Management
- Create tasks(title, description, team assignment, user assignment, priority, due date)
- Task status(TODO, IN_PROGRESS, DONE)
- Filter tasks by team, status
- Kanban board

### Useful Commands
```bash
git pull main
docker compose --env-file .env -f docker-composeprod.yml up -d --build

docker compose --env-file .env -f docker-compose.prod.yml down
docker compose --env-file .env -f docker-compose.prod.yml up -d
```

### Project Structure
project-management-system/
├── nodejs/
│   └── nodejs-microservices/
│       ├── services/
│       │   ├── user-service/
│       │   │   ├── config/
│       │   │   ├── models/
│       │   │   ├── routes/
│       │   │   ├── utils/
│       │   │   ├── app.js
│       │   │   ├── Dockerfile.prod
│       │   │   └── package.json
│       │   ├── team-service/
│       │   │   ├── config/
│       │   │   ├── models/
│       │   │   ├── routes/
│       │   │   ├── app.js
│       │   │   ├── Dockerfile.prod
│       │   │   └── package.json
│       │   └── task-service/
│       │       ├── config/
│       │       ├── models/
│       │       ├── routes/
│       │       ├── app.js
│       │       ├── Dockerfile.prod
│       │       └── package.json
│       └── client/
│           ├── src/
│           │   ├── app/
│           │   ├── components/
│           │   ├── state/
│           │   └── lib/
│           ├── Dockerfile.prod
│           ├── next.config.js
│           ├── package.json
│           └── tailwind.config.js
├── docker-compose.prod.yml
├── .env
├── deploy.sh
├── REPORT.md



#### Github Repository
```
https://github.com/gioulak/project-management-system.git
```
