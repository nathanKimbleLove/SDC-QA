const express = require('express');
const controller = require('../controllers.js');
qaRoute = express.Router();

qaRoute.get('/questions/:question_id/answers*', (req, res) => {
  console.log('youre in the answers thing', req.params)
  controller.selectA(res, req.params);
})

qaRoute.get('/questions/*', (req, res) => {
  console.log('youre in the questions thing', req.query)
  req.query.table = 'questions';
  controller.selectQ(res, req.query);
})

qaRoute.post('/questions/:question_id/answers', (req, res) => {
  controller.insertA(res, req.params, req.body);
})

qaRoute.post('/questions/', (req, res) => {
  controller.insertQ(res, req.body);
})

qaRoute.put('/questions/:question_id/helpful', (req, res) => {
  let putArr = req.url.split('/');
  putArr[3] = 'helpful = helpful + 1';
  controller.update(res, putArr);
})

qaRoute.put('/questions/:question_id/report', (req, res) => {
  let putArr = req.url.split('/');
  putArr[3] = 'reported = true';
  controller.update(res, putArr);
})

qaRoute.put('/answers/:answer_id/helpful', (req, res) => {
  let putArr = req.url.split('/');
  putArr[3] = 'helpful = helpful + 1';
  controller.update(res, putArr);
})

qaRoute.put('/answers/:answer_id/report', (req, res) => {
  let putArr = req.url.split('/');
  putArr[3] = 'reported = true';
  controller.update(res, putArr);
})

module.exports = qaRoute;