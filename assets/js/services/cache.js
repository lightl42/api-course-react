// Creer un objet cache
const cache = {};

// Met a jour le cache avec un systeme cle / valeur
function set(key, data) {
  cache[key] = {
    data: data,
    cachedAt: new Date().getTime()
  };
}

// Recupere ce qui se trouve dans le cache
function get(key) {
  return new Promise(resolve => {
    resolve(
      cache[key] && cache[key].cachedAt + 15 * 60 * 1000 > new Date().getTime()
        ? cache[key].data
        : null
    );
  });
}

function invalidate(key) {
  delete cache[key];
}

export default {
  set,
  get,
  invalidate
};
