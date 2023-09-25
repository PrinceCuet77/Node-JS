const http = require('http')
const fs = require('fs')

const rqListener = (req, res) => {
  // console.log(req.url, req.method, req.headers)

  if (req.url === '/') {
    res.write('<html>')
    res.write('<head><title>Enter Message</title></head>')
    res.write(
      '<body><form method="POST" action="/message"><input type="text" name="message"><button>Send</button></form></body>'
    )
    res.write('</html>')
    return res.end()
  }

  if (req.url === '/message' && req.method === 'POST') {
    const body = []

    // Data event
    req.on('data', (chunk) => {
      console.log(chunk)
      body.push(chunk)
    })

    return req.on('end', () => {
      // Create a new buffer and add all the chunks
      const parsedBody = Buffer.concat(body).toString() // message=Hello
      console.log(parsedBody)
      const message = parsedBody.split('=')[1] // Hello
      fs.writeFile('message.txt', message, (err) => {
        res.statusCode = 302 // Redirection code
        res.setHeader('Location', '/') // Redirect
        return res.end()
      })
    })
  }

  res.setHeader('Context-Type', 'text/html')
  res.write('<html>')
  res.write('<head><title>My First Page</title></head>')
  res.write('<body><h1>Hello from my Node.js Server!</h1></body>')
  res.write('</html>')
  res.end()
}

const server = http.createServer(rqListener)

server.listen(3000)
