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
    USER_EMAIL=vitalispaul48@gmail.com
    MAIL_PASSWORD=fzhbmgqekcjxvhib
```

6. Run the application using `npm run dev`

RUNNING TESTS
We use jest for running our tests. To run our tests, run the following command
`npm run test`

# API DOCUMENTATION

The Applications API documentation has been done using SwaggerDocs. To access the documentation, run the application and access the endpoint `/api/docs`
