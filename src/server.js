const Koa = require('koa');
const app = new Koa();
const route = require('koa-route');
const serve = require('koa-static');
const logger = require('koa-logger');
const bodyParser = require('koa-bodyparser');
const crypto = require('crypto');

const db = require('./db');
const sendmail = require('./sendmail');

app.use(logger());
app.use(bodyParser());
app.use(serve('./public'));

app.use(route.post('/auth', postAuth));
app.use(route.get('/auth', getAuth));

function postAuth(ctx) {
  const email = ctx.request.body.email;
  const token = crypto.createHash('sha224').digest('hex');
  const url = process.env.NOW_URL || 'http://localhost:3000/';

  db
    .get('users')
    .push({
      active: false,
      email,
      token,
      created_at: new Date()
    })
    .write();

  sendmail({
    from: '"ゆいんとり(*-v・)" <rxxxxon@gmail.com>',
    to: email,
    // bcc,
    subject: 'title',
    html: `<a href="${url}auth?email=${email}&token=${token}">link</a>`
    // attachments
  });

  ctx.body = ctx.request.body;
}

function getAuth(ctx) {
  const dbToken = db
    .get('users')
    .findLast({
      email: ctx.request.query.email
    })
    .get('token')
    .value();

  if (ctx.request.query.token === dbToken) {
    db
      .get('users')
      .find({
        email: ctx.request.query.email
      })
      .assign({
        active: true
      })
      .unset('token')
      .write();

    ctx.body = 'Authed';
  } else {
    ctx.body = 'Auth Fail';
  }
}

// root fetch db.getState()

db
  .defaults({
    last_yui: '',
    users: []
  })
  .write()
  .then(() => {
    app.listen(3000, () => console.log('Server is listening'));
  });
