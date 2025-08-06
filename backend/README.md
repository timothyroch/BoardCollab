# GitSync Backend
The GitSync Backend is a NestJS application that powers the GitSync task management platform. It provides APIs for workspace (tenant) management, task CRUD operations, user authentication, email-based invitations, GitHub integration for task syncing, Google Calendar integration, and real-time updates via WebSockets. The backend is designed for scalability, using TypeORM for PostgreSQL interactions and JWT for secure authentication, with deployment optimized for Fly.io and a Neon.tech database.
## Features

* Authentication: JWT-based authentication with Google OAuth integration for secure user access.
* Workspace Management: Create, manage, and leave workspaces (tenants) for team organization.
* Task Management: CRUD operations for tasks with statuses (to_do, in_progress, done) and due dates.
* Invitations: Email-based invitation system for adding users to workspaces.
* GitHub Integration: Sync tasks with GitHub repositories and issues using OAuth tokens.
* Google Calendar Integration: Sync tasks to Google Calendar for scheduling.
* Real-Time Updates: WebSocket support for broadcasting task updates within workspaces.
* Comments: Manage task comments for enhanced collaboration.
* Email Notifications: Send invitations and task-related emails via a configurable email service.

## Tech Stack

* Framework: NestJS with TypeScript
* Database: PostgreSQL (local via Docker, deployed on Neon.tech)
* ORM: TypeORM for database interactions
* Authentication: JWT with Google OAuth (via auth module)
* WebSocket: Socket.IO for real-time updates (tasks.gateway.ts)
* Email: Gmail SMTP via Nodemailer (app password)
* Deployment: Fly.io (supports WebSockets)
* Testing: Jest for E2E tests

## Project Structure
```text
├── src
│   ├── app.module.ts                  # Main NestJS module
│   ├── auth                           # Authentication logic
│   │   ├── auth.controller.ts         # Authentication API endpoints
│   │   ├── auth.module.ts             # Auth module definition
│   │   ├── auth.service.ts            # Authentication logic
│   │   ├── jwt.strategy.ts            # JWT strategy for authentication
│   │   ├── roles.decorator.ts         # Custom role-based access decorator
│   │   ├── roles.guard.ts             # Role-based access guard
│   │   └── user.entity.ts             # User entity for TypeORM
│   ├── comments                       # Task comment management
│   │   ├── comment.entity.ts          # Comment entity
│   │   ├── comments.controller.ts     # Comment API endpoints
│   │   ├── comments.module.ts         # Comments module definition
│   │   └── comments.service.ts        # Comment logic
│   ├── github                         # GitHub integration
│   │   ├── github-token.controller.ts # GitHub token API endpoints
│   │   ├── github-token.entity.ts     # GitHub token entity
│   │   ├── github-token.module.ts     # GitHub module definition
│   │   └── github-token.service.ts    # GitHub token logic
│   ├── health                         # Health check endpoint
│   │   └── health.controller.ts       # Health check API
│   ├── invites                        # Invitation system
│   │   ├── invite.entity.ts           # Invite entity
│   │   ├── invites.controller.ts      # Invitation API endpoints
│   │   ├── invites.module.ts          # Invites module definition
│   │   └── invites.service.ts         # Invitation logic
│   ├── Issues                         # Task-GitHub issue linking
│   │   ├── task-issue.entity.ts       # Task-issue entity
│   │   ├── task-issue.module.ts       # Task-issue module definition
│   │   └── task-issue.service.ts      # Task-issue logic
│   ├── mailer                         # Email notifications
│   │   ├── email.service.ts           # General email service
│   │   └── task-mailer.service.ts     # Task-specific email logic
│   ├── main.ts                        # Application entry point
│   ├── middleware                     # Custom middleware
│   │   └── tenant.middleware.ts       # Tenant-based routing middleware
│   ├── tasks                          # Task management
│   │   ├── tasks.controller.ts        # Task API endpoints
│   │   ├── tasks.entity.ts            # Task entity
│   │   ├── tasks.gateway.ts           # WebSocket gateway for tasks
│   │   ├── tasks.module.ts            # Tasks module definition
│   │   └── tasks.service.ts           # Task logic
│   ├── tenants                        # Workspace management
│   │   ├── tenant.entity.ts           # Tenant entity
│   │   ├── tenants.controller.ts      # Tenant API endpoints
│   │   ├── tenants.module.ts          # Tenants module definition
│   │   └── tenants.service.ts         # Tenant logic
│   └── users                          # User management
│       ├── users.controller.ts        # User API endpoints
│       ├── users.module.ts            # Users module definition
│       └── users.service.ts           # User logic
├── test                               # E2E tests
│   ├── app.e2e-spec.ts                # E2E test suite
│   └── jest-e2e.json                  # Jest E2E config
├── data-source.ts                     # TypeORM data source config
├── Dockerfile                         # Production Docker config
├── Dockerfile.dev                     # Development Docker config
├── eslint.config.mjs                  # ESLint config
├── fly.toml                           # Fly.io deployment config
├── nest-cli.json                      # NestJS CLI config
├── package.json                       # Dependencies and scripts
├── package-lock.json                  # Dependency lock file
├── tsconfig.build.json                # TypeScript build config
└── tsconfig.json                      # TypeScript config
```
## Prerequisites

* Node.js: v18+
* Docker: For local development
* Neon.tech Account: For PostgreSQL database (deployment)
* Fly.io Account: For backend deployment
* Google OAuth Credentials: For authentication and Google Calendar integration
* GitHub OAuth App: For GitHub task/issue syncing
* Email Service: Sends invitation emails using `nodemailer` with SendGrid SMTP configuration.

## Setup Instructions
**Local Development**

The backend connects to a **PostgreSQL database**, with environment-based configuration.
In production, set `DATABASE_URL` to your cloud-hosted database (e.g., Neon.tech). For local development, the root `docker-compose.yml` provides a local PostgreSQL instance.

**1. Clone the Repository** - If not already cloned
```bash
git clone https://github.com/timothyroch/GitSync 
cd GitSync/backend
```

**2. Install Dependencies**
```bash
npm install
```

**3. Set Up Environment Variables**

Create a .env file in the backend directory:
```env
DATABASE_URL=postgresql://tim:password@localhost:5432/boardcollab?sslmode=disable
JWT_SECRET=<your-jwt-secret>
FRONTEND_URL=http://localhost:3000
GMAIL_USER=<your-email>
GMAIL_APP_PASSWORD=<your-16-character-code>
NODE_ENV=development
DB_HOST=postgres
# You can update the following 
DB_PORT=5432
DB_USERNAME=tim
DB_PASSWORD=password
DB_NAME=boardcollab
```

**Note:** The `DATABASE_URL` matches the docker-compose.yml setup (user: tim, password: password, database: boardcollab). For deployment, replace it with your Neon.tech connection string.

**4. Run with Docker**

* Ensure Docker is running.

* From the root directory (GitSync), start services:
```bash
docker-compose up --build
```


* Services:

  * Postgres: http://localhost:5432
  * pgAdmin: http://localhost:8080 (login: admin@example.com, password: `adminpass`)
  * Backend: http://localhost:5000




**5. Run Locally (Without Docker - if desired only)**

* Start the PostgreSQL database using Docker or a local instance.

* Run the backend:
```bash
npm run start:dev
```

* Access at http://localhost:5000.




**Deployment (Fly.io)**

**1. Push to GitPush** the backend directory to a Git repository.

**2. Install** Fly.io CLI
```bash
curl -L https://fly.io/install.sh | sh
flyctl auth login
```


**3. Create** a Fly.io App
```bash
flyctl launch
```

**4. Set Environment** Variables
```bash
flyctl secrets set DATABASE_URL=<your-neon-tech-db-url>
flyctl secrets set JWT_SECRET=<your-jwt-secret>
flyctl secrets set GOOGLE_CLIENT_ID=<your-google-client-id>
flyctl secrets set GOOGLE_CLIENT_SECRET=<your-google-client-secret>
flyctl secrets set GITHUB_CLIENT_ID=<your-github-client-id>
flyctl secrets set GITHUB_CLIENT_SECRET=<your-github-client-secret>
flyctl secrets set EMAIL_SERVICE=<your-email-service-api-key>
```

**5. Deploy**
``` bash
flyctl deploy
```


**6. Database Setup** (Neon.tech - for deployement)

* Create a PostgreSQL database on Neon.tech.
* Obtain the `DATABASE_URL` and update the Fly.io secrets.


## WebSocket Events
The tasks.gateway.ts handles real-time task updates via **Socket.IO**:
* **joinTenant**: Joins a tenant-specific room to receive updates.  
  * **Payload**: { tenantId: string }

* **createTask**: Emitted when a new task is created.
  *    **Payload**:  
  {
    tenantId: string;
    task: {
      title: string;
      creatorId: string;
      dueDate?: string;
      assigneeEmails?: string[];
    };
  }


* **updateTask**: Sends task data to be broadcast to others.
  * **Payload**: { tenantId: string; task: any }


* **addComment**: Sends a new comment to be broadcast.
  * **Payload**: { tenantId: string;  comment: any;}

Clients join a tenant-specific room (joinTenantRoom(tenantId)) to receive these events.


## Database Schema
**TypeORM** entities define the database schema:

* **User** (`user.entity.ts`): Stores user details (id, email, name).
* **Tenant** (`tenant.entity.ts`): Represents workspaces with associated tasks and members.
* **Invite** (`invite.entity.ts`): Manages invitations (id, email, tenant, inviter, status, token).
* **Task** (`tasks.entity.ts`): Stores task details (id, title, tenantId, creatorId, dueDate, assignees, status).
* **Comment** (`comment.entity.ts`): Stores task comments (id, taskId, userId, content).
* **GithubToken** (`github-token.entity.ts`): Stores GitHub access tokens (id, user, access_token, token_type, scope).
* **TaskIssue** (`task-issue.entity.ts`): Links tasks to GitHub issues (taskId, repo, issueNumber, issueTitle).

  
## Testing

* E2E Tests: Located in test/app.e2e-spec.ts.
* Run tests:
```bash
npm run test:e2e
```
* Ensure the PostgreSQL database is running and DATABASE_URL is set.


## Contributing

**1. Fork** the repository.

**2. Create** a feature **branch**: `git checkout -b feature/your-feature`.

**3. Commit** changes: `git commit -m "Add your feature"`.

**4. Push**: `git push origin feature/your-feature`.

**5. Open a pull** request.


## License

**MIT License.** See [LICENSE](https://github.com/timothyroch/GitSync/blob/main/LICENSE) for details.


## Contact
* Contact me at **timothyroch@gmail.com**.
