const fs = require('fs');
const url = require('url');
const path = require('path');
const axios = require('axios');
const moment = require('moment');
const filter = require('lodash.filter');

const db = require('./utils/db');

function download(originalSizeUrl, trim) {
  const parsedUrl = url.parse(originalSizeUrl);
  const filename = path.basename(parsedUrl.pathname);
  axios({
    method: 'get',
    url: originalSizeUrl,
    responseType: 'stream'
  }).then(function(response) {
    const writeStream = response.data.pipe(
      fs.createWriteStream('public/' + filename)
    );
    writeStream.on('finish', function() {
      trim(filename);
    });
  });
  return filename;
}

function getFilenames(item, trim) {
  let filenames = [];
  if (item.type === 'carousel') {
    for (let object of item.carousel_media) {
      let originalSizeUrl = object[object.type + 's'].standard_resolution.url;
      filenames.push(download(originalSizeUrl, trim));
    }
  } else {
    let originalSizeUrl = item[item.type + 's'].standard_resolution.url;
    filenames.push(download(originalSizeUrl, trim));
  }
  return filenames;
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
    moment.locale('ja');
    const createdTime = new Date(Number(item.created_time + '000'));
    const time = moment(createdTime).format('dddd k:mm:ss');
    newMedia.push({
      filenames: getFilenames(item, trim),
      text: item.caption.text,
      url: `https://www.instagram.com/p/${item.code}/`,
      time
    });

    // if (item.created_time > lastYui) {
    //   db.set('last_yui', item.created_time).write();
    // }
  });
  return newMedia;
};
