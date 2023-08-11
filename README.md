# Chat App

![Screenshot 2023-08-11 at 23-40-01 Vite React](https://github.com/adriandotdev/simple-chat-app/assets/63532775/1eca889b-b04b-431a-8ad3-b1a18382dd6b)

This chat app consists of login functionality, composing a message, online status, chat history, and notifications.

# Technologies Used
- ReactJS
- NodeJS
- ExpressJS
- Socket.IO
- Bootstrap

# What I Learned?
- How Socket.IO works such as events and emiiters wherein it has a functionality to update in real-time.
- I also learned how to integrate it in Front-End wherein the frontend can listen to a request from the server, and vice-versa.

# How to Test this Project?

1. Clone the Repository.
```
git clone <link of the repository>
```

2. Once you finished cloning the repository, you need to go to the folder name `chat-app` under the `client` folder.
```
cd client/chat-app
```

3. After that, install all the packages needed for the client side.
```
npm install
```

4. After that, navigate to the server folder, and install the packages as well.
```
npm install
```

5. Once you finished installing the packages for the client and server folder, run them in separated terminal.
  - Open a new terminal, and navigate to the `client/chat-app` folder, then run this command
    ```
    npm run dev
    ```
  - Open another terminal, and navigate to the `server` folder, then run this command
    ```
    npm run start
    ```
    
# How to Test?
Since the app doesn't support sign up functionality yet, here's the list of users, and their `username` and `password`.
```
let registeredUsers = [
    {
        username: 'katara',
        password: 'mypassword',
        ... OTHER FIELDS
    },
    {
        username: 'avatar',
        password: 'mypassword',
        ... OTHER FIELDS
    },
    {
        username: 'fireprince',
        password: 'mypassword',
        ... OTHER FIELDS
    },
    {
        username: 'boomerang',
        password: 'mypassword',
        ... OTHER FIELDS
    },
    {
        username: 'earthbending',
        password: 'mypassword',
        ... OTHER FIELDS
    },
    {
        username: 'kyoshi',
        password: 'mypassword',
        ... OTHER FIELDS
    }
];
```

# Thank You
Developed by Adrian Nads Marcelo