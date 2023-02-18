let db = require('./database/index.js');

const query = (text) => db.query(text)

const selectQ = (obj) => {
  let tempText = `SELECT * FROM questions WHERE product_id = ${obj.product_id} AND reported = false ${obj.sort ? `ORDER BY ${obj.sort}` : ''} LIMIT ${obj.count || 5} ${obj.page ? `OFFSET ${obj.count * obj.page - obj.count}` : ''};
  SELECT * FROM answers WHERE question_id IN (SELECT id FROM questions WHERE product_id = ${obj.product_id} AND reported = false ${obj.sort ? `ORDER BY ${obj.sort}` : ''} LIMIT ${obj.count || 5} ${obj.page ? `OFFSET ${obj.count * obj.page - obj.count}` : ''});
  SELECT * FROM answers_photos WHERE answer_id IN (SELECT id FROM answers WHERE question_id IN (SELECT id FROM questions WHERE product_id = ${obj.product_id} AND reported = false ${obj.sort ? `ORDER BY ${obj.sort}` : ''} LIMIT ${obj.count || 5} ${obj.page ? `OFFSET ${obj.count * obj.page - obj.count}` : ''}))`;

  return new Promise((res, rej) => {
    query(tempText)
    .then(resp => res(resp))
    .catch(err => rej(err));
  })
}

const selectA = (obj) => {
  let tempText = `SELECT * FROM answers WHERE question_id = ${obj.question_id} AND reported = false LIMIT ${obj.count || 5} ${obj.page ? `OFFSET ${obj.count * obj.page - obj.count}` : ''};
  SELECT * FROM answers_photos WHERE answer_id IN (SELECT id FROM answers WHERE question_id = ${obj.question_id} AND reported = false LIMIT ${obj.count || 5} ${obj.page ? `OFFSET ${obj.count * obj.page - obj.count}` : ''});`;

  return new Promise((res, rej) => {
    query(tempText)
    .then(resp => res(resp))
    .catch(err => rej(err));
  })
}

const insertQ = (obj) => {
  let tempText = `INSERT INTO questions (product_id, body, date_written, asker_name, asker_email)
  VALUES(${obj.product_id}, $$${obj.body}$$, ${Date.now()}, $$${obj.name}$$, $$${obj.email}$$)`;

  return new Promise((res, rej) => {
    query(tempText)
    .then(resp=> res(resp))
    .catch(err => rej(err));
  })
}

const insertA = (q, obj) => {
  let tempText = `INSERT INTO answers (question_id, body, date_written, answerer_name, answerer_email)
  VALUES(${q.question_id}, $$${obj.body}$$, ${Date.now()}, $$${obj.name}$$, $$${obj.email}$$);
  `;
  for (let i = 0; i < obj.photos.length; i++) {
    tempText += `INSERT INTO answers_photos (answer_id, url) VALUES((SELECT pg_sequence_last_value('answers_id_seq')), $$${obj.photos[i]}$$)`;
    if (i != obj.photos.length - 1) tempText += `;
    `
  }
  return new Promise((res, rej) => {
    query(tempText)
    .then(resp=> res(resp))
    .catch(err => rej(err));
  })
}

const update = (arr) => {
  let tempText = `UPDATE ${arr[1]} SET ${arr[3]} WHERE id = ${arr[2]}`;

  return new Promise((res, rej) => {
    query(tempText)
    .then(resp=> res(resp))
    .catch(err => rej(err));
  })
}

module.exports.selectQ = selectQ;
module.exports.selectA = selectA;
module.exports.insertQ = insertQ;
module.exports.insertA = insertA;
module.exports.update = update;