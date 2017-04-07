"use strict";

const spawn    = require('child_process').spawn;

module.exports = function(package_name , chain) {
  chain = chain || Function.prototype;

  var child = spawn('dpkg-query', ['-W', '-f', '${Version}', package_name]);
  var packageVersion  =  '';

  child.stdout.on('data', d => packageVersion += d);

  child.once('error', chain);

  child.on('close', (code) => {
    if(!packageVersion || code != 0)
      return chain("not in apt cache");

    chain(null, packageVersion);
  });

};
