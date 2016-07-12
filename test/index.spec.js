var sinon = require('sinon');
var rewire = require('../index').rewire;
var chai = require('chai');
var expect = chai.expect;
chai.use(require('sinon-chai'));

describe('The rewire test helper', function() {
  var module;
  var onAfterEach;
  var afterEachHook = function(callback) {
    onAfterEach = callback;
  };

  beforeEach(function() {
    onAfterEach = null;
    module = {
      __Rewire__: sinon.stub(),
      __ResetDependency__: sinon.stub()
    };
  });

  it('should replace a given variable on replace', function() {
    var replace = rewire(module).replace;

    replace('myVariable', 'myValue');

    expect(module.__Rewire__).to.have.been.calledWith('myVariable', 'myValue');
  });

  it('should replace a set of variables on replaceMap', function() {
    var replaceMap = rewire(module).replaceMap;

    replaceMap({
      variable1: 'value1',
      variable2: 'value2',
      variable3: 'value3'
    });

    expect(module.__Rewire__).to.have.been.calledWith('variable1', 'value1');
    expect(module.__Rewire__).to.have.been.calledWith('variable2', 'value2');
    expect(module.__Rewire__).to.have.been.calledWith('variable3', 'value3');
  });

  it('should replace variables given by an array of names on replaceList', function() {
    var replaceList = rewire(module).replaceList;

    replaceList(['variable1', 'variable2', 'variable3'], function(variableName) {
      return 'replaced ' + variableName;
    });

    expect(module.__Rewire__).to.have.been.calledWith('variable1', 'replaced variable1');
    expect(module.__Rewire__).to.have.been.calledWith('variable2', 'replaced variable2');
    expect(module.__Rewire__).to.have.been.calledWith('variable3', 'replaced variable3');
  });

  it('should reset all replaced variables on reset', function() {
    var rewireApi = rewire(module);
    rewireApi.replace('variable1', 'value1');
    rewireApi.replaceMap({
      variable2: 'value2',
      variable3: 'value3'
    });

    rewireApi.reset();

    expect(module.__ResetDependency__).to.have.been.calledWith('variable1');
    expect(module.__ResetDependency__).to.have.been.calledWith('variable2');
    expect(module.__ResetDependency__).to.have.been.calledWith('variable3');
  });

  it('should not register a callback with the afterEachHook if autoReset is false', function() {
    rewire(module, false, afterEachHook);

    expect(onAfterEach).to.be.null;
  });

  it('should register a callback with the afterEachHook if autoReset is true', function() {
    rewire(module, true, afterEachHook);

    expect(onAfterEach).to.be.a('function');
  });

  it('should restore all replaced variables on afterEach if autoreset is true', function() {
    var rewireApi = rewire(module, true, afterEachHook);
    rewireApi.replace('variable1', 'value1');
    rewireApi.replaceMap({
      variable2: 'value2',
      variable3: 'value3'
    });

    onAfterEach();

    expect(module.__ResetDependency__).to.have.been.calledWith('variable1');
    expect(module.__ResetDependency__).to.have.been.calledWith('variable2');
    expect(module.__ResetDependency__).to.have.been.calledWith('variable3');
  });

  it('should register a callback with a global afterEach function if autoReset is true and no afterEachHook is provided', function() {
    var oldAfterEach = global.afterEach;
    global.afterEach = afterEachHook;

    rewire(module, true);

    expect(onAfterEach).to.be.a('function');
    global.afterEach = oldAfterEach;
  });

  it('should restore all replaced variables on global afterEach if autoreset is true and no afterEachHook is provided', function() {
    var oldAfterEach = global.afterEach;
    global.afterEach = afterEachHook;
    var replace = rewire(module, true).replace;
    replace('myVariable', 'myValue');

    onAfterEach();

    expect(module.__ResetDependency__).to.have.been.calledWith('myVariable');
    global.afterEach = oldAfterEach;
  });
});
