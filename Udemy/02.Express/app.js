const path = require('path')

const express = require('express') // Exports a function
const bodyParser = require('body-parser')

const rootDir = require('./utils/path')

const adminRouters = require('./routes/admin')
const shopRouters = require('./routes/shop')

const app = express() // Execute that function

app.use(bodyParser.urlencoded({ extended: false }))
app.use(express.static(path.join(__dirname, 'public')))

app.use('/admin', adminRouters)
app.use(shopRouters)

app.use((req, res, next) => {
  res.status(404).sendFile(path.join(rootDir, 'views', '404.html'))
})

app.listen(3000)
