const yum = require('./yum');
const express = require('express');
const app = express();

var cfenv = require('cfenv');
var appEnv = cfenv.getAppEnv();

var remoteFTP = "public.dhe.ibm.com";
var remoteFile = "/software/ibmi/products/pase/rpms/repo/repodata/d75d4b240e89c9c3cf13f1f7d5d35839a1a20335f8799f4cab5fd0e443e6200c-primary.xml.gz";

var jsonData = {};

app.listen(appEnv.port, function() {
  yum.downloadGZ(remoteFTP, remoteFile, function(err, xmlPath) {
    yum.xmlToJSON(xmlPath, function(err, json) {
      jsonData = yum.parseRepoJson(json);
    });
  });

  console.log("server starting on " + appEnv.url);
});

app.get('/repo', function(req, res) {
  res.json(jsonData);
})

app.use(express.static('public'));