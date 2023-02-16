let models = require('./models.js');

let select = (res, obj) => {
  if (obj.table = 'questions') {
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
  }
  console.log(obj);
  console.time();
  models.select(obj)
  .then(resp => {
    console.timeEnd();
    console.log(resp);
  })
  .then(ret => res.send(ret))
  .catch(err => console.log(err))
}

module.exports.select = select;

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