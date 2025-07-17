# Voting Feature System

This is a FastAPI-based application that allows users to propose features and vote on them. It includes user authentication, rate limiting, and various endpoints for managing features and votes.

## Features

-   **User Authentication:** Register and login using JWT.
-   **Feature Management:** Create, view, and list features.
-   **Voting System:** Cast and remove votes for features.
-   **Sorting and Pagination:** Sort features by votes or date, with pagination.
-   **Trending Features:** View a list of trending features based on a simple algorithm.
-   **Rate Limiting:** Basic protection against brute-force attacks.

## API Endpoints

### Authentication

-   `POST /api/auth/register`: Register a new user.
-   `POST /api/auth/login`: Login and receive a JWT token.

### Features

-   `GET /api/features`: Get a list of features.
    -   Query Parameters:
        -   `sort_by`: `votes` (default) or `date`.
        -   `page`: Page number for pagination (default: 1).
        -   `limit`: Number of items per page (default: 10).
-   `POST /api/features`: Create a new feature (requires authentication).
-   `GET /api/features/{feature_id}`: Get a specific feature by its ID.
-   `GET /api/trending`: Get a list of trending features.

### Votes

-   `POST /api/votes`: Cast a vote for a feature (requires authentication).
-   `DELETE /api/votes/{feature_id}`: Remove a vote for a feature (requires authentication).

## Getting Started

### Running with Docker

1.  **Build and run the containers:**
    ```bash
    docker-compose up -d --build
    ```

2.  The application will be available at `http://127.0.0.1:8000`.


### Prerequisites

-   Python 3.8+
-   PostgreSQL

### Installation

1.  **Clone the repository:**
    ```bash
    git clone https://github.com/your-username/voting-feature-system.git
    cd voting-feature-system
    ```

2.  **Create and activate a virtual environment:**
    ```bash
    python -m venv env
    source env/bin/activate
    ```

3.  **Install the dependencies:**
    ```bash
    pip install -r requirements.txt
    ```

4.  **Set up the database:**
    -   Make sure you have PostgreSQL running.
    -   Create a database (e.g., `featuredb`).
    -   Update the `DATABASE_URL` in `config.py` with your database credentials.

5.  **Run the application:**
    ```bash
    uvicorn main:app --reload
    ```

The application will be available at `http://127.0.0.1:8000`.

## Project Structure

-   `main.py`: The main FastAPI application file, containing all the API endpoints.
-   `auth.py`: Handles user authentication, password hashing, and JWT creation.
-   `config.py`: Contains application settings, such as database URL and secret key.
-   `database.py`: Sets up the database connection and session.
-   `models.py`: Defines the SQLAlchemy database models (User, Feature, Vote).
-   `schemas.py`: Defines the Pydantic models for data validation and serialization.
-   `requirements.txt`: A file listing the Python packages required to run the project.

## System Architecture:

<img width="1627" height="841" alt="image" src="https://github.com/user-attachments/assets/12252c42-abab-4a78-b6c8-dd975bf5364c" />

- backend components:
<img width="881" height="543" alt="image" src="https://github.com/user-attachments/assets/fc14ed1a-01a1-49c6-bc89-74b744bcebf3" />


## API data flow representation:

<img width="1070" height="704" alt="image" src="https://github.com/user-attachments/assets/4b091283-20ea-4dd9-9e35-004d2e8b3b6c" />

## User flow sequence diagram:

<img width="1920" height="974" alt="image" src="https://github.com/user-attachments/assets/42c6376b-fe13-4d4a-9cb0-14ded7820a3f" />

