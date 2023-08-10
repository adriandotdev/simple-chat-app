const express = require('express');
const app = express();
const http = require('http');
const cors = require('cors');
const { Server } = require('socket.io')

app.use(cors({ origin: '*' }));
app.use(express.urlencoded({ extended: false }));
app.use(express.json());

const server = http.createServer(app);

const io = new Server(server, {
    cors: {
        origin: "*"
    }
})

let messages = [];
let registeredUsers = [{
    username: 'andrea',
    password: 'mypassword',
    name: 'Andrea Brillantes',
    roomId: 'andrea',
    isOnline: false,
    notifications: {
        contents: [],
        count: 0
    }
},
{
    username: 'juanluna',
    password: 'mypassword',
    name: 'Juan Luna',
    roomId: 'andrea',
    isOnline: false,
    notifications: {
        contents: [],
        count: 0
    }
},
{
    username: 'jessa',
    password: 'mypassword',
    name: 'Jessa Ko',
    roomId: 'jessa',
    isOnline: false,
    notifications: {
        contents: [],
        count: 0
    }
}];

app.post('/api/v1/login', (req, res) => {

    const { username, password } = req.body;

    const found = registeredUsers.find(user => user.username === username);

    if (!found)
        return res.sendStatus(404);

    if (password !== found.password)
        return res.sendStatus(404);

    return res.status(200).json({ user: found, registeredUsers });
});

app.get('/api/v1/messages', (req, res) => {

    return res.status(200).json(messages);
});

app.delete('/api/v1/messages/:id', (req, res) => {

    const { id } = req.params;

    messages = messages.filter(message => message.id !== id)

    return res.status(200).json(messages);
});

app.put('/api/v1/messages', (req, res) => {

    const { id, messageToUpdate } = req.body;

    messages = messages.map(message => {

        if (message.id === id) {
            return {
                ...message,
                message: messageToUpdate
            }
        }

        return message;
    });

    return res.status(200).json(messages);
});

app.post('/api/v1/notifications/:username', (req, res) => {

    const { username } = req.params;

    const user = registeredUsers.find(user => user.username === username);

    return res.status(200).json(user.notifications);
});

app.post('/api/v1/view/notification/:username', (req, res) => {

    const { username } = req.params;

    let updatedNotifs = {};
    registeredUsers = registeredUsers.map(user => {

        if (user.username === username) {

            updatedNotifs = {
                ...user, notifications: {
                    contents: user.notifications.contents,
                    count: 0
                }
            }
            return updatedNotifs;
        }
        return user;
    })

    return res.json({ notifications: updatedNotifs.notifications });
});

app.post('/logout', (req, res) => {

    const { username } = req.body;

    registeredUsers = registeredUsers.map(user => {

        if (user.username === username)
            return { ...user, isOnline: false };
        return { ...user };
    });

    return res.status(200).json({ message: 'Logged out!' });
})

// IO Connection
io.on("connection", (socket) => {

    socket.on("join_room", (data) => {

        registeredUsers = registeredUsers.map(user => {

            if (user.username === data.username)
                return { id: socket.id, ...data, isOnline: true };
            return user;
        })

        socket.broadcast.emit('new_online_user', registeredUsers)
        socket.join(data.username);
    });

    socket.on("send_message", (data) => {

        const userToNotify = registeredUsers.find(user => user.username === data.currentUserInChat.username);

        messages.push(data.message)

        if (data.currentUserInChat.username !== data.message.username) {
            userToNotify.notifications.contents.unshift(`${data.loggedInUser.name} sent you a message.`);
            userToNotify.notifications.count = 1;

            registeredUsers = registeredUsers.map(user => {

                if (user.username === userToNotify.username)
                    return userToNotify;

                return user;
            });
        }

        socket.to(data.currentUserInChat.username).emit('receive', { data, messages, registeredUsers, notifications: userToNotify.notifications });
    });

    socket.on('delete_message', (data) => {

        const userToNotify = registeredUsers.find(user => user.username === data.currentUserInChat.username);

        if (data.currentUserInChat.username !== data.loggedInUser.username) {
            userToNotify.notifications.contents.unshift(`${data.loggedInUser.name} deletes a message.`);
            userToNotify.notifications.count = 1;

            registeredUsers = registeredUsers.map(user => {

                if (user.username === userToNotify.username)
                    return userToNotify;

                return user;
            });
        }

        socket.to(data.currentUserInChat.username).emit('receive', { data, messages, registeredUsers, notifications: userToNotify.notifications });
    });

    socket.on('update_message', (data) => {

        const userToNotify = registeredUsers.find(user => user.username === data.currentUserInChat.username);

        socket.to(data.currentUserInChat.username).emit('receive', { data, messages, registeredUsers, notifications: userToNotify.notifications });
    });

    socket.on("disconnect", () => {

        // registeredUsers = registeredUsers.map(user => {

        //     if (user.id === socket.id)
        //         return { id: socket.id, ...user, isOnline: false };
        //     return { ...user };
        // })
        socket.broadcast.emit('new_online_user', registeredUsers)
    })
});

server.listen(3001, () => {
    console.log("SERVER RUNNING");
})