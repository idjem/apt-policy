"use strict";

const cp = require('child_process');
const forIn = require('mout/object/forIn');

module.exports = function(packages , chain) {
  packages = packages || [];
  packages = typeof packages == "string" ? [packages] : packages;
  chain = chain || Function.prototype;

  var packageVersion = {};
  var pross = cp.spawn("apt-cache" ,["policy"].concat(packages));
  var data= '';

  pross.stdout.on('data', (d) => {
    data += d;
  });

  pross.on("error", function(e) {
    chain(e);
  });

  pross.on('close', (code) => {
    var z = data.split("\n");
    forIn(packages , function(package) {
      var t = z.indexOf(package + ":");
      if(t !== -1)
        packageVersion[package] = {Installed : z[t + 1].split(": ")[1], Candidate : z[t + 2].split(": ")[1]};
      else
        packageVersion[package] = {Installed : "not in apt cache", Candidate : "NOT IN APT CACHE"}
    });
    chain(null, packageVersion);
  });

};
    