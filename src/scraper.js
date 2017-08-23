const path = require('path');
const axios = require('axios');
const filter = require('lodash.filter');

const db = require('./db');

function getOriginalSize(item) {
  return item[item.type + 's'].standard_resolution.url;
}

function getUrls(item) {
  const urls = [];
  if (item.type === 'carousel') {
    item.carousel_media.forEach(carouselItem => {
      urls.push(getOriginalSize(carouselItem));
    });
  } else {
    urls.push(getOriginalSize(item));
  }
  return urls;
}

module.exports = function(username) {
  return new Promise(function(resolve, reject) {
    const url = require('url').format({
      protocol: 'https',
      host: 'instagram.com',
      pathname: path.join(username, 'media')
    });
    const lastYui = db.get('last_yui').value();

    const newMedia = [];
    axios
      .get(url)
      .then(media => {
        const filteredMedia = filter(media.data.items, function(item) {
          return item.created_time > lastYui;
        });
        filteredMedia.forEach(item =>
          newMedia.push({
            text: item.caption.text,
            urls: getUrls(item)
          })
        );
      })
      .then(() => resolve(newMedia))
      .catch(err => reject(err.stack));
  });
};
