import { moduleForComponent, test } from 'ember-qunit';
import hbs from 'htmlbars-inline-precompile';
import { getOwner } from '@ember/application';
import { run } from '@ember/runloop';

let stateManager;

moduleForComponent('state-for', 'helper:state-for', {
  integration: true,

  beforeEach() {
    stateManager = getOwner(this).lookup('service:state-manager');
  }
});

test('it works', function(assert) {
  assert.expect(1);

  const model = {};
  const state = stateManager.stateFor(model, 'object');

  this.set('model', model);
  state.set('id', 1);

  this.render(hbs`{{get (state-for model 'object') 'id'}}`);

  assert.equal(this.$().text().trim(), '1');
});

test('it recomputes when the model changes', function(assert) {
  assert.expect(2);

  let model = {};
  let state = stateManager.stateFor(model, 'object');

  this.set('model', model);
  state.set('id', 1);

  this.render(hbs`{{get (state-for model 'object') 'id'}}`);

  assert.equal(this.$().text().trim(), '1');

  model = {};
  state = stateManager.stateFor(model, 'object');

  run(() => {
    this.set('model', model);
    state.set('id', 2);
  });

  assert.equal(this.$().text().trim(), '2');
});

test('it works with bucket name', function(assert) {
  assert.expect(1);

  const model = {};
  const state = stateManager.stateFor(model, 'object', { bucketName: 'params' });

  this.set('model', model);
  state.set('id', 1);

  this.render(hbs`{{get (state-for model 'object' bucketName="params") 'id'}}`);

  assert.equal(this.$().text().trim(), '1');
});
