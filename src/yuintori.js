const fs = require('fs');
const gm = require('gm');
const axios = require('axios');

const url = require('url');
const path = require('path');

const scraper = require('./scraper');

scraper('yui_ogura_official')
  .then(posts => {
    posts.forEach(post => inst(post, posts));
    return posts;
  })
  .then(posts => posts.forEach(post => tri(post)));

function inst(post) {
  const parsedUrl = url.parse(post.urls[0]);
  const filename = path.basename(parsedUrl.pathname);
  axios({
    method: 'get',
    url: post.urls[0],
    responseType: 'stream'
  }).then(function(response) {
    response.data.pipe(fs.createWriteStream(filename));
  });
}

function tri(post) {
  const parsedUrl = url.parse(post.urls[0]);
  const filename = path.basename(parsedUrl.pathname);
  gm(filename)
    .command('convert')
    .in('-fuzz', '5%')
    .in('-trim')
    .write('d' + filename, function(err) {
      if (!err) console.log('done');
    });
}
