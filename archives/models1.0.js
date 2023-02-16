let db = require('./database/index.js');

let query = (text) => db.query(text)

let selectConstructor = (obj) => {
  return `SELECT ${obj.select || '*'} FROM ${obj.table} WHERE ${obj.parent} = ${obj.parentId} ${obj.where || ''} ${obj.sort ? `ORDER BY ${obj.sort}` : ''} LIMIT ${obj.count || 5} ${obj.page ? `OFFSET ${obj.count * obj.page - obj.count}` : ''}`
}

let selectMultipleConstructor = (obj) => {
  let text = `SELECT * FROM ${obj.table} WHERE `;
  let l = obj.arr.length
  for (let i = 0; i < l; i++) {
    let temp = `${obj.parent} = ${obj.arr[i]}`
    if (i !== l-1) temp += ' OR '
    text += temp;
  }
  return text;
}

let selectMultiple = (obj) => {
  return new Promise((resolve, reject) => {
    let text = selectMultipleConstructor(obj);
    query(text)
    .then((resp) => {
      selectChildren(obj, resp, resolve, reject);
    })
  })
}

let select = (obj) => {
  return new Promise((resolve, reject) => {
    let text = selectConstructor(obj);
    query(text)
    .then((resp) => {
      selectChildren(obj, resp, resolve, reject);
    })
  })
}

let selectChildren = (obj, resp, res, rej) => {
  if (obj.child) {
    let selectMultipleObject = {
      table: obj.child.table,
      parent: obj.child.parent,
      child: obj.child.child,
      arr: []
    }
    for(let i = 0; i < resp.rows.length; i++) {
      selectMultipleObject.arr.push(resp.rows[i].id)
    }
    selectMultiple(selectMultipleObject)
    .then((vals) => {
      res([resp.rows, vals]);
    })
  } else {
    res(resp.rows);
  }
}

module.exports.select = select;

let exampleSelect = () => {
  let tempObj = {
    table: 'questions',
    parent: 'product_id',
    parentId: 2,
    count: 3,
    page: 2,
    child: {
      parent: 'question_id',
      table: 'answers',
      child: {
        parent: 'answer_id',
        table: 'answers_photos'
      }
    }
  }
  // console.time()
  select(tempObj)
    .then(res => {
      console.log(res);
      // console.timeEnd();
      // 7s, 12s, 6.5s
    })
  .catch(err => console.log(err));
}
// exampleSelect();
