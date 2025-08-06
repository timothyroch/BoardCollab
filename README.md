# GitSync
**GitSync** is a collaborative task management platform that integrates with **GitHub** and **Google Calendar** to streamline team workflows. It enables users to create and manage workspaces, assign tasks, invite team members, and sync tasks with **GitHub issues** and **Google Calendar** for enhanced project organization and productivity. The project is split into a frontend and backend, each with detailed documentation in their respective directories.


## Features

* **Workspace Management**: Organize teams and projects within workspaces.
* **Task Management**: Create, assign, update, and track tasks with statuses and due dates.
* **Team Collaboration**: Invite users to workspaces via email.
* **GitHub Integration**: Sync tasks with GitHub repositories and issues.
* **Google Calendar Integration**: Sync tasks for scheduling.
* **Real-Time Updates**: Receive task updates in real-time via WebSockets.
* **Calendar View**: Visualize tasks in a calendar format.
* **Comments**: Add and view task comments for collaboration.
* **Authentication**: Secure Google OAuth for user access.
* **Responsive UI**: Modern, user-friendly interface.


## Tech Stack

* **Frontend**: Next.js, TypeScript, Tailwind CSS, NextAuth.js, Socket.IO, FullCalendar, Lucide Icons, Headless UI (see [`frontend/README.md`](https://github.com/timothyroch/GitSync/tree/main/frontend#readme)).
* **Backend**: NestJS, TypeScript, TypeORM, PostgreSQL, JWT, Socket.IO (see [`backend/README.md`](https://github.com/timothyroch/GitSync/tree/main/backend#readme)).
* **Infrastructure**: Vercel (frontend), Fly.io (backend), Neon.tech (database), Docker (local development).


## Project Structure
```bash
├── backend                    # NestJS backend (see backend/README.md)
├── frontend                   # Next.js frontend (see frontend/README.md)
├── docker-compose.yml         # Docker configuration for local development
├── package.json               # Root dependencies
├── package-lock.json          # Root dependency lock file
└── tailwind.config.js         # Shared Tailwind CSS configuration
```


## Prerequisites

* **Node.js**: v18+
* **Docker**: For local development
*  **Neon.tech Account**: For PostgreSQL database (deployment)
* **Vercel Account**: For frontend deployment
* **Fly.io Account**: For backend deployment
* **Google OAuth Credentials**: For authentication and Google Calendar integration
* **GitHub OAuth App**: For GitHub task/issue syncing
* **Email Service**: For invitations (e.g., SendGrid)


## Setup Instructions

**Local Development**

**1. Clone the Repository**
```bash
git clone https://github.com/timothyroch/GitSync
cd GitSync
```
**2. Set Up Frontend and Backend**
* Refer to [`frontend/README.md`](https://github.com/timothyroch/GitSync/tree/main/frontend#readme) for frontend setup (environment variables, dependencies, running with Docker or locally).
* Refer to [`backend/README.md`](https://github.com/timothyroch/GitSync/tree/main/backend#readme) for backend setup (environment variables, database configuration, running with Docker or locally).
 
**3. Run with Docker**
  
* Ensure Docker is running.
* Start all services:
```bash
docker-compose up --build
```
* **Services:**
* **Frontend**: `http://localhost:3000`
* **Backend**: `http://localhost:5000`
* **Postgres**: `localhost:5432` (user: tim, password: password, database: boardcollab)
* **pgAdmin**: `http://localhost:8080` (login: admin@example.com, password: adminpass)
 
**4. Access the Application**
  
* Open `http://localhost:3000` and sign in with Google OAuth.


## Deployment

* **Frontend** (Vercel): See [`frontend/README.md`](https://github.com/timothyroch/GitSync/tree/main/frontend#readme) for deployment instructions.
* **Backend** (Fly.io): See [`backend/README.md`](https://github.com/timothyroch/GitSync/tree/main/backend#readme) for deployment instructions.
* **Database** (Neon.tech): Create a PostgreSQL database and update the backend's `DATABASE_URL`.


## Usage

**1. Sign In**: Use **Google OAuth** to authenticate.

**2. Create Workspaces**: Set up team workspaces and invite members.

**3. Manage Tasks**: Create, assign, and track tasks, with options to sync with GitHub issues and Google Calendar.

**4. Collaborate**: Add comments and receive real-time updates.

**5. For detailed usage**, see [`frontend/README.md`](https://github.com/timothyroch/GitSync/tree/main/frontend#readme) and [`backend/README.md`](https://github.com/timothyroch/GitSync/tree/main/backend#readme).


## Contributing

**1. Fork the repository.**

**2. Create a feature branch**: `git checkout -b feature/your-feature`.

**3. Commit changes**: `git commit -m "Add your feature"`.

**4. Push**: `git push origin feature/your-feature`.

**5. Open a pull request.**


## License

**MIT License**. See [LICENSE](https://github.com/timothyroch/GitSync/blob/main/LICENSE) for details.


## Contact
Contact me at timothyroch@gmail.com.
