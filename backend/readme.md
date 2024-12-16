# SkiSafe Backend

SkiSafe is a web application designed to provide real-time weather updates, detailed trail maps, skiing conditions, safety tips, and promote responsible skiing practices. The backend of SkiSafe is built using Go and integrates with Azure SQL to manage users, feedback, resorts, and bookmarks. The backend also provides JWT-based authentication for user login and session management.

## Features

- **User Authentication**: Create, log in, and log out users with JWT-based authentication.
- **User Bookmarks**: Allow users to bookmark resorts for easy access.
- **User Feedback**: Users can leave feedback for resorts, which is stored and can be viewed by others.
- **Resort Data**: Resorts data management with the ability to retrieve detailed resort information.
- **Database**: Uses Microsoft SQL Server (Azure SQL) for persistent data storage.

## Setup

### Prerequisites

- Go 1.23.2 or higher
- Azure SQL Database
- Dependencies managed via Go modules (`go.mod` and `go.sum`)

### Installation

1. Clone the repository:
    ```bash
    git clone https://github.com/your-username/ski-safe.git
    cd ski-safe
    ```

2. Install the required Go modules:
    ```bash
    go mod tidy
    ```

3. Set up your Azure SQL Database. Ensure the following tables are created:
    - Users
    - Resorts
    - Feedback
    - UserBookmarkedResorts
    - UserVisitedResorts

    You can use the SQL commands in the project files to create these tables.

4. Modify the database connection settings in your `main.go` file, and replace the connection string with your Azure SQL Database credentials.

5. Run the application:
    ```bash
    go run main.go
    ```

    The backend server will be available at `http://localhost:8080`.

## Endpoints

### User Management

- **POST `/users/create`**: Create a new user.
    - **Request body**:
        ```json
        {
            "email": "user@example.com",
            "password": "yourpassword",
            "fullname": "First Last",
            "zipcode": "12345"
        }
        ```
    - **Response**: 200 OK with user details (password excluded).

- **POST `/users/login`**: Log in a user and receive a JWT token.
    - **Request body**:
        ```json
        {
            "email": "user@example.com",
            "password": "yourpassword"
        }
        ```
    - **Response**: 200 OK with JWT token.

- **POST `/users/logout`**: Log out a user (client side management of token required).

### Resort Bookmarks

- **POST `/users/togglebookmark`**: Add or remove a bookmark for a resort.
    - **Request body**:
        ```json
        {
            "resortID": 1
        }
        ```
    - **Response**: 200 OK

- **GET `/users/loadbookmarks`**: Get all bookmarks for the logged-in user.
    - **Response**: 200 OK with list of bookmarked resorts.

### Feedback

- **POST `/feedback/add`**: Add feedback for a resort.
    - **Request body**:
        ```json
        {
            "first": "John",
            "feedback": "Great resort!",
            "rating": 5
        }
        ```
    - **Response**: 200 OK with feedback details.

- **GET `/feedback/list`**: Get a list of feedback entries, optionally limited.
    - **Request parameters**: `limit` (optional)
    - **Response**: 200 OK with feedback list.

### Resort Data

- **GET `/resorts/list`**: Get a list of all resorts.
- **GET `/resorts/get`**: Get detailed information for a specific resort by ID.

## Database Schema

The backend requires the following database tables:

1. **Users**:
    - ID: INT (Primary Key)
    - Email: VARCHAR(255) (Unique)
    - Password: VARCHAR(255)
    - First: VARCHAR(100)
    - Last: VARCHAR(100)
    - Zipcode: VARCHAR(20)

2. **UserBookmarkedResorts**:
    - UserID_FK: INT (Foreign Key to Users)
    - ResortID_FK: INT (Foreign Key to Resorts)

3. **UserVisitedResorts**:
    - ID: INT (Primary Key)
    - UserID_FK: INT (Foreign Key to Users)
    - ResortID_FK: INT (Foreign Key to Resorts)
    - VisitedDate: DATE

4. **Feedback**:
    - ID: INT (Primary Key)
    - First: VARCHAR(100)
    - Feedback: TEXT
    - Rating: INT

5. **Resorts**:
    - ID: INT (Primary Key)
    - Name: VARCHAR(255)
    - Address: TEXT
    - Zipcode: VARCHAR(20)
    - Latitude: FLOAT
    - Longitude: FLOAT
    - HomeLink: VARCHAR(255)
    - CameraLink: VARCHAR(255)
    - ImageLink: VARCHAR(255)

## JWT Authentication

The backend uses JWT (JSON Web Tokens) to authenticate users. Upon successful login, a token is generated with a 6-hour expiration. The token should be included in the `Authorization` header as a bearer token for requests that require authentication.

## Error Handling

All endpoints return appropriate HTTP status codes:
- **200 OK**: Successful request.
- **400 Bad Request**: Invalid request or missing parameters.
- **401 Unauthorized**: Missing or invalid authentication token.
- **404 Not Found**: Resource not found.
- **409 Conflict**: Conflict (e.g., user already exists).
- **500 Internal Server Error**: Server error.

## Acknowledgments

- The project uses the Go programming language and libraries such as `github.com/golang-jwt/jwt`, `github.com/microsoft/go-mssqldb`, and `github.com/rs/cors`.
- Special thanks to all contributors who have helped improve the project.