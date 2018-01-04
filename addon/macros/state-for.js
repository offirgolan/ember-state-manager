import { computed } from '@ember/object';
import { getOwner } from '@ember/application';
import { assert } from '@ember/debug';

export default function stateFor(modelKey, ...args) {
  return computed(modelKey, function() {
    const owner = getOwner(this);

    assert(`[ember-state-manager] The stateFor macro must be used on an object that has owner access.`, owner);

    return owner
      .lookup('service:state-manager')
      .stateFor(this.get(modelKey), ...args);
  });
}
