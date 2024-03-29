const request = require('supertest');
const baseURL = 'http://localhost:3000/qa';
const db = require('../database/index.js');

describe('GET questions', () => {

  it('should return the described object', async() => {
    const response = await request(baseURL).get('/questions/?product_id=12').send({completed:true});

    expect(response.statusCode).toBe(200);
    expect(response.body.product_id).toBe('12');
    expect(response.body.results.length).toBe(5);
    expect(response.body.results[0].question_id).toBe(55);
    expect(response.body.results[0].question_body).toBe('Quod porro velit numquam voluptates voluptatem necessitatibus officia.');
    expect(response.body.results[0].question_date).toBe('2021-04-03T10:01:00.652Z');
    expect(response.body.results[0].asker_name).toBe('Camryn_Jacobi');
    expect(response.body.results[0].asker_email).toBe(undefined);
    expect(response.body.results[0].question_helpfulness).toBe(4);
    expect(response.body.results[0].reported).toBe(false);

    expect(response.body.results[1].answers[116].id).toBe(116);
    expect(response.body.results[1].answers[116].body).toBe("Necessitatibus sed esse.");
    expect(response.body.results[1].answers[116].date).toBe("2020-07-21T21:33:55.699Z");
    expect(response.body.results[1].answers[116].answerer_name).toBe('Jairo_Mante');
    expect(response.body.results[1].answers[116].helpfulness).toBe(19);
    expect(response.body.results[1].answers[116].photos[0]).toBe("https://images.unsplash.com/photo-1426647451887-5f2be01918a9?ixlib=rb-1.2.1&auto=format&fit=crop&w=1650&q=80");
  })

  it('should work with no slash', async() => {
    const response = await request(baseURL).get('/questions?product_id=12').send({completed:true});

    expect(response.statusCode).toBe(200);
    expect(response.body.product_id).toBe('12');
    expect(response.body.results.length).toBe(5);
    expect(response.body.results[0].question_id).toBe(55);

    expect(response.body.results[1].answers[116].id).toBe(116);
    expect(response.body.results[1].answers[116].photos[0]).toBe("https://images.unsplash.com/photo-1426647451887-5f2be01918a9?ixlib=rb-1.2.1&auto=format&fit=crop&w=1650&q=80");
  })

  it('should accept page and count params', async() => {
    const response = await request(baseURL).get('/questions?product_id=12&page=2&count=2').send({completed:true});

    expect(response.statusCode).toBe(200);
    expect(response.body.product_id).toBe('12');
    expect(response.body.results.length).toBe(2);
    expect(response.body.results[0].question_id).toBe(58); //56 is reported so it shouldnt be reported

    expect(response.body.results[0].answers[118].photos[0]).toBe("https://images.unsplash.com/photo-1454177643390-7f100d1bbeec?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=1650&q=80");
  })
})


describe('GET answers', () => {

  it('should return the described object', async () => {
    const response = await request(baseURL).get('/questions/57/answers').send({completed:true});

    expect(response.statusCode).toBe(200);
    expect(response.body.question).toBe("57");
    expect(response.body.page).toBe(1);
    expect(response.body.count).toBe(5);

    expect(response.body.results.length).toBe(2);
    expect(response.body.results[0].answer_id).toBe(116);
    expect(response.body.results[0].body).toBe("Necessitatibus sed esse.");
    expect(response.body.results[0].date).toBe("2020-07-21T21:33:55.699Z");
    expect(response.body.results[0].answerer_name).toBe("Jairo_Mante");
    expect(response.body.results[0].helpfulness).toBe(19);
    expect(response.body.results[0].photos[0].id).toBe(18);
    expect(response.body.results[0].photos[0].url).toBe("https://images.unsplash.com/photo-1426647451887-5f2be01918a9?ixlib=rb-1.2.1&auto=format&fit=crop&w=1650&q=80");
  })

  it('should default count 5 and page 1', async () => {
    const response = await request(baseURL).get('/questions/32/answers').send({completed:true});

    expect(response.body.page).toBe(1);
    expect(response.body.count).toBe(5);
    expect(response.body.results.length).toBe(4);

    // THIS TEST IS RELIANT ON ONE ANSWER IMPLEMENTED BY ME WHILE TESTING
    // WILL PROBABLY FAIL WHEN DEPLOYING
  })

  it('should accept page and count params', async () => {
    const response = await request(baseURL).get('/questions/32/answers/?page=2&count=2').send({completed:true});

    expect(response.body.page).toBe("2");
    expect(response.body.count).toBe("2");
    expect(response.body.results.length).toBe(2);

    expect(response.body.results[0].answer_id).toBe(87);
    expect(response.body.results[1].answer_id).toBe(88);
  })

  it('should accept params wo slash', async () => {
    const response = await request(baseURL).get('/questions/32/answers?page=2&count=2').send({completed:true});

    expect(response.body.page).toBe("2");
    expect(response.body.count).toBe("2");
    expect(response.body.results.length).toBe(2);

    expect(response.body.results[0].answer_id).toBe(87);
    expect(response.body.results[1].answer_id).toBe(88);
  })

})

describe("POST questions", () => {
  let last;
  beforeAll(async () => {
    await db.query(`SELECT id FROM questions WHERE id > 3510000 order by id desc`)
    .then(res => {
      last = parseInt(res.rows[0].id) + 1;
    });
  })
  afterAll(async () => {
    await db.query(`DELETE FROM questions WHERE id > ${last} OR id = ${last};
    ALTER SEQUENCE questions_id_seq RESTART WITH ${last};`);
  });

  let obj = {
    name: 'i am a test',
    email: 'test@test.test',
    product_id: 1
  };

  it('should fail when obj.body is undefined', async () => {
    request(baseURL).post('/questions').send(obj)
    .then(res => {
      expect(res.statusCode).toBe(400);
    })
    .catch(err => console.log(err));
  })

  it('should fail when obj.name is undefined', async () => {
    obj.body = 'this is a test';
    obj.name = undefined;
    request(baseURL).post('/questions').send(obj)
    .then(res => {
      expect(res.statusCode).toBe(400);
    })
    .catch(err => console.log(err));
  })

  it('should fail when obj.email is undefined', async () => {
    obj.name = 'i am a test';
    obj.email = undefined;
    request(baseURL).post('/questions').send(obj)
    .then(res => {
      expect(res.statusCode).toBe(400);
    })
    .catch(err => console.log(err));
  })

  it('should fail when obj.product_id is a string', async () => {
    obj.email = 'test@test.test';
    obj.product_id = 'asdf';
    request(baseURL).post('/questions').send(obj)
    .then(res => {
      expect(res.statusCode).toBe(400);
    })
    .catch(err => console.log(err));
  })

  it('should pass when obj has body, name, email, and id', async () => {
    obj.product_id = 1;

    const response = await request(baseURL).post('/questions').send(obj);
    expect(response.statusCode).toBe(201);
    db.query(`SELECT product_id FROM questions WHERE id = ${last}`)
    .then(res => {
      expect(res.rows[0].product_id).toBe(1)
    });
  })

})

describe("POST answers", () => {
  let last;
  let lastPh;
  beforeAll(async () => {
    await db.query(`SELECT id FROM answers WHERE id > 6879250 order by id desc`)
    .then(res => {
      last = parseInt(res.rows[0].id) + 1;
    });
    await db.query(`SELECT id FROM answers_photos WHERE id > 2050000 order by id desc`)
    .then(res => {
      lastPh = parseInt(res.rows[0].id) + 1;
    });
  })
  afterAll(async () => {
    await db.query(`DELETE FROM answers WHERE id > ${last} OR id = ${last};
    ALTER SEQUENCE answers_id_seq RESTART WITH ${last};
    DELETE FROM answers_photos WHERE id > ${lastPh} OR id = ${lastPh};
    ALTER SEQUENCE answers_photos_id_seq RESTART WITH ${lastPh};`);
  });

  let obj = {
    name: 'i am a test',
    email: 'test@test.test',
    photos: ['asdf']
  };

  it('should fail when obj.body is undefined', async () => {
    request(baseURL).post('/questions/1/answers').send(obj)
    .then(res => {
      expect(res.statusCode).toBe(400);
    })
    .catch(err => console.log(err));
  })

  it('should fail when obj.name is undefined', async () => {
    obj.body = 'this is a test';
    obj.name = undefined;
    request(baseURL).post('/questions/1/answers').send(obj)
    .then(res => {
      expect(res.statusCode).toBe(400);
    })
    .catch(err => console.log(err));
  })

  it('should fail when obj.email is undefined', async () => {
    obj.body = 'this is a test';
    obj.name = 'i am a test';
    obj.email = undefined;
    request(baseURL).post('/questions/1/answers').send(obj)
    .then(res => {
      expect(res.statusCode).toBe(400);
    })
    .catch(err => console.log(err));
  })

  it('should pass when all params are given', async () => {
    obj.email = 'test@test.test';
    request(baseURL).post('/questions/1/answers').send(obj)
    .then(res => {
      expect(res.statusCode).toBe(201);
      db.query(`SELECT question_id FROM answers WHERE id = ${last}`)
        .then(res => {
          expect(res.rows[0].question_id).toBe(1)
        });
      db.query(`SELECT answer_id FROM answers_photos WHERE id = ${lastPh}`)
        .then(res => {
          expect(res.rows[0].answer_id).toBe(last)
        });
    })
    .catch(err => console.log(err));
  })

});