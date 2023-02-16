const models = require('./models.js');

const selectQ = (res, obj) => {
  console.time()
  models.selectQ(obj)
  .then(resp => {
    console.timeEnd();
    console.time();
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
        question_date: qs[i].date_written,
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
        date: as[j].date_written,
        answerer_name: as[j].answerer_name,
        photos: as[j].photos
      }
      for (let i = 0; i < returnObj.results.length; i++) {
        if (returnObj.results[i].question_id === as[j].question_id){
          returnObj.results[i].answers[tempA.id] = tempA
        }
      }
    }
    console.timeEnd();
    return returnObj;
  })
  .then(ret => res.send(ret))
  .catch(err => console.log(err))
}

const insertQ = (res, obj) => {
  models.insertQ(obj)
  .then(resp => {
    res.sendStatus(204);
    console.log(resp, 'says the response!');
  })
  .catch(err => console.log(err))
}

module.exports.selectQ = selectQ;
module.exports.insertQ = insertQ;

let testSel = () => {
  selectQ({}, {product_id: 2, count: 3, page: 2 })
}
// testSel();

let testIns = () => {
  insertQ({}, {name: 'smolder', email: 'smolder@jenkins.gov', product_id: 37315, body: 'i am the jenkins'})
}
// testIns();

