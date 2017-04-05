"use strict";

const cp    = require('child_process');
const forIn = require('mout/object/forIn');

module.exports = function(package_name , chain) {
  chain = chain || Function.prototype;
  var packageVersion = null;
  var version_title = 'Version:';
  var pross = cp.exec("dpkg -s " + package_name + " |  grep ^" + version_title);
  var data  =  '';

  pross.stdout.on('data', (d) => {
    data += d;
  });

  pross.on("error", function(e) {
    return chain(e);
  });

  pross.on('close', (code) => {
    var packageVersion = data.replace(version_title, '').trim();
    if(!packageVersion || code != 0)
      return chain("not in apt cache");

    chain(null, packageVersion);

  });

};
    