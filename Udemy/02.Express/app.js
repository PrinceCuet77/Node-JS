const express = require('express') // Exports a function
const bodyParser = require('body-parser')

const adminRouters = require('./routes/admin')
const shopRouters = require('./routes/shop')

const app = express() // Execute that function

app.use(bodyParser.urlencoded({ extended: false }))

app.use(shopRouters)
app.use(adminRouters)

app.use((req, res, next) => {
  res.status(404).send('<h1>Page not found.</h1>')
})

app.listen(3000)
