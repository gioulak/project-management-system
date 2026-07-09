# Project Management System

A microservices-based project management app deployed on Google Cloud Platform.

## Architecture

3 backend services + React frontend, containerized with Docker:

- **User Service** (Port 8080) — MySQL, JWT auth, role-based access control
- **Team Service** (Port 8081) — MongoDB, team creation and member assignment  
- **Task Service** (Port 8082) — MongoDB, task CRUD, status tracking, comments
- **Frontend** (Port 3000) — Next.js, React 19, TypeScript, Redux Toolkit, Tailwind CSS

## Tech Stack

**Backend:** Node.js, Express.js, MySQL 8.0, MongoDB 7, JWT, bcrypt  
**Frontend:** React 18, Vite, JavaScript  
**DevOps:** Docker, Docker Compose, Google Cloud Platform, Ubuntu 24.04

## Run locally

git clone https://github.com/gioulak/project-management-system.git
cd project-management-system
cp .env.example .env  # fill in your values
docker-compose up --build
