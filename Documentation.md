#  Coffee Brew Log — Project Documentation

A responsive full-stack web application that allows coffee enthusiasts to log brew details, track recipes, filter entries by brewing methods and record tasting notes.

---

## Architecture & Tech Stack

### Frontend (`/frontend`)
- **Framework:** React 18 (Vite)
- **Styling:** Tailwind CSS
- **Features:** 
  - Responsive List and Grid view layouts.
  - Live item counter in header (`Brews: {brewCount}`).
  - Dynamic filtering by brewing method using a drop-down menu.
  - Client-side form validation preventing blank entries.
  - Add/Edit modal with integrated deletion capability.

### Backend (`/backend`)
- **Runtime & Server:** Node.js, Express.js (ES Modules)
- **Database & ORM:** SQLite database managed via Prisma ORM v5
- **API Architecture:** RESTful JSON API supporting standard CRUD operations with server-side validation and HTTP status reporting.

---

## Repository Structure

```text
coffee-brew-log/
├── backend/
│   ├── prisma/
│   │   ├── schema.prisma    # Database schema definition
│   │   └── dev.db           # Local SQLite database
│   ├── .env                 # Environment secrets (ignored by git)
│   ├── .env.example         # Environment variable template
│   ├── index.js             # Express API server & routes
│   └── package.json
├── frontend/
│   ├── src/
│   │   ├── App.jsx          # Main state & view switcher container
│   │   ├── BrewCard.jsx     # Grid card component
│   │   ├── BrewModal.jsx    # Add/Edit modal form component
│   │   └── index.css        # Tailwind styles
│   ├── vite.config.js
│   └── package.json
├── Documentation.md         # Project documentation
└── deployment.md            # Deployment details & URLs


Repository Structure

Prerequisites
Node.js: v18.0.0 or higher

npm: v9.0.0 or higher

Step 1: Set Up Backend
Navigate to the backend folder:

Terminal
cd backend
Install dependencies:

Terminal
npm install
Environment Setup:
Create a .env file in backend/ using .env.example:

Code snippet
PORT=5000
DATABASE_URL="file:./dev.db"
Initialize SQLite Database & Prisma Client:

Terminal
npx prisma db push
npx prisma generate
Start the backend development server:

Terminal
npm run dev
The Express server will start on http://localhost:5000.

Step 2: Set Up Frontend
Open a new terminal tab/window and navigate to the frontend folder:

Terminal
cd frontend
Install dependencies:

Terminal
npm install
Start the Vite development server:

Terminal
npm run dev
Open the web app in your browser at http://localhost:5173.