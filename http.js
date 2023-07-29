const cache = {}

let ligthState = 0;
let voiceState = 'muted';

function get(url) {
  if (!Bangle.http) {
    console.log('No http module found');
    return Promise.reject('No http module found')
  } else {
    return Bangle.http(url).then((response) => JSON.parse(response.resp));
  }
}

/**
 * @param url {string}
 * @param payload {any}
 * @return {Promise}
 */
function post(url, payload, retries, id) {
  if (retries === undefined) {
    retries = 0;
  }
  if (!Bangle.http) {
    throw new Exception('No http module found');
  } else {
    const newId = id || Date.now()
    cache[newId] = payload
    return Bangle.http(url, {
      method: 'POST',
      body: {id: newId, data: payload},
      headers: {},
    }).then((response) => {
      delete cache[newId];
      return JSON.parse(response.resp);
    }).catch((err) => {
      if (retries > 3) {
        return Promise.reject(err);
      } else {
        return post(url, payload, retries + 1, newId);
      }
    });
  }
}

/**
 * @param url {string}
 * @return {Promise}
 */
function deleteR(url) {

  if (!Bangle.http) {
    throw new Exception('No http module found');
  } else {
    return Bangle.http(url, {
      method: 'DELETE',
      headers: {},
    }).then((response) => JSON.parse(response.resp));
  }
}

module.exports = {
  get: get,
  post: post,
  delete: deleteR,
};
