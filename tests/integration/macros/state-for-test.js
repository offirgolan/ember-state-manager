import { stateFor } from 'ember-state-manager';
import { moduleFor, test } from 'ember-qunit';
import { getOwner } from '@ember/application';
import EmberObject from '@ember/object';

let owner;

function createDummyObject(extend = {}, create = {}) {
  return EmberObject
          .extend(extend)
          .create(owner.ownerInjection(), create);
}

moduleFor('macro:state-for', {
  integration: true,

  beforeEach() {
    owner = getOwner(this);
  }
});

test('it works', function(assert) {
  assert.expect(2);

  const obj = createDummyObject({
    state: stateFor('model', 'object')
  });

  assert.notOk(obj.get('state'));
  obj.set('model', {});
  assert.ok(obj.get('state'));
});

test('it works with options', function(assert) {
  assert.expect(6);

  const obj = createDummyObject({
    stateA: stateFor(
      'model',
      'object',
      { bucketName: 'a', createWithoutModel: true}
    ),
    stateB: stateFor(
      'model',
      'object',
      { bucketName: 'b', createWithoutModel: true}
    )
  });

  assert.ok(obj.get('stateA'));
  assert.ok(obj.get('stateB'));
  assert.notEqual(obj.get('stateA'), obj.get('stateB'));

  obj.set('model', {});

  assert.ok(obj.get('stateA'));
  assert.ok(obj.get('stateB'));
  assert.notEqual(obj.get('stateA'), obj.get('stateB'));});

test('it requires an owner', function(assert) {
  assert.expect(1);

  const obj = EmberObject.extend({
    state: stateFor('model', 'object')
  }).create();

  assert.throws(() => obj.get('state'));
});
