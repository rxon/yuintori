const execFile = require('child_process').execFile;
const scraper = require('./scraper');

scraper('yui_ogura_official', trim);

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
