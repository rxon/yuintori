const fs = require('fs');
const url = require('url');
const path = require('path');
const axios = require('axios');
const filter = require('lodash.filter');

const db = require('./db');

function download(item, trim) {
  const originalSizeUrl = item[item.type + 's'].standard_resolution.url;
  const parsedUrl = url.parse(originalSizeUrl);
  const filename = path.basename(parsedUrl.pathname);
  axios({
    method: 'get',
    url: originalSizeUrl,
    responseType: 'stream'
  }).then(function(response) {
    const writeStream = response.data.pipe(fs.createWriteStream(filename));
    writeStream.on('finish', function() {
      trim(filename);
    });
  });
  return filename;
}

module.exports = async function(username, trim) {
  const endPoint = url.format({
    protocol: 'https',
    host: 'instagram.com',
    pathname: path.join(username, 'media')
  });
  const lastYui = db.get('last_yui').value();
  const newMedia = [];
  const media = await axios.get(endPoint);
  const filteredMedia = filter(media.data.items, function(item) {
    return item.created_time > lastYui;
  });

  filteredMedia.forEach(item => {
    const yuitem = item.type === 'carousel' ? item.carousel_media[0] : item;

    newMedia.push({
      text: item.caption.text,
      filename: download(yuitem, trim)
    });

    // if (item.created_time > lastYui) {
    //   db.set('last_yui', item.created_time).write();
    // }
  });
  return newMedia;
};
