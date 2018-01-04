import Helper from '@ember/component/helper';
import { inject as service } from '@ember/service';
import { get } from '@ember/object';

export default Helper.extend({
  stateManager: service(),

  compute([ model, stateName ], options = {}) {
    return get(this, 'stateManager').stateFor(model, stateName, options);
  }
});
