# EduApp backend
This is the backend for EduApp. We are using the MERNF stack (MongoDB + Express + React + Node + Firebase) for this project.

## Start the server
- Pull and run `npm install`.
- Create the .env configuration. See below.
- Make sure mongodb is running.
- Run `npm run start:dev` to to start the server in dev mode.

You can use PostMan to send a request to the server. Assuming you're on localhost, use GET `localhost:8000` and send the request. You should see following response:

```javascript
{
    "message": "EduApp backend works!"
}
```

## Configuration file
You need to create a .env configuration file to set your database connection settings. Create the `.env` file at root level and add the following variables for local connection...
```bash
    DB_HOST=YOUR_HOST
    DB_PORT=YOUR_SERVER_PORT // usually 27017 for mongo
    DB_NAME=YOUR_MONG_DB_NAME
```
to connect to monogoDB...
```bash
    DB_HOST=YOUR_MONGODB_HOST
    DB_USER=USER_WITH_ACCESS
    DB_PASS=USER_PASSWORD
```

## Tools
Some of the tools used for this project.
- [Markdown editor](https://pandao.github.io/editor.md/en.html)
