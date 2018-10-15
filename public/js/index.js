entries = [];

const pageMax = 40;
const descMax = 60;
const includeSrc = false;

//------------------------------------------

function getRandomInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function doSearch(searchValue) {
  clearItems();
  searchValue = searchValue.trim();
  
  if (searchValue.length > 0) {
    var searchValueUpper = searchValue.toUpperCase().split(' ');
    
    console.log('search val: ' + searchValue);
    console.log(searchValueUpper);
    
    var count = 0;
    var match = true;
    
    for(var i = (entries.length-1); i >= 0 && count < pageMax; i--) {
      match = true;

      if (entries[i].arch === "src" && !includeSrc) {
        match = false;
      }
      
      for(var y = 0; y < searchValueUpper.length; y++) {
        if ((entries[i].name.toUpperCase().indexOf(searchValueUpper[y]) >= 0)) {
          //Keyword looking good
        } else {
          match = false;
        }
      }
      
      if (match === true) {
        addItem(entries[i], i); 
        count++;
        continue;
      }
      
      /*else if (entries[i].link.indexOf(searchValue) >= 0) {
        addItem(entries[i]);
        count++;
        continue;
      }*/
    }
    
  } else {
    populateRandom();
  }
}

function clearItems() {
  $("#listing").empty();
}

function populateRandom() {
  var index = 0;
  for(var i = 0; i < 5; i++) {
    index = getRandomInt(0, entries.length-1)
    addItem(entries[index], index); 
  }
}

function addItem(entry, index) {
  var html = "<li>";
  html += '<span class=\"fa-li\" ><i class=\"fas fa-angle-double-right fa-lg\"></i></i></span>';
  html += '<p>';

  html += '<button type="button" class="btn btn-lg btn-light" data-toggle="modal" data-target="#packageModal" data-package="' + index + '">';
  html += "<span id=\"pkgtitle\">" + entry.name + " (" + entry.version.ver + ", " + entry.arch + ")</span></button>";
  html += "<span id=\"pkgdesc\">" + (entry.description.length > descMax ? entry.description.substr(0, descMax) + '...' : entry.description) + "</span>";
  
  if (entry.hasOwnProperty("format")){
    entry.format.forEach(function(obj) { 
      if (obj.name == "rpm:license"){
        html += "<span id=\"pkglic\" class=\"badge badge-info\">" + obj.elements[0].text + "</span>";
      }
    });
  }
  
  html += "</p></li></a>";
  
  $( "#listing" ).append(html);
}

function quickSearch(element) {
  var button = $(element).text();

  $('#search').val(button);
  doSearch($('#search').val());
}

$("#search").on('change paste input', function(){
  doSearch($('#search').val());
});

$('#packageModal').on('show.bs.modal', function (event) {
  var button = $(event.relatedTarget) // Button that triggered the modal
  var packageIndex = button.data('package') // Extract info from data-* attributes
  // If necessary, you could initiate an AJAX request here (and then do the updating in a callback).
  // Update the modal's content. We'll use jQuery here, but you could use a data binding library or other methods instead.
  var modal = $(this);
  var package = entries[packageIndex];

  modal.find('.modal-title').text(package.name + ' (' + package.arch + ')');
  modal.find('#version').text('version ' + package.version.ver + ', release ' + package.version.rel);
  modal.find('#summary').text(package.summary);
  modal.find('#desc').text(package.description);
  modal.find('#url').html('<a target="_blank" href="' + package.url + '">' + package.url + '</a>');
  modal.find('#install').html('<code>yum install ' + package.name + '</code>');
  //modal.find('.modal-body input').val(recipient)

  if (package.hasOwnProperty("format")){
    package.format.forEach(function(obj) { 
      if (obj.name == "rpm:license"){
        modal.find('#license').html(obj.elements[0].text);
      }
    });
  }
})

//***************************

var xmlHttp = new XMLHttpRequest();
xmlHttp.onreadystatechange = function() { 
    if (xmlHttp.readyState == 4 && xmlHttp.status == 200) {
        entries = JSON.parse(xmlHttp.responseText);
        document.getElementById("search").focus();
        populateRandom();
        $('#indexsize').text(entries.length);
    }
}
xmlHttp.open("GET", "/repo", true); // true for asynchronous 
xmlHttp.send(null);