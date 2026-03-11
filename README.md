# Todo App

A full-stack Todo application built with **Next.js 14**, **TypeORM**, and **SQLite (better-sqlite3)**.

## Features

- ✅ Create, Read, Update, Delete todos
- 🔍 Filter by All / Active / Completed
- ✏️ Inline editing of title and description
- 📱 Responsive design for desktop and mobile
- 💾 Persistent SQLite database

## Tech Stack

- **Frontend**: Next.js 14 App Router, React, TypeScript, CSS
- **Backend**: Next.js API Routes
- **Database**: SQLite via `better-sqlite3` + TypeORM
- **Containerization**: Docker + Docker Compose

---

## Local Development

### Prerequisites

- Node.js 20+
- npm

### Setup

```bash
# 1. Clone the repository
git clone <repo-url>
cd todo-app

# 2. Install dependencies
npm i

# 3. Create the data directory
mkdir -p data

# 4. Copy environment file (already included)
# The .env file contains:
# DATABASE_PATH=./data/todos.db

# 5. Run in development mode
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## Docker Deployment

### Using Docker Compose (Recommended)

```bash
# Build and start the application
docker-compose up -d --build

# View logs
docker-compose logs -f

# Stop the application
docker-compose down

# Stop and remove volumes (deletes database)
docker-compose down -v
```

The app will be available at [http://localhost:3000](http://localhost:3000).

### Using Docker directly

```bash
# Build the image
docker build -t todo-app .

# Run the container
docker run -d \
  -p 3000:3000 \
  -v todo-data:/app/data \
  -e DATABASE_PATH=/app/data/todos.db \
  --name todo-app \
  todo-app
```

---

## Coolify Deployment

1. Push your code to a Git repository (GitHub, GitLab, etc.)
2. In Coolify, create a new service and select **Docker Compose**
3. Point it to your repository
4. Coolify will use the `docker-compose.yml` file automatically
5. The SQLite database is stored in a named Docker volume (`todo-data`) for persistence

---

## API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/todos` | Get all todos |
| GET | `/api/todos?status=active` | Get active todos |
| GET | `/api/todos?status=completed` | Get completed todos |
| POST | `/api/todos` | Create a new todo |
| GET | `/api/todos/:id` | Get a single todo |
| PUT | `/api/todos/:id` | Update a todo |
| DELETE | `/api/todos/:id` | Delete a todo |

### Request/Response Examples

**Create a todo:**
```json
POST /api/todos
{
  "title": "Buy groceries",
  "description": "Milk, eggs, bread"
}
```

**Update a todo:**
```json
PUT /api/todos/1
{
  "title": "Buy groceries",
  "completed": true
}
```

---

## Environment Variables

| Variable | Default | Description |
|----------|---------|-------------|
| `DATABASE_PATH` | `./data/todos.db` | Path to the SQLite database file |

---

## Project Structure

```
todo-app/
├── src/
│   ├── app/
│   │   ├── layout.tsx          # Root layout
│   │   ├── page.tsx             # Main page (client component)
│   │   ├── globals.css          # Global styles
│   │   └── api/todos/           # REST API routes
│   ├── components/
│   │   ├── AddTodoForm.tsx      # Form to create todos
│   │   ├── TodoList.tsx         # Todo list container
│   │   └── TodoItem.tsx         # Individual todo item
│   ├── entities/
│   │   └── Todo.ts              # TypeORM entity
│   └── lib/
│       └── database.ts          # TypeORM DataSource
├── data/                        # SQLite database (gitignored)
├── .env                         # Environment variables
├── Dockerfile                   # Multi-stage Docker build
├── docker-compose.yml           # Docker Compose config
└── next.config.js               # Next.js configuration
```
