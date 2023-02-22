const express = require('express');
const controller = require('../controllers.js');
qaRoute = express.Router();

qaRoute.get('/questions/:question_id/answers*', (req, res) => {
  let obj = {...req.params, ...req.query}
  controller.selectA(res, obj);
})

qaRoute.get('/questions*', (req, res) => {
  req.query.table = 'questions';
  controller.selectQ(res, req.query);
})

qaRoute.post('/questions/:question_id/answers', (req, res) => {
  if (typeof req.body.body === 'string' && typeof req.body.name === 'string' && typeof req.body.email === 'string') {
    controller.insertA(res, req.params, req.body);
  } else {
    res.sendStatus(400);
  }
})

qaRoute.post('/questions/', (req, res) => {
  if (typeof req.body.body === 'string' && typeof req.body.name === 'string' && typeof req.body.email === 'string') {
    controller.insertQ(res, req.body);
  } else {
    res.sendStatus(400);
  }
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
