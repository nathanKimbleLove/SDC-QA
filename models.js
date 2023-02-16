let db = require('./database/index.js');

let query = (text) => db.query(text)

let selectConstructor = (obj) => {
  return `SELECT * FROM ${obj.table} WHERE ${obj.parent} = ${obj.parentId} ${'ORDER BY ' + (obj.sort || 'id')} LIMIT ${obj.count || 5} OFFSET ${(obj.count * obj.page - obj.count) || 0}`
}

let insertConstructor = (obj, table) => {
  return `INSERT INTO ${table}(${Object.keys(obj).join(', ')}) VALUES(${Object.values(obj).join(', ')})`
}


let select = (obj) => {
  console.log(obj);
  return new Promise((resolve, reject) => {
    let text = selectConstructor(obj);
    console.log(text);
    query(text)
    .then((resp) => {
      console.log(resp.rows);
      if (obj.child) {
        console.log('hello');
        for(let i = 0; i < resp.rows; i++) {
          console.log('hello again');
          let temp = {
            parent: obj.child.parent,
            parentId: resp.rows[i].id,
            count: 'ALL',
            table: obj.child.table
          }
          console.log('this is themp, ', temp, 'and i am about to call select');
          resp.rows[i].children = select(temp);
          console.log(resp.rows[i]);
        }
      }
      resolve(resp.rows);
    })
  })
}


























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
  query(select(tempObj))
    .then(res => {
      console.log(res.rows);
    })
  .catch(err => console.log(err));
}
exampleSelect();

//select skip [count*page - count] first [count] * from


// select * from [table] [ ORDER BY ...]
// [LIMIT num | ALL] [OFFSET num]

//ORDER BY CASE WHEN f(x) <=> y THEN 1
//              WHEN f'(x) <=> y THEN 2
// ETC ...