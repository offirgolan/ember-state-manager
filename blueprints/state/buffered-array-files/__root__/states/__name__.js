import BufferedArrayProxy from 'ember-buffered-array-proxy/proxy';

const State = BufferedArrayProxy.extend();

State.reopenClass({
  initialState(/* model */) {
    return { content: [] };
  }
});

export default State;
