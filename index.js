const express = require('express')
const app = express()
const port = 3000

const productsRoute = require('./routes/products.js')
const qaRoute = require('./routes/qa.js')
const reviewsRoute = require('./routes/reviews.js')

// middleware
app.use(express.json());

// routes
app.use('/products', productsRoute)
app.use('/qa', qaRoute)
app.use('/reviews', reviewsRoute)

app.listen(process.env.PORT || port, () => {
  console.log(`Example app listening on port ${port}`)
})