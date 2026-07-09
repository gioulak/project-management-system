# Project Management System

A full-stack microservices application for managing teams, tasks and projects. Build with Node.js, React and deployed on Google Cloud Platform using Docker.

## Features
- **Role-based access control** - Admin, Team Leader and Member roles with different permissions
- **User management** - Admin approval flow for new accounts, activate/deactivate users
- **Team management** - Create teams, assign leaders, manage members
- **Task tracking** - Create tasks, assign to team members, track status (TODO -> IN PROGRESS ->DONE)
- **Comments** - Team members can comment on tasks
- **JWT authenticatio** - Secure token based auth with 24h expiry
- **Rate limiting** - Brute force protection on login endpoint
  
## Architecture

3 backend microservices + React frontend, containerized with Docker:

- **User Service** (Port 8080) — MySQL, JWT auth, role-based access control
- **Team Service** (Port 8081) — MongoDB, team creation and member assignment  
- **Task Service** (Port 8082) — MongoDB, task CRUD, status tracking, comments
- **Frontend** (Port 3000) — Next.js, React 19, TypeScript, Redux Toolkit, Tailwind CSS

## Tech Stack

| Layer | Technologies |
|-------|-------------|
| Frontend | React 18, Vite, JavaScript, Axios |
| User Service | Node.js, Express.js, MySQL 8.0, JWT, bcrypt |
| Team Service | Node.js, Express.js, MongoDB 7, Mongoose |
| Task Service | Node.js, Express.js, MongoDB 7, Mongoose |
| DevOps | Docker, Docker Compose, GCP (Ubuntu 24.04) |

## Security

- Passwords hashed with bcrypt (salt rounds: 10)
- JWT tokens with configurable expiry
- Rate limiting in auth endpoints (10 requests/ 15 minutes)
- Input validation and sanitization on all endpoints
- Role-based middleware on every protected route
- Parameterized SQL queries (no SQL injection risk)

## API Endpoints

### User Service (Port 8080)
| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| POST | /api/auth/signup | None | Register new user |
| POST | /api/auth/login | None | Login |
| GET | /api/auth/profile | User | Get current user |
| GET | /api/admin/users | Admin | List all users |
| PUT | /api/admin/users/:id/activate | Admin | Activate user |
| PUT | /api/admin/users/:id/role | Admin | Update user role |
| DELETE | /api/admin/users/:id | Admin | Delete user |

### Team Service (Port 8081)
| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| POST | /api/teams | Admin | Create team |
| GET | /api/teams | User | Get teams |
| PUT | /api/teams/:id | Leader/Admin | Update team |
| POST | /api/teams/:id/members | Leader/Admin | Add member |
| DELETE | /api/teams/:id/members/:userId | Leader/Admin | Remove member |
| DELETE | /api/teams/:id | Admin | Delete team |

### Task Service (Port 8082)
| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| POST | /api/tasks | Leader | Create task |
| GET | /api/tasks | User | Get tasks (filtered by role) |
| GET | /api/tasks/my-tasks | User | Get my assigned tasks |
| PATCH | /api/tasks/:id/status | User | Update task status |
| POST | /api/tasks/:id/comments | User | Add comment |
| DELETE | /api/tasks/:id | Leader/Admin | Delete task |

## Run locally

```bash
git clone https://github.com/gioulak/project-management-system.git
cd project-management-system
cp .env.example .env  # fill in your values
docker-compose up --build
```

then open http://localhost:3000.

## User Roles

| Role | Permissions |
|------|------------|
| ADMIN | Full access — manage users, teams, tasks |
| TEAM_LEADER | Create/manage tasks, add/remove team members |
| MEMBER | View assigned tasks, update task status, add comments |

> New accounts require admin approval before login is allowed.
