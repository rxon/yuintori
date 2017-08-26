const fs = require('fs');
const url = require('url');
const path = require('path');
const axios = require('axios');
const filter = require('lodash.filter');

const db = require('./db');

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
    const originalSizeUrl = item[item.type + 's'].standard_resolution.url;
    const parsedUrl = url.parse(originalSizeUrl);
    const filename = path.basename(parsedUrl.pathname);
    if (item.created_time > lastYui) {
      // db.set('last_yui', item.created_time).write();
    }

    axios({
      method: 'get',
      url: originalSizeUrl,
      responseType: 'stream'
    }).then(function(response) {
      const writeStream = response.data.pipe(fs.createWriteStream(filename));
      writeStream.on('finish', function() {
        trim();
      });
    });
    newMedia.push({
      text: item.caption.text,
      filename
    });
  });
  return newMedia;
};
