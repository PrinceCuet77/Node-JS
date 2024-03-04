import { useEffect, useState, useMemo } from 'react'
import { io } from 'socket.io-client'
import { Container, TextField, Typography, Button, Stack } from '@mui/material'

import './App.css'

function App() {
  const [message, setMessage] = useState('')
  const [messages, setMessages] = useState([])
  const [roomId, setRoomId] = useState('')
  const [socketId, setSocketId] = useState('')
  const [roomName, setRoomName] = useState('')

  const socket = useMemo(() => io('http://localhost:3000'), [])

  useEffect(() => {
    socket.on('connect', () => {
      setSocketId(socket.id)
      console.log('Connected ', socket.id)
    })

    socket.on('received-message', (message) => {
      setMessages((prevMessages) => [...prevMessages, message])
    })

    return () => {
      socket.disconnect()
    }
  }, [])

  const submitHandler = (event) => {
    event.preventDefault()

    socket.emit('message', { message, roomId }) // Sending the message to the server

    setMessage('')
    setRoomId('')
  }

  const joinSubmitHandler = (event) => {
    event.preventDefault()

    socket.emit('join-room', roomName) // Sending the message to the server

    setRoomName('')
  }

  return (
    <Container maxWidth='sm'>
      <Typography variant='h6' component='div' gutterBottom>
        {socketId}
      </Typography>

      <form onSubmit={joinSubmitHandler}>
        <TextField
          value={roomName}
          onChange={(event) => setRoomName(event.target.value)}
          id='roomName'
          label='Room Name'
          variant='outlined'
        />
        <Button type='submit' variant='contained' color='primary'>
          Join
        </Button>
      </form>

      <form onSubmit={submitHandler}>
        <TextField
          value={message}
          onChange={(event) => setMessage(event.target.value)}
          id='message'
          label='Message'
          variant='outlined'
        />
        <TextField
          value={roomId}
          onChange={(event) => setRoomId(event.target.value)}
          id='roomId'
          label='Room Id'
          variant='outlined'
        />
        <Button type='submit' variant='contained' color='primary'>
          Send
        </Button>
      </form>

      <Stack>
        {messages.map((message, index) => (
          <Typography
            key={index}
            variant='h6'
            component='div'
            color='text.secondary'
          >
            {message}
          </Typography>
        ))}
      </Stack>
    </Container>
  )
}

export default App
