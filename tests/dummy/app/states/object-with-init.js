import EmberObject from '@ember/object';

const State = EmberObject.extend();

State.reopenClass({
  initialState(model) {
    return {
      model,
      foo: 'foo',
      bar: 'bar'
    };
  }
});

export default State;
