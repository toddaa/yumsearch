const yum = require('./yum');
const express = require('express');
const app = express();
const port = 3000;

var remoteFTP = "public.dhe.ibm.com";
var remoteFile = "/software/ibmi/products/pase/rpms/repo/repodata/d75d4b240e89c9c3cf13f1f7d5d35839a1a20335f8799f4cab5fd0e443e6200c-primary.xml.gz";

var jsonData = {};
var simpleJson = {}

app.listen(port, function() {
  yum.downloadGZ(remoteFTP, remoteFile, function(err, xmlPath) {
    yum.xmlToJSON(xmlPath, function(err, json) {
      jsonData = yum.parseRepoJson(json);
    })
  });
});

app.get('/repo', function(req, res) {
  res.json(jsonData);
})

app.use(express.static('public'));