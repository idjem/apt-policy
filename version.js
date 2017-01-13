"use strict";

const cp    = require('child_process');
const forIn = require('mout/object/forIn');

module.exports = function(package_name , chain) {

  chain = chain || Function.prototype;
  var packageVersion = null;
  var pross = cp.spawn("apt-cache" ,["policy", package_name]);
  var data  =  '';

  pross.stdout.on('data', (d) => {
    data += d;
  });

  pross.on("error", function(e) {
    return chain(e);
  });

  pross.on('close', (code) => {
    var z = data.split("\n");
    var t = z.indexOf(package_name + ":");
    if(t !== -1) {
      packageVersion = z[t + 1].split(": ")[1]
    } else {
      return chain("not in apt cache");
    }
    chain(null, packageVersion);
  });

};
    