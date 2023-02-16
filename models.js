let db = require('./database/index.js');

const query = (text) => db.query(text)

const selectQ = (obj) => {
  let tempText = `SELECT * FROM questions WHERE product_id = ${obj.product_id} AND reported = false ${obj.sort ? `ORDER BY ${obj.sort}` : ''} LIMIT ${obj.count || 5} ${obj.page ? `OFFSET ${obj.count * obj.page - obj.count}` : ''};
  SELECT * FROM answers WHERE question_id IN (SELECT id FROM questions WHERE product_id = ${obj.product_id} AND reported = false ${obj.sort ? `ORDER BY ${obj.sort}` : ''} LIMIT ${obj.count || 5} ${obj.page ? `OFFSET ${obj.count * obj.page - obj.count}` : ''});
  SELECT * FROM answers_photos WHERE answer_id IN (SELECT id FROM answers WHERE question_id IN (SELECT id FROM questions WHERE product_id = ${obj.product_id} AND reported = false ${obj.sort ? `ORDER BY ${obj.sort}` : ''} LIMIT ${obj.count || 5} ${obj.page ? `OFFSET ${obj.count * obj.page - obj.count}` : ''}))`;
  console.log(tempText);

  return new Promise((res, rej) => {
    query(tempText)
    .then(resp => res(resp));
  })
}

const insertQ = (obj) => {
  let tempText = `INSERT INTO questions (product_id, body, date_written, asker_name, asker_email)
  VALUES(${obj.product_id}, $$${obj.body}$$, ${Date.now()}, $$${obj.name}$$, $$${obj.email}$$)`;

  return new Promise((res, rej) => {
    query(tempText)
    .then(resp=> res(resp));
  })
}


module.exports.selectQ = selectQ;
module.exports.insertQ = insertQ;

const exampleInsertQ = () => {
  console.time();
  console.log(Date.now());
  insertQ({
    name: 'smolder',
    email: 'smolder@jenkins.gov',
    product_id: 37315,
    body: 'i am the jenkins'
  })
  .then(res=> {
    console.timeEnd();
    console.log(res)
  })
}
// exampleInsertQ();

const exampleSelectQ = () => {
  let tempObj = {
    product_id: 2,
    count: 3,
    page: 2
  }
  console.time()
  selectQ(tempObj)
    .then(res => {
      console.log(res);
      console.timeEnd();
      //
    })
  .catch(err => console.log(err));
}
// exampleSelectQ();

/*
EXPLAIN ANALYZE SELECT * FROM questions WHERE product_id = 2 AND reported = false LIMIT 3;
EXPLAIN ANALYZE SELECT * FROM answers WHERE question_id IN (SELECT id FROM questions WHERE product_id = 2 AND reported = false LIMIT 3);
EXPLAIN ANALYZE SELECT * FROM answers_photos WHERE answer_id IN (SELECT id FROM answers WHERE question_id IN (SELECT id FROM questions WHERE product_id = 2 AND reported = false LIMIT 3));
*/