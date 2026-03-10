# Workshop Registration System

A full-stack workshop registration application built with **React** and **Node.js**.
The system allows students to register for a workshop and view all registered participants in real time.

---

## Tech Stack

### Frontend

* React
* Vite
* JavaScript

### Backend

* Node.js
* Express.js
* CORS

### Storage

* File-based storage (`participants.txt`)

---

## Features

* Student registration form
* Department selection
* View all registered participants
* Asynchronous file storage using Node.js
* Event-driven backend architecture
* Clean terminal-style UI
* Real-time fetch from backend API

---

## Project Structure

```
Workshop_registration
│
├── frontend
│   ├── src
│   │   ├── App.jsx
│   │   └── main.jsx
│   │
│   ├── index.html
│   ├── package.json
│   └── vite.config.js
│
├── backend
│   ├── server.js
│   ├── participants.txt
│   └── package.json
│
└── .gitignore
```

---

## Installation

Clone the repository:

```
git clone https://github.com/arrzinee/Workshop_registration.git
```

Move into the project directory:

```
cd Workshop_registration
```

---

## Backend Setup

Navigate to the backend folder:

```
cd backend
```

Install dependencies:

```
npm install
```

Start the backend server:

```
node server.js
```

The backend will run at:

```
http://localhost:5000
```

---

## Frontend Setup

Open another terminal and navigate to the frontend folder:

```
cd frontend
```

Install dependencies:

```
npm install
```

Start the development server:

```
npm run dev
```

The frontend will run at:

```
http://localhost:5173
```

---

## API Endpoints

### Register a Participant

```
POST /register
```

Request body:

```
{
  "name": "John Doe",
  "department": "Computer Science"
}
```

---

### Get All Participants

```
GET /participants
```

Response example:

```
{
  "participants": [
    {
      "id": 1,
      "name": "John Doe",
      "department": "Computer Science",
      "timestamp": "2026-03-11T10:30:00.000Z"
    }
  ],
  "total": 1
}
```

---

## How It Works

1. React frontend collects user registration data.
2. The frontend sends a POST request to the backend API.
3. Node.js processes the request and saves the data asynchronously to a file.
4. The participants list is fetched using a GET request and displayed in the UI.

---

## Future Improvements

* Database integration (MongoDB or PostgreSQL)
* Authentication for admin access
* CSV export of participants
* Live participant updates
* Deployment to cloud hosting

---


