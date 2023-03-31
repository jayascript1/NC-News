# Northcoders News API

1. In order to successfully connect to the two databases locally, add .env.test file and a .env.development files in the root of the project directory, a template example has been provided.

2. Add your local database credentials to the files, replacing the previous placeholder values, the database names can be found in the /db/setup/.sql file.

3. Make sure .env files are ignored in the .gitignore file

4. Install dependencies by running npm install

# Northcoders News API

Summary

Northcoders News API is a RESTful API built with Node.js and PostgreSQL that serves up news articles and allows users to interact with them by commenting and voting.

Getting started

Prerequisites

Node.js v14.x or later
PostgreSQL v12.x or later

Installation

Clone the repository:
git clone https://github.com/jayascript1/northcoders-news-api.git

Install dependencies:

npm install

Set up the databases:

npm run setup-dbs
This will create two databases named nc_news_test and nc_news.

Seed the databases:
npm run seed
This will populate the databases with test data.

Create .env files:
Create two .env files, .env.test and .env.development, in the root directory of the project. Use the .env.example file as a template.

Start the server:
npm start
This will start the server on port 9090.

Testing
To run the tests, run:
npm test
This will run the test suite using Supertest.

Available endpoints
Here are the available endpoints:

GET /api/topics: Returns an array of all topics
GET /api/articles: Returns an array of all articles
GET /api/articles/:article_id: Returns the article with the specified ID
GET /api/articles/:article_id/comments: Returns an array of all comments for the article with the specified ID
POST /api/articles/:article_id/comments: Adds a comment to the article with the specified ID
PATCH /api/articles/:article_id: Updates the votes of the article with the specified ID
DELETE /api/comments/:comment_id: Deletes the comment with the specified ID
GET /api/users/: Returns an array of all the users

Technologies used
Node.js
Express
PostgreSQL
Supertest

Author
Jeremiah Johnson a.k.a. Jayascript1

Acknowledgements
Northcoders

License
This project is licensed under the MIT License.