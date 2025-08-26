# Chocolate Bakery

A full-stack web application for a bakery business, built with Angular, Node.js, and MySQL.

## Project Structure

This project is organized as a monorepo with the following structure:

```
chocolate-bakery/
├── frontend/         # Angular frontend application
├── backend/          # Node.js backend API
└── README.md         # This file
```

## Technologies Used

### Frontend
- Angular 17+
- TypeScript
- SCSS for styling
- Angular Router for navigation

### Backend
- Node.js
- Express.js
- MySQL (via mysql2)
- Environment configuration with dotenv

## Getting Started

### Prerequisites
- Node.js (v18+)
- npm (v9+)
- MySQL Server

### Setup and Installation

1. Clone the repository
```bash
git clone https://github.com/PM-Group-BTS/chocolate-bakery.git
cd chocolate-bakery
```

2. Set up the backend
```bash
cd backend
npm install
# Create a .env file with your database configuration
npm run dev
```

3. Set up the frontend
```bash
cd frontend
npm install
npm start
```

4. Access the application
- Frontend: http://localhost:4200
- Backend API: http://localhost:3000/api

## Development

### Backend Development
```bash
cd backend
npm run dev
```

### Frontend Development
```bash
cd frontend
npm start
```

## Building for Production

### Backend
```bash
cd backend
npm run build
```

### Frontend
```bash
cd frontend
npm run build
```

## License

This project is part of the HomemadeCakes project for MentoringPM Project.

