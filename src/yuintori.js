const fs = require('fs');
const execFile = require('child_process').execFile;
const mustache = require('mustache');
const db = require('./utils/db');
const scraper = require('./scraper');
const sendmail = require('./utils/sendmail');

function trim(filename) {
  execFile(
    'mogrify',
    ['-fuzz', '5%', '-trim', '+repage', 'public/' + filename],
    (error, stdout, stderr) => {
      if (error) {
        throw error;
      }
    }
  );
}

module.exports = async function() {
  const posts = await scraper('yui_ogura_official', trim);
  const template = fs.readFileSync('./src/template.mustache', 'utf-8');
  const attachments = [];
  for (var post of posts) {
    for (filename of post.filenames) {
      attachments.push({
        filename,
        path: 'public/' + filename,
        cid: filename
      });
    }
  }
  if (posts.length > 0) {
    sendmail({
      from: '"ゆいんとり(*-v・)" <rxxxxon@gmail.com>',
      to: 'rxxxxon@gmail.com',
      bcc: db
        .get('users')
        .filter({ active: true })
        .map('email')
        .value(),
      subject: posts[0].text.substr(0, 60) + '…',
      html: mustache.render(template, { mail: posts }),
      attachments
    });
  }
};
