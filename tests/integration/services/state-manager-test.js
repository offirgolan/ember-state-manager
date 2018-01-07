import { moduleFor, test } from 'ember-qunit';
import EmberObject from '@ember/object';
import ArrayProxy from '@ember/array/proxy';

moduleFor('service:state-manager', {
  integration: true,
});

test('it retrieves a state object', function(assert) {
  assert.expect(2);

  const stateManager = this.subject();

  assert.ok(stateManager.stateFor({}, 'object') instanceof EmberObject);
  assert.ok(stateManager.stateFor([], 'array') instanceof ArrayProxy);
});

test('it creates a state object with initial state', function(assert) {
  assert.expect(3);

  const stateManager = this.subject();
  const model = {};
  const objState = stateManager.stateFor(model, 'object-with-init');
  const arrayState = stateManager.stateFor(model, 'array-with-init');

  assert.equal(objState.get('model'), model);
  assert.equal(objState.get('foo'), 'foo');
  assert.deepEqual(arrayState.toArray(), [1,2,3]);
});

test('it retrieves the same state for the same model', function(assert) {
  assert.expect(3);

  const stateManager = this.subject();
  const model = {};

  assert.equal(stateManager.stateFor(model, 'object'), stateManager.stateFor(model, 'object'));
  assert.notEqual(stateManager.stateFor(model, 'object'), stateManager.stateFor({}, 'object'));
  assert.equal(stateManager.stateFor(model, 'array'), stateManager.stateFor(model, 'array'));
});

test('it creates bucketed states', function(assert) {
  assert.expect(2);

  const stateManager = this.subject();
  const model = {};

  assert.notEqual(stateManager.stateFor(model, 'object', { bucketName: 'a' }), stateManager.stateFor(model, 'object'), { bucketName: 'b' });
  assert.notEqual(stateManager.stateFor(model, 'object', { bucketName: 'a' }), stateManager.stateFor(model, 'object'), { bucketName: 'a' });
});

test('it handles a falsy model', function(assert) {
  assert.expect(1);

  const stateManager = this.subject();
  assert.notOk(stateManager.stateFor(null, 'object'));
});

test('it returns a state object with a falsy model and createWithoutModel is enabled', function(assert) {
  assert.expect(2);

  const stateManager = this.subject();
  assert.notOk(stateManager.stateFor(null, 'object'));
  assert.ok(stateManager.stateFor(null, 'object', { createWithoutModel: true }));
});

test('it requires a state name', function(assert) {
  assert.expect(1);

  const stateManager = this.subject();
  assert.throws(() => stateManager.stateFor({}));
});

test('it throws if it cannot find the state factory', function(assert) {
  assert.expect(1);

  const stateManager = this.subject();
  assert.throws(() => stateManager.stateFor({}, '__foo__'));
});
