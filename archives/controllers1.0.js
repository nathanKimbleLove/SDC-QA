let models = require('./models.js');

let selectQs = (res, obj) => {
  obj.parent = 'product_id';
  obj.parentId = obj.product_id;
  obj.select = 'id, body, date_written, asker_name, reported, helpful';
  obj.where = 'AND reported = false';
  obj.child = {
    parent: 'question_id',
    table: 'answers',
    child: {
      parent: 'answer_id',
      table: 'answers_photos'
    }
  }

  models.select(obj)
  .then(resp => {
    let [qs, [as, phs]] = resp;
    let returnObj = {
      product_id: obj.parentId,
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
    return returnObj;
  })
  .then(ret => res.send(ret))
  .catch(err => console.log(err))
}

module.exports.selectQs = selectQs;

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





  //    {
  //     table: 'questions',
  //     parent: 'product_id',
  //     parentId: 2,
  //     count: 3,
  //     page: 2,
  //     child: {
  //       parent: 'question_id',
  //       table: 'answers',
  //       child: {
  //         parent: 'answer_id',
  //         table: 'answers_photos'
  //       }
  //    }