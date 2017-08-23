const fs = require('fs');
const url = require('url');
const path = require('path');

const util = require('util');
const execFile = util.promisify(require('child_process').execFile);

const axios = require('axios');
const scraper = require('./scraper');

scraper('yui_ogura_official').then(async posts => {
  const postInfo = posts.map(post => inst(post));
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
      .then(async () => await tri(post))
      .catch(err => reject(err.stack));
  });
}

  async tri(post) {
  return new Promise(function(resolve, reject) {
    const parsedUrl = url.parse(post.urls[0]);
    const filename = path.basename(parsedUrl.pathname);



 // convert -fuzz 5% -trim +repage yui.jpg
      const { stdout } = await execFile('node', ['--version'],{ maxBuffer: 1024 * 1024 });
      console.log(stdout.length);


    getVersion();



    // const readStream = fs.createReadStream(filename);
    gm(filename)
      // gm(filename)
      .command('convert')
      .fuzz('5%')
      // .in('-fuzz', '5%')
      // .in('-trim')
      .trim()
      // .write('d' + filename, function(err) {
      //   if (!err) resolve('done');
      //   // console.log('done');
      // });
      // .stream(function(err, stdout, stderr) {
      //   var writeStream = fs.createWriteStream('d' + filename);
      //   stdout.pipe(writeStream);
      // })
      .stream(function(err, stdout, stderr) {
        // const writeStream = fs.createWriteStream('d' + filename);
        let chunks = [];
        stdout.on('data', function(chunk) {
          console.log(chunk.length);
          chunks.push(chunk);
        });
        stdout.on('end', function() {
          const image = Buffer.concat(chunks);
          console.log(image.length);
          // writeStream.write(image.toString('base64'), 'base64');
          fs.writeFileSync('d' + filename, image);

          // writeStream.end();
        });
      });
  });
}
