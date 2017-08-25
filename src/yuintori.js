const execFile = require('child_process').execFile;
const scraper = require('./scraper');

scraper('yui_ogura_official').then(async posts => {});

// mogrify -fuzz 5% -trim +repage yui.jpg
execFile('convert', [
  filename,
  '-fuzz',
  '5%',
  '-trim',
  '+repage',
  'd' + filename
]);
