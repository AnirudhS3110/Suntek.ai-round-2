# Tracker - Task and Time Tracking App

A full-stack, modern productivity SaaS dashboard that allows users to manage tasks, track time spent using a real-time timer, and view daily productivity summaries.

##  Live Demo
 **Live Demo:** : https://suntek-ai-round-2.vercel.app/ <br/>
 **Working Auth:** Yes (JWT-based) <br/>
 **Test Credentials:**
   - **Email:** demo1@gmail.com
   - **Password:** pass123

##  Features
### 1. Authentication
- Secure email/password authentication using JWT.
- Protected API routes and frontend data isolation (users only see their own tasks and time logs).

### 2. Task Management
- Create, View, Edit, and Delete tasks.
- **AI Assist:** Auto-generate structured titles and descriptions from natural language.
- Manage task statuses (Pending, In Progress, Completed).

### 3. Real-Time Time Tracking
- Start/stop global time tracking per task.
- Real-time elapsed time counter (Active Timer Widget).
- View total time spent on each task directly on the task card.

### 4. Daily Summary & Analytics
- View total time tracked today.
- Breakdown of Completed, Pending, and In Progress tasks.
- **Bonus:** Weekly productivity bar chart tracking hours over the last 7 days.

##  Tech Stack
- **Frontend:** Next.js (App Router), TypeScript, Tailwind CSS, shadcn/ui, TanStack Query, React Hook Form, Socket.IO Client, Recharts.
- **Backend:** NestJS, TypeScript, Drizzle ORM, PostgreSQL, Socket.IO, JWT.

##  Local Development Setup

### Prerequisites
- Node.js (v18+)

### Backend Setup
1. Navigate to the backend directory:
   ```bash
   cd apps/backend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Create a `.env` file and configure your database and JWT secret:
   ```env
   DATABASE_URL="postgres://user:password@localhost:5432/suntek"
   JWT_SECRET="your_super_secret_jwt_key"
   PORT=3000
   ```
4. Run database migrations:
   ```bash
   npm run db:push
   ```
5. Start the backend server:
   ```bash
   npm run start:dev
   ```

### Frontend Setup
1. Navigate to the frontend directory:
   ```bash
   cd apps/frontend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Create a `.env.local` file and point it to the backend:
   ```env
   NEXT_PUBLIC_API_URL="http://localhost:3000"
   ```
4. Start the development server:
   ```bash
   npm run dev
   ```
5. Open the app in your browser (usually `http://localhost:3000` or `http://localhost:3001`).

##  Project Structure
This repository uses a monorepo-style structure:
- `/apps/frontend`: Next.js application containing all UI components, hooks, and services.
- `/apps/backend`: NestJS application containing REST API controllers, services, WebSocket gateways, and Drizzle schema.
