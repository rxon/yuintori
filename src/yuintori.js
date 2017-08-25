const fs = require('fs');
const url = require('url');
const path = require('path');

const util = require('util');
// const execFile = util.promisify(require('child_process').execFile);
const execFile =require('child_process').execFileSync;

const axios = require('axios');
const scraper = require('./scraper');

scraper('yui_ogura_official').then(async posts => {
  const postInfo = posts.map(async post => await inst(post));
  await Promise.all(postInfo);
});

function inst(post) {
  return new Promise(function(resolve, reject) {
    const parsedUrl = url.parse(post.urls[0]);
    const filename = path.basename(parsedUrl.pathname);
    axios({
      method: 'get',
      url: post.urls[0],
      responseType: 'stream'
    })
      .then(function(response) {
        response.data.pipe(fs.createWriteStream(filename));
      })
      .then(function() {
        // execFile('gm', [
        //   'convert',
        //   filename,
        //   '-fuzz',
        //   '5%',
        //   '-trim',
        //   '+repage',
        //   'd' + filename
        // ]);
        execFile('convert', [
          filename,
          '-fuzz',
          '5%',
          '-trim',
          '+repage',
          'd' + filename
        ]);
      })
      // .then(() => tri(post))
      .catch(err => reject(err.stack));
  });
}

async function tri(post) {
  const parsedUrl = url.parse(post.urls[0]);
  const filename = path.basename(parsedUrl.pathname);

  // const { stdout } = await execFile(
  //   'convert',
  //   [filename, '-fuzz', '5%', '-trim', '+repage', 'd' + filename],
  //   {encoding: 'binary', maxBuffer: 5000*1024}
  // );
  execFile('convert', [
    filename,
    '-fuzz',
    '5%',
    '-trim',
    '+repage',
    'd' + filename
  ]);

  await execFile('gm', [
    'convert',
    filename,
    '-fuzz',
    '5%',
    '-trim',
    '+repage',
    'd' + filename
  ]);
  // let chunks = [];
  // stdout.on('data', function(chunk) {
  //   console.log(chunk.length);
  //   chunks.push(chunk);
  // });
  // stdout.on('close', function() {
  //   const image = Buffer.concat(chunks);
  //   console.log(image.length);
  //   // writeStream.write(image.toString('base64'), 'base64');
  //   fs.writeFileSync('d' + filename, image);
  //
  //   // writeStream.end();
  // });
}
