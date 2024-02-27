# boomers-api

SETTING UP PROJECT

1. Clone the repository
2. Ensure you have node installed
3. Checkout to the branch: `develop`
4. Install all dependencies using npm install
5. Ensure you create a .env file and fill in the following values

```
    PORT=${PORT YOU LIKE}
    ACCESS_TOKEN_SECRET=${ANY SECRET KEY}
    MONGO_DB_USER=${YOUR MONGO DB USERNAME}
    MONGO_DB_PASSWORD=${YOUR MONGO DB DATABASE ACCESS PASSWORD}
    NODE_ENV=local
```

6. Run the application using npm run dev

RUNNING TESTS
We use jest for running our tests. To run our tests, run the following command
`npm run test`
