const models = require('./models.js');

const selectQ = (res, obj) => {
  models.selectQ(obj)
  .then(resp => {
    let [qs, as, phs] = resp;
    qs = qs.rows;
    as = as.rows;
    phs = phs.rows;
    let returnObj = {
      product_id: obj.product_id,
      results: []
    }

    for (let k = 0; k < phs.length; k++) {
      for (let m = 0; m < as.length; m++) {
        if (as[m].id === phs[k].answer_id) {
          as[m].photos ? as[m].photos.push(phs[k].url) : as[m].photos = [phs[k].url];
        }
      }
    }
    for (let i = 0; i < qs.length; i++) {
      let tempQ = {
        question_id: qs[i].id,
        question_body: qs[i].body,
        question_date: new Date(parseInt(qs[i].date_written)).toISOString(),
        asker_name: qs[i].asker_name,
        question_helpfulness: qs[i].helpful,
        reported: qs[i].reported,
        answers: {}
      }
      returnObj.results.push(tempQ);
    }
    for (let j = 0; j < as.length; j++) {
      let tempA = {
        id: as[j].id,
        body: as[j].body,
        date: new Date(parseInt(as[j].date_written)).toISOString(),
        answerer_name: as[j].answerer_name,
        helpfulness: as[j].helpful,
        photos: as[j].photos || []
      }

      for (let i = 0; i < returnObj.results.length; i++) {
        if (returnObj.results[i].question_id === as[j].question_id){
          returnObj.results[i].answers[tempA.id] = tempA
        }
      }
    }
    return returnObj;
  })
  .then(ret => res.send(ret))
  .catch(err => res.status(400).send(err))
}

const selectA = (res, obj) => {
  models.selectA(obj)
  .then(resp => {
    let [as, phs] = resp;
    as = as.rows;
    phs = phs.rows;
    let returnObj = {
      question: obj.question_id,
      page: obj.page || 1,
      count: obj.count || 5,
      results: []
    }
    for (let i = 0; i < phs.length; i++) {
      for (let j = 0; j < as.length; j++) {
        if (as[j].id === phs[i].answer_id) {
          as[j].photos ? as[j].photos.push({id: phs[i].id, url: phs[i].url}) : as[j].photos = [{id: phs[i].id, url: phs[i].url}];
        }
      }
    }
    for (let j = 0; j < as.length; j++) {
      let tempA = {
        answer_id: as[j].id,
        body: as[j].body,
        date: new Date(parseInt(as[j].date_written)).toISOString(),
        answerer_name: as[j].answerer_name,
        helpfulness: as[j].helpful,
        photos: as[j].photos || []
      }
      returnObj.results.push(tempA);
    }
    return returnObj;
  })
  .then(ret => res.send(ret))
  .catch(err => {
    console.log(err);
    res.status(400).send(err);
  })
}

const insertQ = (res, obj) => {
  models.insertQ(obj)
  .then(resp => {
    res.sendStatus(201);
  })
  .catch(err => res.status(400).send(err));
}

const insertA = (res, q, obj) => {
  models.insertA(q, obj)
  .then(resp => {
    res.sendStatus(201);
  })
  .catch(err => {
    console.log(err);
    res.status(400).send(err)
  });
}

const update = (res, arr) => {
  models.update(arr)
  .then(resp => {
    res.sendStatus(204);
  })
  .catch(err => {
    console.log(err)
    res.status(400).send(err)
  });
}

module.exports.selectQ = selectQ;
module.exports.selectA = selectA;
module.exports.insertQ = insertQ;
module.exports.insertA = insertA;
module.exports.update = update;