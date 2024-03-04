import express from 'express'
import { Server } from 'socket.io'
import { createServer } from 'http'
import cors from 'cors'

const PORT = 3000

const app = express()
const server = createServer(app)
const io = new Server(server, {
  cors: {
    origin: 'http://localhost:5173/',
    method: ['GET', 'POST'],
    credentials: true,
  },
})

io.on('connect', (socket) => {
  console.log('User connected ' + socket.id)

  socket.on('message', ({ message, roomId }) => {
    console.log({ message, roomId })

    // io.emit('received-message', data) // All the users
    // socket.broadcast.emit('received-message', data)
    socket.to(roomId).emit('received-message', message)
  })

  socket.on('join-room', (roomName) => {
    socket.join(roomName)
    console.log('User joined room ' + roomName)
  })

  socket.on('disconnect', () => {
    console.log('User disconnected ' + socket.id)
  })
})

app.use(cors())

// Make a route -> http://localhost:3000
app.get('/', (req, res) => {
  res.send('Hello world')
})

server.listen(PORT, () => [console.log(`Server is running on port ${PORT}...`)])
