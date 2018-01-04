import ArrayProxy from '@ember/array/proxy';

const State = ArrayProxy.extend();

State.reopenClass({
  initialState(/* model */) {
    return { content: [] };
  }
});

export default State;
