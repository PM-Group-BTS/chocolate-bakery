# Chocolate Bakery Backend

This is the backend API for the Chocolate Bakery application, built with Node.js, Express, and MySQL.

## Prerequisites

- Node.js (v14 or higher)
- MySQL (v5.7 or higher)

## Setup

1. Install dependencies:
   ```
   npm install
   ```

2. Create a `.env` file based on `.env.example` and configure your environment variables.

3. Create the MySQL database:
   ```sql
   CREATE DATABASE chocolate_bakery;
   ```

## Running the Application

### Development mode:
```
npm run dev
```

### Production mode:
```
npm start
```

## API Endpoints

- `GET /health`: Health check endpoint
- `GET /api`: Welcome message
- `GET /api/test`: Test endpoint

## Database

The application uses MySQL as the database. Connection settings can be configured in the `.env` file.

