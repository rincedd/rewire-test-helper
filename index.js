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

  function replace(name, replacement) {
    module.__Rewire__(name, replacement);
    rewiredNames.push(name);
    return this;
  }

  function replaceMap(replacementMap) {
    Object.keys(replacementMap).forEach(function(name) {
      replace(name, replacementMap[name]);
    });
    return this;
  }

  function replaceList(replacedVariableNames, getReplacementForName) {
    replacedVariableNames.forEach(function(name) {
      replace(name, getReplacementForName(name));
    });
    return this;
  }

  return {
    replace: replace,

    replaceMap: replaceMap,

    replaceList: replaceList,

    reset: function() {
      reset();
      return this;
    }
  };
};
