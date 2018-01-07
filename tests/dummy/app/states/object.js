import EmberObject from '@ember/object';

const State = EmberObject.extend();

State.reopenClass({
  initialState(/* model */) {
    return {};
  }
});

export default State;
