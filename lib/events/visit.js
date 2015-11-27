var UBT = require('../kernel');
var collectDataFrom = require('../lib/collectdatafrom');

var keys = ['ubt-visit', 'ubtChange'];
var key  = e.target.getAttribute(keys[0]) ? keys[0] : keys[1];

var sended = {};

var visit = function(element) {
  var id = element.getAttribute(key);
  if(!sended[id]) {
    UBT.send('EVENT', {
      id: id,
      params: collectDataFrom(element)
    });
    sended[id] = true;
  }
  element.removeAttribute(key);
};

var checkVisibility = function(element) {
  if(element.offsetWidth + element.offsetHeight) visit(element);
};

var watch = function() {
  var elements = document.querySelectorAll('[' + key + ']');
  for(var i = 0; i < elements.length; i++) checkVisibility(elements[i]);
  setTimeout(watch, 800);
};

watch();
