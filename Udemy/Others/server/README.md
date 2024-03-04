- [Server Project Setup](#server-project-setup)
- [Server Side Coding](#server-side-coding)
  - [Create A Server](#create-a-server)
  - [Integrate `Socket.io`](#integrate-socketio)
  - [Enable `cors` If Needed](#enable-cors-if-needed)
  - [`emit` laws:](#emit-laws)
  - [Data or Message Exchange](#data-or-message-exchange)
  - [One-To-One Communication](#one-to-one-communication)
  - [Join a room \& connect to the clients](#join-a-room--connect-to-the-clients)

# Server Project Setup

- Installed packages of `server/`:

```cmd
cd server/
npm init -y
npm i express socket.io
npm i cors
npm i --save-dev nodemon
```

- Run the server

```cmd
npm run dev
```

- Some Modification in `server/package.json` file:

```js
{
  "main": "app.js", // 'app.js' file is the root file
  "type": "module", // To support ES6 import method
  "scripts": {
    "dev": "nodemon app.js", // To watch the server code continuously
    "start": "node app.js"
  }
}
```

# Server Side Coding

## Create A Server

- Create a server on `3000` port using `express` framework

```js
import express from 'express'

const PORT = 3000

const app = express()

// Make a route -> http://localhost:3000
app.get('/', (req, res) => {
  res.send('Hello world')
})

app.listen(PORT, () => [console.log(`Server is running on port ${PORT}...`)])
```

## Integrate `Socket.io`

- In Server side:

```js
// Other codes are removed for avoid repetition...

import { Server } from 'socket.io'
import { createServer } from 'http'

const app = express()
const server = createServer(app)
const io = new Server(server)

io.on('connection', (socket) => {
  console.log('User connected ' + socket.id)
})

server.listen(PORT, () => [console.log(`Server is running on port ${PORT}...`)])
```

- In client Side:

```js
import { io } from 'socket.io-client'

// While use the following code, a new user will be added
const socket = io('http://localhost:3000')
```

## Enable `cors` If Needed

- In Server side:

```js
import cors from 'cors'

const io = new Server(server, {
  cors: {
    origin: 'http://localhost:5173/',
    method: ['GET', 'POST'],
    credentials: true,
  },
})

app.use(cors()) // Middleware
```

## `emit` laws:

- To all the users

```js
socket.emit('welcome', 'Welsome to the server')
```

- To all the users except itself

```js
socket.broadcast.emit('welcome', `${socket.id} has joined to the server`)
```

## Data or Message Exchange

- Client sends data to the server in `App.jsx`

```js
socket.emit('message', message)
```

- Server receives data from the client & send to all the clients

```js
socket.on('message', (data) => {
  console.log(data + ' ' + socket.id)

  // io.emit('received-message', data) // All the users
  socket.broadcast.emit('received-message', data)
})
```

- But it's useless to send the data where the server received from
- So, customize like:

```js
socket.on('message', (data) => {
  console.log(data + ' ' + socket.id)

  socket.broadcast.emit('received-message', data)
})
```

- Now, the other clients will receive the message

```js
socket.on('received-message', (data) => {
  console.log('Received -> ' + data + ' from ' + socket.id)
})
```

## One-To-One Communication

- Client should send a `message` along with the `roomId`
- `roomId` nothing but which client should be received that `message`

```js
socket.emit('message', { message, roomId })
```

- In Server side, receive everything and send the `message` to that specific `roomId`

```js
socket.on('message', ({ message, roomId }) => {
  socket.to(roomId).emit('received-message', message)
})
```

## Join a room & connect to the clients

- Client should send `roomName`

```js
socket.emit('join-room', roomName)
```

- In Server side, receive `roomName` and join the room

```js
socket.on('join-room', (roomName) => {
  socket.join(roomName)
  console.log('User joined room ' + roomName)
})
```
