const fs = require('fs');
const execFile = require('child_process').execFile;
const cronJob = require('cron').CronJob;
const mustache = require('mustache');
const scraper = require('./scraper');
const sendmail = require('./sendmail');

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
//
// const job = new cronJob(
//   '00 */1 * * * *',
//   async function() {
//     const posts = await scraper('yui_ogura_official', trim);
//     console.log(posts);
//   },
//   null,
//   true,
//   'Asia/Tokyo'
// );
//
// console.log('job status', job.running);

async function dev() {
  const posts = await scraper('yui_ogura_official', trim);
  const template = fs.readFileSync('./src/template.mustache', 'utf-8');
  const html = mustache.render(template, { mail: posts });

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
  sendmail({
    from: '"ゆいんとり(*-v・)" <rxxxxon@gmail.com>',
    to: '',
    // bcc,
    subject: 'title',
    html,
    attachments
  });
}
dev();
