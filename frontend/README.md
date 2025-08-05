# GitSync Frontend

The GitSync Frontend is a Next.js application that provides the user interface for the GitSync task management platform. It enables users to manage workspaces (tenants), create and track tasks, invite team members, and integrate tasks with GitHub issues and Google Calendar. Built with React, TypeScript, and Tailwind CSS, it offers a responsive and intuitive experience, with real-time updates via Socket.IO and secure authentication using NextAuth.js with Google OAuth.

## Features

* **Authentication**: Secure sign-in with Google OAuth via NextAuth.js.
* **Workspace Management**: Create and view workspaces, join via invitations, and leave groups.
* **Task Management**: Create, update, and delete tasks with statuses (to_do, in_progress, done) and due dates.
* **Team Collaboration**: Invite users to workspaces via email and manage memberships.
* **GitHub Integration**: Link tasks to GitHub repositories and issues.
* **Google Calendar Integration**: Sync tasks to Google Calendar for scheduling.
* **Real-Time Updates**: Receive task updates in real-time using Socket.IO.
* **Calendar View**: Visualize tasks in a calendar using FullCalendar.
* **Comments**: Add and view task comments for collaboration.
* **Responsive UI**: Modern interface with Tailwind CSS and reusable components.

## Tech Stack

* **Framework**: Next.js (React) with TypeScript
* **Authentication**: NextAuth.js with Google OAuth
* **Styling**: Tailwind CSS with PostCSS
* **UI Libraries**:
  * **Lucide Icons** for icons
  * **Headless UI** for accessible dropdowns
  * **FullCalendar** for calendar visualization
* **WebSocket**: Socket.IO for real-time updates
* **Deployment**: Vercel

## Project Structure
```text
├── src
│   ├── app
│   │   ├── dashboard                  # Dashboard pages
│   │   │   ├── page.tsx               # Main dashboard
│   │   │   └── [tenantId]             # Tenant-specific dashboard
│   │   │       └── page.tsx
│   │   ├── favicon.ico                # Favicon
│   │   ├── globals.css                # Global Tailwind CSS styles
│   │   ├── layout.tsx                 # Root layout with AuthProvider
│   │   ├── page.tsx                   # Home page
│   │   ├── privacy                    # Privacy policy page
│   │   │   └── page.tsx
│   │   ├── signin                     # Sign-in page
│   │   │   └── page.tsx
│   │   └── terms                      # Terms of service page
│   │       └── page.tsx
│   ├── components
│   │   ├── AuthProvider.tsx           # NextAuth.js provider
│   │   ├── Footer.tsx                 # Footer component
│   │   ├── GeneralSection.tsx         # Workspace member management
│   │   ├── GroupSection.tsx           # Group task management
│   │   ├── HeaderSelector.tsx         # Tab navigation for tenant dashboard
│   │   ├── MySpaceSection.tsx         # User tasks with calendar view
│   │   ├── Navbar.tsx                 # Navigation bar
│   │   ├── TaskComments.tsx           # Task comment display
│   │   ├── TaskCreator.tsx            # Task creation form
│   │   ├── TaskList.tsx               # Task list display
│   │   └── ui                         # Reusable UI components
│   │       ├── Button.tsx             # Custom button
│   │       ├── calendar.tsx           # FullCalendar wrapper
│   │       ├── input.tsx              # Custom input
│   │       └── label.tsx              # Custom label
│   ├── pages
│   │   ├── accept-invite.tsx          # Handle invitation acceptance
│   │   ├── api                        # Next.js API routes
│   │   │   ├── auth
│   │   │   │   └── [...nextauth].ts   # NextAuth.js configuration
│   │   │   ├── calendar-consent       # Google Calendar OAuth consent
│   │   │   │   └── callback.ts
│   │   │   ├── calendar-consent.ts    # Initiate Google Calendar OAuth
│   │   │   ├── create-comment.ts      # Create task comment
│   │   │   ├── create-task.ts         # Create task
│   │   │   ├── create-tenant.ts       # Create workspace
│   │   │   ├── delete-task.ts         # Delete task
│   │   │   ├── get-comment.ts         # Fetch task comments
│   │   │   ├── get-invites.ts         # Fetch pending invitations
│   │   │   ├── get-tasks.ts           # Fetch tasks
│   │   │   ├── get-tenants.ts         # Fetch workspaces
│   │   │   ├── get-tenant.ts          # Fetch workspace details
│   │   │   ├── get-users.ts           # Fetch users
│   │   │   ├── github-auth.ts         # Initiate GitHub OAuth
│   │   │   ├── github-callback.ts     # Handle GitHub OAuth callback
│   │   │   ├── github-issues.ts       # Fetch GitHub issues
│   │   │   ├── invite-accept-from-email.ts # Accept invitation via email
│   │   │   ├── invite-accept.ts       # Accept invitation
│   │   │   ├── invite-reject.ts       # Reject invitation
│   │   │   ├── leave-group.ts         # Leave workspace
│   │   │   ├── repos.ts               # Fetch GitHub repositories
│   │   │   ├── send-invite.ts         # Send invitation
│   │   │   ├── sync-to-calendar.ts    # Sync task to Google Calendar
│   │   │   └── update-task-status.ts  # Update task status
│   │   └── post-signin.tsx            # Post-sign-in redirect
├── lib
│   └── utils.ts                       # Utility functions
├── public                             # Static assets
│   ├── create_group.png               # Image for creating groups
│   ├── create_task.png                # Image for task creation
│   ├── file.svg                       # File icon
│   ├── globe.svg                      # Globe icon
│   ├── google_calendar.png            # Google Calendar icon
│   ├── group.png                      # Group icon
│   ├── invite.png                     # Invite icon
│   ├── mail.png                       # Mail icon
│   ├── next.svg                       # Next.js logo
│   ├── sync_calendar.png              # Calendar sync icon
│   ├── sync_github.png                # GitHub sync icon
│   ├── vercel.svg                     # Vercel logo
│   ├── window.svg                     # Window icon
│   └── your_tasks.png                 # Tasks icon
├── types
│   ├── next-auth.d.ts                 # NextAuth.js type definitions
│   └── task.ts                        # Task type definitions
├── utils
│   └── socket.ts                      # Socket.IO client setup
├── Dockerfile                         # Production Docker config
├── Dockerfile.dev                     # Development Docker config
├── eslint.config.mjs                  # ESLint config
├── next.config.ts                     # Next.js config
├── next-env.d.ts                      # Next.js environment types
├── package.json                       # Dependencies and scripts
├── package-lock.json                  # Dependency lock file
├── postcss.config.mjs                 # PostCSS config
├── tsconfig.json                      # TypeScript config
└── tailwind.config.js                 # Tailwind CSS config
```

## Prerequisites

* **Node.js**: v18+
* **Docker**: For local development (via root docker-compose.yml)
* **Vercel Account**: For deployment
* **Google OAuth Credentials**: For authentication and Google Calendar integration
* **GitHub OAuth Credentials**: For syncing user accounts with GitHub
* **Backend API**: Running at http://localhost:5000 (local) or a deployed URL (e.g., https://your-app.fly.dev)


## Setup Instructions

**Local Development**

The frontend interacts with the GitSync Backend API. Ensure the backend is running (see [`backend/README.md`](https://github.com/timothyroch/GitSync/tree/main/backend#readme) for setup).

**1. Clone the Repository** - if not already cloned
```bash
git clone https://github.com/timothyroch/GitSync
cd GitSync/frontend
```

**2. Install Dependencies**
```bash
npm install
```

**3. Set Up Environment Variables**
  Create a `.env.local` file in the frontend directory:
```bash
NEXTAUTH_URL=http://localhost:3000
NEXT_URL=http://localhost:3000
NEXTAUTH_SECRET=<your-nextauth-secret>
JWT_SECRET=<your-jwt-secret>

NEXT_PUBLIC_API_URL=http://backend:5000
NEXT_PUBLIC_BACKEND_URL=http://backend:5000
NEXT_PUBLIC_SOCKET_URL=http://localhost:5000
NEXT_PUBLIC_API_COMMENTS=http://localhost:5000

AUTHORIZED_REDIRECT_URIS=http://localhost:3000/api/auth/callback/google,http://localhost:3000/api/auth/callback/credentials

GITHUB_CLIENT_ID=<your-github-client-id>
GITHUB_CLIENT_SECRET=<your-github-client-secret>
GOOGLE_CLIENT_ID=<your-google-client-id>
GOOGLE_CLIENT_SECRET=<your-google-client-secret>
```
* **NEXTAUTH_URL**: The frontend URL (local: http://localhost:3000, deployed: https://gitsync.vercel.app).
* **NEXT_URL**: Used internally by the app for self-referencing in backend calls or redirects.
* **NEXTAUTH_SECRET**: A secure secret for NextAuth.js.
* **JWT_SECRET**: Secret key used for manually signing/verifying JWTs.
* **NEXT_PUBLIC_API_URL**: Base URL used for API requests from the frontend to the backend.
* **NEXT_PUBLIC_BACKEND_URL**: Alternate label for the backend URL.
* **NEXT_PUBLIC_SOCKET_URL**: WebSocket server URL.
* **NEXT_PUBLIC_API_COMMENTS**: Endpoint for handling comment-related requests.
* **AUTHORIZED_REDIRECT_URIS**: Comma-separated list of OAuth redirect URIs.
* **GOOGLE_CLIENT_ID** and **GOOGLE_CLIENT_SECRET**: From your Google OAuth app.
* **GITHUB_CLIENT_ID / GITHUB_CLIENT_SECRET**: Credentials from your GitHub OAuth App

**4. Run with Docker**

* Ensure Docker is running and the backend is set up (via `docker-compose.yml` in the root directory).
* From the root directory (`GitSync`), start services:
```bash
docker-compose up --build
```
* **Services:**
  * **Frontend**: http://localhost:3000
  * **Backend**: http://localhost:5000
  * **Postgres**: http://localhost:5432
  * **pgAdmin**: http://localhost:8080 (login: admin@example.com, password: adminpass)

**5. Run Locally (Without Docker - if desired only)**

* Ensure the backend is running.
* Start the frontend:
```bash
npm run dev
```
* Access at http://localhost:3000.

**6. Access the Application**
* Open http://localhost:3000.
* Sign in with Google OAuth at /signin.


## Deployment (Vercel)

**1. Push to Git**

  Push the frontend directory to a Git repository.
  
**2. Connect to Vercel**

  Link the repository to Vercel via the Vercel dashboard or CLI.
  
**3. Set Environment Variables**

  In the Vercel dashboard or via CLI:
  
```bash
vercel env add NEXTAUTH_URL https://<your-frontend-app>.vercel.app
vercel env add NEXTAUTH_SECRET <your-nextauth-secret>
vercel env add JWT_SECRET <your-jwt-secret>
vercel env add GOOGLE_CLIENT_ID <your-google-client-id>
vercel env add GOOGLE_CLIENT_SECRET <your-google-client-secret>
vercel env add GITHUB_CLIENT_ID <your-github-client-id>
vercel env add GITHUB_CLIENT_SECRET <your-github-client-secret>
vercel env add NEXT_URL https://<your-frontend-app>.vercel.app
vercel env add AUTHORIZED_REDIRECT_URIS https://<your-frontend-app>.vercel.app/api/auth/callback/google,https://<your-frontend-app>.vercel.app/api/auth/callback/credentials
vercel env add NEXT_PUBLIC_API_URL https://<your-backend-app>.fly.dev
vercel env add NEXT_PUBLIC_BACKEND_URL https://<your-backend-app>.fly.dev
vercel env add NEXT_PUBLIC_API_COMMENTS https://<your-backend-app>.fly.dev/api/comments
vercel env add NEXT_PUBLIC_SOCKET_URL https://<your-backend-app>.fly.dev

```
**4. Deploy**
```bash
vercel --prod
```


## Usage

**1. Sign In**: Navigate to /signin and use Google OAuth to authenticate.

**2. Dashboard** (`/dashboard`):

* View workspaces and pending invitations.
* Create new workspaces with Create New Group.
  
**3. Tenant Dashboard** (`/dashboard/[tenantId]`):

* **General Tab**: View members, send invitations (`send-invite.ts`).
* **My Space Tab**: View assigned tasks, sync to Google Calendar (`sync-to-calendar.ts`), and see calendar view (`MySpaceSection.tsx`).
* **Group Tab**: Manage all tasks, link to GitHub issues (`github-issues.ts`), and create tasks (`TaskCreator.tsx`).
  
**4. Task Management**:

* Create tasks with titles, assignees, due dates, and GitHub issue links (`create-task.ts`).
* Update task statuses (`update-task-status.ts`).
* Delete tasks (`delete-task.ts`).
* Add/view comments (`TaskComments.tsx`, `create-comment.ts`, `get-comment.ts`).
  
**5. Invitations**:

* Accept/reject invitations (`invite-accept.ts`, `invite-reject.ts`).
* Accept via email links (`invite-accept-from-email.ts`).
  
**6. Real-Time Updates**:

* Socket.IO client (`utils/socket.ts`) connects to the backend for real-time task updates.



## API Routes
The src/pages/api directory contains Next.js API routes that interact with the backend:

* **Authentication**:
  * `/api/auth/[...nextauth]`: NextAuth.js configuration for Google OAuth.
* Tenants:
  * `/api/get-tenants`: Fetch user workspaces.
  * `/api/create-tenant`: Create a workspace.
  * `/api/get-tenant`: Fetch workspace details.
  * `/api/leave-group`: Leave a workspace.
* Invites:
  * `/api/get-invites`: Fetch pending invitations.
  * `/api/send-invite`: Send an invitation.
  * `/api/invite-accept`: Accept an invitation.
  * `/api/invite-reject`: Reject an invitation.
  * `/api/invite-accept-from-email`: Accept via email link.
* Tasks:
  * `/api/get-tasks`: Fetch tasks for a workspace.
  * `/api/create-task`: Create a task.
  * `/api/update-task-status`: Update task status.
  * `/api/delete-task`: Delete a task.
  * `/api/create-comment`: Add a task comment.
  * `/api/get-comment`: Fetch task comments.
* GitHub Integration:
  * `/api/repos`: Fetch GitHub repositories.
  * `/api/github-issues`: Fetch repository issues.
  * `/api/github-auth`: Initiate GitHub OAuth for task syncing.
  * `/api/github-callback`: Handle GitHub OAuth callback.
* Google Calendar Integration:
  * `/api/check-calendar-scope`: Check Google Calendar access scope.
  * `/api/calendar-consent`: Initiate Google Calendar OAuth.
  * `/api/calendar-consent/callback`: Handle Google Calendar OAuth callback.
  * `/api/sync-to-calendar`: Sync task to Google Calendar.



## Authentication
The frontend uses **NextAuth.js** with **Google OAuth** (`src/pages/api/auth/[...nextauth].ts`):
* **Session Data**:
* accessToken, refreshToken, scope, expiresAt for Google OAuth.
* **user**: Includes name, email, image, userId, and tenantId.
* **Callbacks**:
  * **jwt**: Resolves user details via /auth/resolve-user backend endpoint.
  * **session**: Attaches token data to the session.


## WebSocket Integration
The `utils/socket.ts` file sets up a **Socket.IO** client to connect to the backend for real-time task updates:
* Events Handled:
  * **taskCreated**: Emitted when a new task is created.
  * **taskStatusUpdated**: Emitted when a task’s status is changed.
  * **taskDeleted**: Emitted when a task is deleted.
  * **commentAdded**: Emitted when a new comment is added.
* **Room**: Clients join a tenant-specific room (joinTenantRoom(tenantId)) to receive updates.


## Configuration Notes

* **NextAuth.js**: Configured in `src/pages/api/auth/[...nextauth].ts` with Google OAuth provider, including Google Calendar scope (`https://www.googleapis.com/auth/calendar.events`).
* **Tailwind CSS**: Configured in `tailwind.config.js` and applied via `globals.css`.
* **Static Assets**: Images and icons in public (e.g., `create_task.png`, `sync_github.png`) enhance the UI.
* **TypeScript**: Type definitions in `types/next-auth.d.ts` and types/task.ts ensure type safety.


## Contributing

**1. Fork the repository.**

**2. Create a feature branch**: `git checkout -b feature/your-feature`.

**3. Commit changes**: `git commit -m "Add your feature"`.

**4. Push**: `git push origin feature/your-feature`.

**5. Open a pull request.**


## License

**MIT License**. See LICENSE for details.


## Contact

Contact me at timothyroch@gmail.com.
