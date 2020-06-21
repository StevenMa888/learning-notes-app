# Learning Notes App

Learning Notes App is a neat web app to write and manage your notes.

## Running the app

Run `npm install` to install frontend depedencies.

Go to /server, run `npm install` to install backend depedencies.

Run `mongod` to start MongoDB, create a database and tables based on /server/models.

Go to /server, run `nodemon` to start a backend node dev server at `http://localhost:1234/`. The backend server will automatically reload if you change any of the backend source files.

Run `npm start` to launch a frontend app running on webpack dev server. Navigate to `http://localhost:4200/`. The frontend app will automatically reload if you change any of the frontend source files.
