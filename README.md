# Smart Booking Software for Public Transport

A modern, full-stack MVP for public transport in Kenya.

## Features

- **Passenger Dashboard**: Route search, real-time vehicle tracking (simulated), and distance-based fare estimation.
- **Driver Interface**: Go online/offline, real-time location simulation, traffic alerts, and navigation to pickups.
- **Manager Portal**: Sacco revenue tracking, fleet efficiency analytics, and passenger feedback management.
- **Security**: Row Level Security (RLS) simulation, Rate Limiting (max 100 req), and SQL Injection prevention via Prisma.
- **Modern UI**: Dark-themed interactive interface with premium animations using Framer Motion and Tailwind CSS.

## Tech Stack

- **Frontend**: React 19, Vite, Tailwind CSS, Framer Motion, Lucide React.
- **Backend**: Node.js, Express, TypeScript, Prisma ORM.
- **Database**: SQLite (local development).

## Getting Started

### Prerequisites

- Node.js (v18+)
- npm

### Installation

1. Clone the repository.
2. Install backend dependencies:
   ```bash
   cd backend
   npm install
   ```
3. Set up the database:
   ```bash
   npx prisma migrate dev --name init
   ```
4. Install frontend dependencies:
   ```bash
   cd ../frontend
   npm install
   ```

### Running the App

1. Start the backend server:
   ```bash
   cd backend
   npm run dev
   ```
2. Start the frontend development server:
   ```bash
   cd frontend
   npm run dev
   ```

## Configuration

- Backend environment variables are managed in `backend/.env`.
- Frontend environment variables are managed in `frontend/.env`.

## Testing

Run backend tests:
```bash
cd backend
npm test
```
