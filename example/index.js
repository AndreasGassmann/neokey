const neoKey = require('../src')
const express = require('express')
const app = express()

app.use(neoKey)

app.get('/', (req, res) => {
  res.send('Hello World!')
})

app.listen(3000)
