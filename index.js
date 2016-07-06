module.exports.rewire = function(module, autoReset, afterEachHook) {
  var rewiredNames = [];
  if (typeof autoReset === 'undefined') {
    autoReset = true;
  }
  if (typeof afterEachHook === 'undefined') {
    afterEachHook = afterEach;
  }

  function reset() {
    rewiredNames.forEach(function(name) {
      module.__ResetDependency__(name);
    });
    rewiredNames.length = 0;
  }

  if (autoReset) {
    afterEachHook(reset);
  }

  return {
    replace: function(name, replacement) {
      module.__Rewire__(name, replacement);
      rewiredNames.push(name);
      return this;
    },

    reset: function() {
      reset();
      return this;
    }
  };
};
