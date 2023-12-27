const path = require('path')

const express = require('express')
const rootDir = require('./../utils/path')

const router = express.Router() // 'router' object

router.get('/', (req, res, next) => {
  res.sendFile(path.join(rootDir, 'views', 'shop.html'))
})

module.exports = router
