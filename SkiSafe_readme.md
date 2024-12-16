# SkiSafe

SkiSafe is a comprehensive platform that provides real-time weather updates, snow conditions, resort information, safety tips, and user interaction features for skiers. The project consists of both a **frontend** and a **backend** component:

- **Frontend**: A React-based web application that displays weather forecasts, snow conditions, and resort information, with features like user authentication, feedback submission, and resort bookmarking.
- **Backend**: A server-side component built in Go that manages user authentication, feedback, resort data, and user bookmarks, utilizing a database for storing and retrieving data.

This project leverages real-time data from the **National Oceanic and Atmospheric Administration (NOAA)** for weather and snow forecasts, ensuring that skiers can make informed decisions while on the slopes.

## Features

### Frontend
- **Real-Time Weather Updates**: Display the latest weather data, including snow conditions, temperature, and precipitation.
- **Resort Information**: Access detailed resort information, including trail maps and resort conditions.
- **User Authentication**: Secure user login, sign-up, and account management.
- **Feedback System**: Submit feedback about resorts and read feedback from other users.
- **Responsive Design**: Optimized for mobile and desktop devices, ensuring a smooth user experience.

### Backend
- **User Authentication**: JWT-based authentication to securely log in users and manage sessions.
- **Resort Data Management**: Add, retrieve, and update resort information in the database.
- **User Bookmarks**: Allow users to bookmark their favorite resorts for easy access.
- **Feedback System**: Store and retrieve user feedback about resorts.
- **Database Management**: Support for creating, populating, and wiping database tables, as well as handling errors and cross-origin requests.

## Folder Structure

The project contains two main directories: **`src/`** and **`backend/`**.

### Frontend (`src/`):
The `frontend/` folder contains the React-based web application, which includes the following key directories and files:
- **`assets/`**: Contains static assets like images, icons, and fonts.
- **`components/`**: Reusable React components such as Navbar, Resort Info, etc.
- **`routes/`**: React components representing the pages/routes of the app (e.g., `Home`, `Weather`, `Resorts`).
- **`styles/`**: CSS files for global styles and component-specific styles.
- **`utils/`**: Utility functions like authentication checks and helpers.
- **`App.tsx`**: Main component that defines the routing structure for the app.
- **`index.css`**: Global styles applied to the entire application.
- **`app.css`**: Component-specific styles for the main layout container.
- **`main.tsx`**: The entry point where the app is rendered to the DOM.
- **`vite-env.d.ts`**: TypeScript declaration file for Vite client-side types.

### Backend (`backend/`):
The `backend/` folder contains the server-side component of the project, built with Go. It includes the following features:
- **Authentication**: JWT-based user authentication.
- **Resort Data Management**: CRUD operations for resort data stored in a SQL database.
- **User Feedback**: API to handle user feedback, including a rating system for resorts.
- **User Bookmarks**: API to manage user bookmarks for resorts.
- **Database Management**: Scripts to create, populate, wipe, and drop tables in the database.

### Project Root:
The root folder contains common configuration files and other assets:
- **`README.md`**: This file providing an overview of the entire project.
- **`package.json`**: Contains dependencies and scripts for the frontend.
- **`go.mod`**: Go module file for managing backend dependencies.
- **`go.sum`**: Go checksum file to ensure the integrity of backend dependencies.

## Setup

### Prerequisites

- **Frontend**:
  - Node.js (version 18 or higher)
  - npm (Node Package Manager)

- **Backend**:
  - Go 1.23.2 or higher
  - Azure SQL Database (for storing resort and user data)

### Installation

1. Clone the repository:
    ```bash
    git clone https://github.com/your-username/ski-safe.git
    cd ski-safe
    ```

2. **Frontend Setup**:
    - Navigate to the `src/` directory:
      ```bash
      cd frontend
      ```
    - Install dependencies:
      ```bash
      npm install
      ```
    - Start the frontend development server:
      ```bash
      npm run dev
      ```
    - Open your browser and visit `http://localhost:3000`.

3. **Backend Setup**:
    - Navigate to the `backend/` directory:
      ```bash
      cd backend
      ```
    - Install Go dependencies:
      ```bash
      go mod tidy
      ```
    - Set up your Azure SQL Database and configure the connection in the `main.go` file.
    - Run the backend server:
      ```bash
      go run main.go
      ```
    - The backend will be available at `http://localhost:8080`.

### Running Both Servers

To run both the frontend and backend servers simultaneously:
- Open two terminal windows or tabs.
- In the first, run the backend:
    ```bash
    cd ski-safe/backend
    go run main.go
    ```
- In the second, run the frontend:
    ```bash
    cd ski-safe/frontend
    npm run dev
    ```


## Acknowledgments

- Special thanks to contributors who have helped improve the project.
- This project integrates with the **National Oceanic and Atmospheric Administration (NOAA)** for real-time weather and snow data.

