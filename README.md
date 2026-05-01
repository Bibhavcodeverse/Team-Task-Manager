# Team Task Manager

A full-stack application built for managing team projects, tasks, and members with role-based access control. (Updated)

## Tech Stack
* **Framework:** Next.js (App Router)
* **Backend APIs:** Next.js Route Handlers
* **Database:** Prisma ORM with SQLite (Local) / PostgreSQL (Production)
* **Authentication:** Custom JWT via `jose` and HTTP-only cookies
* **Styling:** Custom Vanilla CSS for a premium, lightweight UI

## Features
* **Role-Based Access Control:** Users are either Admins or Members. Admins can create projects and view everything.
* **Project Management:** Create, view, and delete projects.
* **Task Board:** Track tasks using a Kanban-style view (To Do, In Progress, Done).
* **Dashboard Analytics:** High-level overview of total tasks, overdue tasks, and task statuses.
* **Premium Design:** Micro-interactions, hover states, clean layouts without external UI libraries.

## Running Locally

1. Install dependencies:
   ```bash
   npm install
   ```

2. Generate the Prisma Client and push the local database:
   ```bash
   npx prisma db push
   npx prisma generate
   ```

3. Start the development server:
   ```bash
   npm run dev
   ```

## Railway Deployment Instructions

To successfully deploy this full-stack application to Railway, please follow these steps:

### 1. Update Prisma for PostgreSQL
Before pushing your code to GitHub to deploy on Railway, change the `provider` in `prisma/schema.prisma` from SQLite to PostgreSQL:

```prisma
datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}
```

### 2. Deploy on Railway
1. Push this code to a new GitHub repository.
2. Log into [Railway.app](https://railway.app/).
3. Click **New Project** -> **Deploy from GitHub repo** and select your repository.
4. Once deployed, Railway will detect it's a Next.js app.

### 3. Add PostgreSQL Database
1. In your Railway project, click **New** -> **Database** -> **Add PostgreSQL**.
2. Wait for the database to provision.

### 4. Connect App to Database & Setup Environment Variables
1. In your Next.js service on Railway, go to the **Variables** tab.
2. Add a `DATABASE_URL` variable. To get its value, you can click "Add Reference" and select `DATABASE_URL` from the Postgres service.
3. Add a `JWT_SECRET` variable (e.g., set to a long random string like `super_secret_production_key_123!`).

### 5. Run Migrations on Deploy
To ensure your database tables are created automatically on deploy, add the following script to your `package.json`:
```json
"scripts": {
  ...
  "build": "prisma generate && prisma db push && next build",
  ...
}
```
*(Note: For strict production environments, `prisma migrate deploy` is preferred, but `db push` works perfectly for this assignment context).*


