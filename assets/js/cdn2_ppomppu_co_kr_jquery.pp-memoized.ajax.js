
(function (factory) {
  if (typeof define === "function" && define.amd) {
    // AMD. Register as an anonymous module.
    define(["jquery"], factory);
  } else {
    // Browser globals
    // jQuery
    factory(jQuery);
  }
})(function ($) {
  function setWithExpiry(storage, key, value, ttl) {
    const now = new Date();

    // `item` is an object which contains the original value
    // as well as the time when it's supposed to expire
    const item = {
      value: value,
      expiry: now.getTime() + ttl
    };
    storage.setItem(key, JSON.stringify(item));
  }

  function getWithExpiry(storage, key) {
    const itemStr = storage.getItem(key);
    // if the item doesn't exist, return null
    if (!itemStr) {
      return null;
    }
    const item = JSON.parse(itemStr);
    const now = new Date();
    // compare the expiry time of the item with the current time
    if (now.getTime() > item.expiry) {
      // If the item is expired, delete the item from storage
      // and return null
      storage.removeItem(key);
      return null;
    }
    return item.value;
  }

  function d(msg, arg = undefined) {
    if (false) {
      arg === undefined ? console.log(msg) : console.log(msg, arg);
    }
  }
  var inMemory = {};

  $.memoizedAjax = function memoizedAjax(opts) {
    var memo,
      key = opts.cacheKey || opts.url,
      hash = hashFunc(opts.cacheKey),
      ttl = opts.ttl || 1000,
      storage = storageObject(opts);

    if (ttl > 300000 || ttl < 0) {
      ttl = 300000;
    }

    if (storage) {
      memo = store(storage, getStorageAddress(), undefined, ttl) || {};
    } else {
      memo = inMemory[key] || {};
    }

    if (memo[hash]) {
      return (
        $.Deferred()
          .resolve(memo[hash])
          // store this in localStorage to deal with calling with
          // `localStorage: false` and then `localStorage: true` later
          // ensures syncing between memory and localStorage
          .done(function () {
            d("Cache-DATA : ", memo[hash]);

            if (storage) {
              store(storage, getStorageAddress(), memo, ttl);
            }
          })
          // no error callback, since this should never fail...theoretically
          .done(opts.success)
          .always(opts.complete)
      );
    }

    return $.ajax.call(this, opts).done(function (result) {
      d("REAL-DATA:", result);

      memo[hash] = result;

      if (storage) {
        store(storage, getStorageAddress(), memo, ttl);
      } else {
        inMemory[key] = memo;
      }
    });

    function getStorageAddress() {
      return opts.cacheKey || "memoizedAjax | " + opts.url;
    }
  };

  function store(storage, key, value, ttl = 5000) {
    if (!storage) {
      throw new Error("Storage object is undefined");
    }

    // get
    if (value === undefined) {
      // var item = storage.getItem(key);
      var item = getWithExpiry(storage, key);
      return item && JSON.parse(item);
      // set
    } else {
      try {
        // storage.setItem(key, JSON.stringify(value));
        var e_item = getWithExpiry(storage, key);
        if (!e_item) {
          d("SetWith-EXPIRE", key + " TTL : " + ttl);
          setWithExpiry(storage, key, JSON.stringify(value), ttl);
        }
      } catch (err) {
        // prevent catching old values
        d("Cache-Delete: ", key);
        storage.removeItem(key);
      }
    }
  }

  function storageObject(opts) {
    if (opts.localStorage) {
      return localStorage;
    } else if (opts.sessionStorage) {
      return sessionStorage;
    }
  }

  function hashFunc(hash) {
    return JSON.stringify(hash);
  }
});