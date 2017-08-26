const execFile = require('child_process').execFile;
const cronJob = require('cron').CronJob;
const scraper = require('./scraper');

function trim() {
  execFile(
    'mogrify',
    ['-fuzz', '5%', '-trim', '+repage', '*.jpg'],
    (error, stdout, stderr) => {
      if (error) {
        throw error;
      }
    }
  );
}

const job = new cronJob(
  '00 */1 * * * *',
  async function() {
    const posts = await scraper('yui_ogura_official', trim);
    console.log(posts);
  },
  null,
  true,
  'Asia/Tokyo'
);

console.log('job status', job.running);
