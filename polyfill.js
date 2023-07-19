(function () {
    if (!(CSSStyleSheet && CSSStyleSheet.prototype.insertRule)) {
      return;
    }
  
    var style = document.createElement('style');
    var shouldPrefixKeyframes = false;
  
    document.body.appendChild(style);
  
    try {
      style.sheet.insertRule('@keyframes _ {}');
    } catch (err) {
      shouldPrefixKeyframes = true;
    }
  
    document.body.removeChild(style);
  
    if (!shouldPrefixKeyframes) {
      return;
    }
  
    var originalInsertRule = CSSStyleSheet.prototype.insertRule;
  
    CSSStyleSheet.prototype.insertRule = function (rule, index) {
      if (rule.indexOf('@keyframes') === 0) {
        rule = rule.replace('@keyframes', '@-webkit-keyframes');
  
        try {
          originalInsertRule.call(this, rule, index);
        } catch (err) {}
      } else {
        originalInsertRule.call(this, rule, index);
      }
    };
  })();