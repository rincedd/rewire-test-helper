# rewire-test-helper
Simplify working with `babel-plugin-rewire`. Automatically reset
rewired dependencies in your testing framework's `afterEach` hook.

## Usage
Use with, e.g., `mocha`, `chai`, and `sinon`.
```javascript
import {someMethod, __RewireAPI__} from './module-to-test';
import {rewire} from 'rewire-test-helper';

describe('someMethod', function() {
  const moduleToTest = rewire(__RewireAPI__);

  it('should do something', function() {
    const importedFunctionStub = sinon.stub();
    moduleToTest.replace('anImportedFunction', importedFunctionStub);

    someMethod();
    expect(importedFunctionStub).to.have.been.called;
  });
});
```

Any imported dependency in `module-to-test` can be replaced by something
else using `replace`. By default, all imports will be reset after each test
using the `afterEach` hook of the test framework.