var UBT = require('../kernel');
var on = require('../lib/on');
var parents = require('../lib/parents');
var collectDataFrom = require('../lib/collectdatafrom');

// 监控值变化事件
// 逻辑：
// 如果点击到的是一个控件则直接绑定 change 事件
// 否则寻找祖先级元素中的 LABEL 并给这个 LABEL 关联的控件绑定 change 事件
var keys = ['ubt-change', 'ubtChange'];
var key  = e.target.getAttribute(keys[0]) ? keys[0] : keys[1];
var installed = key + '-installed';
var bind = function(element, name) {
  on(element, 'change', function(e) {
    UBT.send('EVENT', {
      id: e.target.getAttribute(key),
      params: collectDataFrom(e.target)
    });
  });
};
var tags = [ 'input', 'textarea', 'select' ];
var install = function(element) {
  if(element[installed]) return;
  element[installed] = true;
  bind(element, element.getAttribute(key));
};
var search = function(event) {
  var element = event.target;
  if(!new RegExp(tags.join('|'), 'i').test(element.tagName)) {
    var label = element.tagName === 'LABEL' && element;
    if(!label) {
      parents(element, function(element) {
        label = element.tagName === 'LABEL' && element;
        if(label) return false;
      });
    }
    if(label) {
      var id = label.getAttribute('for');
      var element = id ? document.getElementById(id) : label.querySelector(tags);
    }
  }
  if(element && element.hasAttribute(key)) install(element);
};
// 由于 change 不冒泡，所以需要由一个鼠标或键盘事件来引导
on(document, 'mousedown', search);
on(document, 'keydown', search);

