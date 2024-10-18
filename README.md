# News Scrapers API

[![Live Demo](https://img.shields.io/badge/Live-Demo-brightgreen)](https://news-scraper-x0q1.onrender.com)

## Summary

This project is a **News Article API**, a RESTful API built with Node.js and Express. 
It provides a platform for users to interact with articles and comments in a structured manner. 
The API supports various endpoints for fetching, creating, updating, and deleting articles, along with managing comments. 
The database is powered by PostgreSQL.

## Features

- **Fetch articles**: Retrieve articles with optional filtering by topics, sorting, and ordering.
- **Fetch users**: Retrieve an array of all users.
- **Manage comments**: Add, update, or delete comments associated with articles.

## Live Demo

You can check a live version of the project [here](https://news-scraper-x0q1.onrender.com).

## Getting Started

To get a copy of this project up and running locally, follow these steps:

### Prerequisites

- **Node.js** (minimum version: 14.x)
- **PostgreSQL** (minimum version: 12.x)

## Cloning the Repository

1. Once you have the repository link, you can clone the repository in the desired directory of your local machine via:

   ```bash
   git clone REPO_URL
   ```

2. Navigate to the project directory:

    ```bash
    cd YOUR_PROJECT_DIRECTORY
    ```

### Installing Dependencies

3. After **cloning the repository** and navigating to the directory, you will need to install the required dependencies:

    ```bash
    npm install
    ```
### Setting Up the Database

4. Create two `.env` files in the root directory of your project:
    - **`.env.development`**: For development environment configurations.
    - **`.env.test`**: For test environment configurations.

5. Add the following environment variables to each file:

**`.env.development`**:
    ```
    PGDATABASE=development_database_name
    ```

**`.env.test`**:
    ```
    PGDATABASE=test_database_name
    ```

### Seeding the Local Database

6. To seed your local database with initial data, run:
    ```bash
    npm run seed
    ```

### Running Tests

7. To run the tests, use:
    ```bash
    npm test
    ```

you can run the test suites individually if you wish.

## Services Used in this project

- [Express](https://expressjs.com/)
- [PostgreSQL](https://www.postgresql.org/)

--- 

This portfolio project was created as part of a Digital Skills Bootcamp in Software Engineering provided by [Northcoders](https://northcoders.com/)
