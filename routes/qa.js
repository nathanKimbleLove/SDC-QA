const express = require('express');
const controller = require('../controllers.js');
qaRoute = express.Router();

qaRoute.get('/questions/*', (req, res) => {
  req.query.table = 'questions';
  controller.selectQ(res, req.query);
})

qaRoute.post('/questions/', (req, res) => {
  console.log(req.url, req.params, req.body);
  controller.insertQ(res, req.body);
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