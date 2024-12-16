# SkiSafe Frontend

SkiSafe Frontend is the client-side component of the SkiSafe project, designed to provide real-time weather updates, snow conditions, resort information, and safety tips for skiers. It leverages React, TypeScript, and Vite for a smooth user experience, with data from NOAA integrated for weather predictions and snow forecasts.

The frontend includes routes for weather updates, resort details, user authentication, and feedback, all structured in a modern web application format.

## Features

- **Real-Time Weather Updates**: Displays the latest weather data, including snow conditions, temperature, and precipitation forecasts.
- **Resort Information**: Shows detailed information about ski resorts, including trail maps and conditions.
- **User Authentication**: Allows users to sign up, sign in, and manage their accounts securely.
- **Feedback System**: Enables users to provide feedback on resorts.
- **Responsive Design**: Optimized for various screen sizes and devices.

## Folder Structure

The `src` folder contains the following directories and files:

- **`assets/`**: Contains static assets like images, icons, and fonts.
- **`components/`**: Contains reusable React components such as the Navbar, Resort Info, and more.
- **`routes/`**: Contains React components that represent the various pages/routes of the app (e.g., `Home`, `Weather`, `Resorts`, etc.).
- **`styles/`**: Contains CSS files for global styles and specific component styles.
- **`utils/`**: Contains utility functions, such as authentication checks and helper functions.
- **`App.tsx`**: The main component that defines the routing structure for the app.
- **`index.css`**: Global CSS styles applied across the entire application.
- **`app.css`**: Component-specific styles for the main layout container.
- **`main.tsx`**: The entry point of the application, where the app is rendered to the DOM.
- **`vite-env.d.ts`**: TypeScript declaration file for Vite client-side types.

## Setup

### Prerequisites

- Node.js (version 18 or higher)
- npm (Node Package Manager)

### Installation

1. Clone the repository:
    ```bash
    git clone https://github.com/your-username/ski-safe.git
    cd ski-safe/frontend
    ```

2. Install the required dependencies:
    ```bash
    npm install
    ```

3. Start the development server:
    ```bash
    npm run dev
    ```

4. Open your browser and go to `http://localhost:3000` to view the app.

## Routes

The frontend application supports the following routes:

- `/`: Home page with an overview of SkiSafe features.
- `/weather`: Displays real-time weather updates and snow forecasts.
- `/resorts`: Lists available ski resorts with detailed information.
- `/feedback`: A page to submit feedback about the app.
- `/signin`: A page to sign in to your account.
- `/signup`: A page to create a new account.
- `/account`: User profile and account management (accessible only when authenticated).
- `/resortInfo`: Displays detailed information about selected resorts.

## Authentication

The frontend includes a simple authentication system. Users can sign up and sign in to access personalized features, including the ability to manage their account and submit feedback. The `/account` route is only accessible to authenticated users.

## Styling

- **Global Styles**: Defined in `index.css` and applied across the application.
- **Component Styles**: Each component has its own styling, particularly the main container styled in `app.css`.
- **Responsive Design**: The layout adjusts based on the screen size to ensure a great experience on both desktop and mobile devices.

## Development

The project is built using **React** for the UI, **TypeScript** for type safety, and **Vite** for a fast development environment. The app supports both light and dark color schemes, and it includes responsive design for mobile and desktop views.

## Acknowledgments

- The project uses React, TypeScript, Vite, and other modern web technologies.
- Special thanks to all contributors who have helped improve the project.
