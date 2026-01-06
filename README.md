# Project Management System

## Project Overview
The project impliments a Project Management System using microservices architecture. The system contains 3 backend services(User,Team,Task) and a React-based frontend. These services are all containerix=zed with Docker and deployed on Google Cloud Platform.

## Live Demo
 **Aplication URL:** http://34.38.187.213:3000

**Admin Credentials:**
- Username: `admin`
- Password: `admin123`

## Architecture
The sytsem consists of 3 microservices:

1. **User Service** (Port 8080) - MySQL
    - Authentication
    - User management
    - Role-based access contril

2. **Team Service** (Port 8081) - MongoDB
     - Team creation
     - Member assignment

3. **Task Service** (Port 8082) - MongoDB
     - Task CRUD operations
     - Status managemnet
     - Comments

4. **Frontend** (Port 3000) - Next.js

## Tecknologies used

### Backend
- Node.js + Express.js
- MySQL 8.0
- MongoDB 7
- JWT Authentication
- bcrypt 

### Frintend
- Next.js
- React 19
- TypeScript
- Redux Toolkit & RTK Query
- Tailwind CSS v4

### DevOps
- Docker, Docker Compose
- Google Cloud Platform
- Ubuntu 24.04

## Documentation
For detailed deployment infos, see [REPORT.md](./REPORT.md)
