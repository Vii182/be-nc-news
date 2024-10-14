# Northcoders News API


After cloning the repository, you will need to set up your environment variables to connect to the required databases locally.
Since .env.* files are ignored (due to .gitignore), they are not included in the repository. 
Follow the instructions below to create and configure these files:

1. Install dotenv if necessary.

2. Create the following .env files:

.env.development
.env.test

3. include the database names inside these files:

for .env.development --- PGDATABASE=nc_news
for .env.test --- PGDATABASE=nc_news_test

--- 

This portfolio project was created as part of a Digital Skills Bootcamp in Software Engineering provided by [Northcoders](https://northcoders.com/)
