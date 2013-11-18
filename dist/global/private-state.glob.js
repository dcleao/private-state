privateState = function() {
  "use strict";
  var U, priv = {
    version: "0.1.1"
  }, newKey = function() {
    function newSafe(secret) {
      return function() {
        _channel = secret;
      };
    }
    function key(safe) {
      if (_channel !== U) throw new Error("Access denied.");
      var secret = (safe(), _channel);
      return _channel = U, secret;
    }
    var _channel;
    return key.safe = newSafe, key.property = key_newProp, key;
  }, key_newProp = function(p) {
    function instInit(inst, secret) {
      return inst[p] = key.safe(secret), secret;
    }
    function propKey(inst) {
      return key(inst[p]);
    }
    p || (p = prop_random());
    var key = this;
    return propKey.init = instInit, propKey.propertyName = p, propKey;
  }, prop_random = function() {
    return "\x00_safe" + new Date().getTime() + Math.round(1e3 * Math.random());
  };
  return priv.key = newKey, priv;
}();