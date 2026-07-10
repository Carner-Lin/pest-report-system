# Pest Report System

Pest Report System is a full-stack web application for reporting and tracking pest sightings in New Zealand. Users can browse pest reference data, submit pest reports with images and map locations, view reports on Google Maps, save reports, and use AI-assisted image identification.

## Features

- User registration and login
- Pest encyclopedia with reference data
- Pest report creation with image upload
- Google Maps location picker and report markers
- Report detail modal with image, metadata, and map location
- Saved or noted reports for logged-in users
- Admin or report-owner report deletion
- Gemini-powered pest image identification

## Tech Stack

- Frontend: React, React Router, Create React App, `@vis.gl/react-google-maps`
- Backend: Node.js, Express, MySQL, Multer, bcryptjs
- Database: MySQL
- AI: Google Gemini API

## Project Structure

```text
pest-report-system/
├── backend/              # Express API server
│   ├── routes/           # API route modules
│   ├── tests/            # Backend Jest tests
│   ├── uploads/          # Uploaded report images
│   ├── app.js
│   ├── db.js
│   └── server.js
├── database/             # Database schema and seed data
│   ├── schema.sql
│   └── seed.sql
├── frontend/             # React frontend
│   ├── public/
│   └── src/
├── zl354_export.sql      # Optional full MySQL export with sample data
└── README.md
```

## Prerequisites

Install these before running the project:

- Node.js 18 or later
- npm
- MySQL 8.x
- A Google Maps API key
- A Gemini API key

## Installation and Setup

Follow these steps after downloading or extracting the project source code.

### 1. Install Backend Dependencies

Open a terminal in the project root folder, then run:

```bash
cd backend
npm install
```

### 2. Install Frontend Dependencies

Open a second terminal in the project root folder, then run:

```bash
cd frontend
npm install
```

### 3. Create the MySQL Database

Create a MySQL database:

```bash
mysql -u root -p -e "CREATE DATABASE IF NOT EXISTS pest_report_system CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;"
```

From the project root folder, create the tables:

```bash
mysql -u root -p pest_report_system < database/schema.sql
```

Insert the pest seed data:

```bash
mysql -u root -p pest_report_system < database/seed.sql
```

Alternatively, import the full exported database:

```bash
mysql -u root -p pest_report_system < zl354_export.sql
```

Use either `schema.sql` plus `seed.sql`, or the full export file, depending on whether you want a clean database or the exported sample data.

### 4. Configure the Backend Environment

Create a new file named `backend/.env`. You can copy the structure from `backend/.env.example`:

```env
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=your_mysql_password
DB_NAME=pest_report_system
DB_PORT=3306

BACKEND_BASE_URL=http://localhost:5000
GEMINI_API_KEY=your_gemini_api_key
```

Replace `your_mysql_password` and `your_gemini_api_key` with real local values.

### 5. Configure the Frontend Environment

Create a new file named `frontend/.env`. You can copy the structure from `frontend/.env.example`:

```env
REACT_APP_API_BASE_URL=http://localhost:5000
REACT_APP_GOOGLE_MAPS_API_KEY=your_google_maps_api_key
```

Replace `your_google_maps_api_key` with a real Google Maps JavaScript API key.

### 6. Start the Backend

In the backend terminal, run:

```bash
npm start
```

For development with automatic restarts:

```bash
npm run dev
```

The backend runs at:

```text
http://localhost:5000
```

Health check:

```text
http://localhost:5000/api/test
```

### 7. Start the Frontend

In the frontend terminal, run:

```bash
npm start
```

The frontend runs at:

```text
http://localhost:3000
```

## Run the App

After setup is complete, run the application in this order:

1. Start MySQL and make sure the `pest_report_system` database exists.
2. Start the backend from `backend/` with `npm start`.
3. Start the frontend from `frontend/` with `npm start`.
4. Open `http://localhost:3000` in a browser.

The backend must be running before the frontend can load API data.

## Useful Commands

Run backend tests:

```bash
cd backend
npm test
```

Run frontend tests:

```bash
cd frontend
npm test
```

Run frontend tests in watch mode:

```bash
cd frontend
npm run test:watch
```

Build the frontend for production:

```bash
cd frontend
npm run build
```

## Main API Routes

- `GET /api/test` - backend health check
- `GET /api/pests` - get pest encyclopedia data
- `GET /api/reports` - get all pest reports
- `POST /api/reports` - create a pest report
- `GET /api/reports/user/:userId` - get reports created by one user
- `GET /api/reports/noted/:userId` - get reports saved by one user
- `POST /api/reports/:reportId/note` - save a report
- `DELETE /api/reports/:reportId/note/:userId` - remove a saved report
- `DELETE /api/reports/:id` - delete a report
- `POST /api/users/register` - register a user
- `POST /api/users/login` - log in
- `POST /api/ai/identify-pest` - identify a pest from an uploaded image

## Notes

- Uploaded images are stored in `backend/uploads/` and served through `/uploads/...`.
- Users must be logged in before submitting a pest report.
- Report deletion is checked by the backend: admins and report owners can delete reports.
- AI identification is only a suggestion and should be verified before submitting a report.
