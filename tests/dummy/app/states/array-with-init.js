import ArrayProxy from '@ember/array/proxy';

const State = ArrayProxy.extend();

State.reopenClass({
  initialState(/* model */) {
    return { content: [1, 2, 3] };
  }
});

export default State;
