const jsftp = require("jsftp");
var fs = require('fs');
const gunzip = require('gunzip-file');
var xml = require('xml-js');

module.exports = {
  downloadGZ: function(host, path, callback) {
    const client = new jsftp({
      host: host
    });
    
    client.on('error', function(error) {
      callback(error, null);
    })

    client.on('connect', function() {
      client.get(path, "repo.gz", err => {
        if (err) {
          callback(err, null);
        } else {
          gunzip('repo.gz', 'repo.xml', () => {
            callback(null, 'repo.xml');
          });
        }
      });
    });
  },

  xmlToJSON: function(filePath, callback) {
    fs.readFile(filePath, function(err, data) {
      if (err) {
        callback(err, null);
      } else {
        var json = xml.xml2js(data.toString('utf8'));
        callback(null, json);
      }
    })
    
  },

  parseRepoJson: function(jsonIn) {
    var newObject = [];
    var package;
    var info
    var packageInfo = {};

    var jsonIn = jsonIn.elements[0].elements;

    for (var packageIndex in jsonIn) {
      package = jsonIn[packageIndex];
      packageInfo = {};
      
      for (var infoIndex in package.elements) {
        info = package.elements[infoIndex];
        
        switch (true) {
          case info.elements !== undefined:
            packageInfo[info.name] = info.elements[0].text;
            break;
          case info.attributes !== undefined:
            packageInfo[info.name] = info.attributes;
            break;
        }
        
      }

      newObject.push(packageInfo);
    }

    return newObject;
  }

}