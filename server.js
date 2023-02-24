const express = require('express')
const app = express()
const port = 3000

const qaRoute = require('./routes/qa.js')

// middleware
app.use(express.json());

// routes
app.use('/qa', qaRoute)

app.get('/loader*', (req, res) => {
  res.send(process.env.LOADER_ID)
})

app.listen(process.env.PORT || port, () => {
  console.log(`Example app listening on port ${port}`)
})
