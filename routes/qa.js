const express = require('express');
qaRoute = express.Router();

qaRoute.get('/questions/*', (req, res) => {
  console.log(req.url, req.query);
  //I: req, needs a product_id, MAYBE count (default 5), MAYBE page (default 1)

  //O: res.send(obj)
  /*
  {
    "product_id": [id],
  "results": [{      //5 default
        "question_id": [question.id],
        "question_body": [question.body],
        "question_date": [question.date_written],
        "asker_name": [question.asker_name],
        "question_helpfulness": [question.helpfulness],
        "reported": [question.reported],
        "answers": {      //all default
          [answer.id]: {
            "id": [answer.id],
            "body": "We are selling it here without any markup from the middleman!",
            "date": "2018-08-18T00:00:00.000Z",
            "answerer_name": "Seller",
            "helpfulness": 4,
            "photos": [
              [url],
              [url],
              [url],
              [url]
            ]}, ... }}, ... ]}
  */

})

qaRoute.post('/', (req, res) => {
  console.log(req.url, req.params, req.body);
})


module.exports = qaRoute;


/*
NOTES::::
url breakdown is as follows::
  /[uri]/[valueOfSomeKind]?[query(key)]=[query(val)]&[query(key)]=[query(val)]
          ^ lines up to a parameter we define as follows
  route.get('/asdf/:question_id', (req, res) => {
    console.log(req.params) === {question_id: '[valueOfSomeKind]'}
  });

*/