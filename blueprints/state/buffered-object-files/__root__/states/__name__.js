import BufferedObjectProxy from 'ember-buffered-proxy/proxy';

const State = BufferedObjectProxy.extend();

State.reopenClass({
  initialState(/* model */) {
    return { content: {} };
  }
});

export default State;
