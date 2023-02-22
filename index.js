const express = require('express')
const app = express()
const port = 3000
const path = require('path')

const productsRoute = require('./routes/products.js')
const qaRoute = require('./routes/qa.js')
const reviewsRoute = require('./routes/reviews.js')

// middleware
app.use(express.json());


// routes
app.use('/products', productsRoute)
app.use('/qa', qaRoute)
app.use('/reviews', reviewsRoute)

app.get('/loader*', (req, res) => {
  res.send('loaderio-f56cfcb23bb3ac3b1d20a6b1983f4cea')
})

app.listen(process.env.PORT || port, () => {
  console.log(`Example app listening on port ${port}`)
})
