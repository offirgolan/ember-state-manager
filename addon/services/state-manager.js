import Ember from 'ember';
import Service from '@ember/service';
import { getOwner } from '@ember/application';
import { computed, get } from '@ember/object';
import { isNone, isEmpty } from '@ember/utils';
import { assert } from '@ember/debug';

const {
  canInvoke,
  WeakMap
} = Ember;

export default Service.extend({
  _stateMaps: computed(() => ({})).readOnly(),

  stateMapFor(stateName, bucketName) {
    assert(`[ember-state-manager] You must pass a state name into 'stateMapFor'`, !isNone(stateName));

    const stateMaps = get(this, '_stateMaps');
    const key = isEmpty(bucketName) ? stateName : `${stateName}|${bucketName}`;

    if (!stateMaps[key]) {
      stateMaps[key] = new WeakMap();
    }

    return stateMaps[key];
  },

  stateFor(model, stateName, options = {}) {
    assert(`[ember-state-manager] You must pass a state name into 'stateFor'`, !isNone(stateName));

    const { bucketName, createWithoutModel = false } = options;
    const stateMap = this.stateMapFor(stateName, bucketName);

    if (isNone(model)) {
      return createWithoutModel ? this._createStateFor(stateName) : model;
    }

    if (!stateMap.has(model)) {
      stateMap.set(model, this._createStateFor(stateName, model));
    }

    return stateMap.get(model);
  },

  _createStateFor(stateName, model) {
    const factory = getOwner(this).factoryFor(`state:${stateName}`);
    const initialState = canInvoke(factory.class, 'initialState') ? factory.class.initialState(model) : {};

    return factory.create(initialState);
  }
});
