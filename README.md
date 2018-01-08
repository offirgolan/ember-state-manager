# Ember State Manager

[![Build Status](https://travis-ci.org/offirgolan/ember-state-manager.svg?branch=master)](https://travis-ci.org/offirgolan/ember-state-manager)
[![npm version](https://badge.fury.io/js/ember-state-manager.svg)](http://badge.fury.io/js/ember-state-manager)

An Ember.JS state management solution that is built upon the ideals of
[ember-state-services](https://github.com/stefanpenner/ember-state-services).

> State management is one of the most complex aspects of large application design and when done wrong often leads to bugs and errors. EmberJS contains 2 high-level avenues for storing state: controllers (long-term state) and components (short-term state). Controllers are singletons and any state you set on them will stay there until your application is reloaded or you override the previous value. Components on the other hand are created and destroyed as they enter/leave the DOM and any state that is set on them will be removed/reset each time they are recreated. As you build more complex applications you will find yourself needing a way to have some sort of middle ground solution. Something that has properties of both long-term state and short-term state.

## Features

- Easily handle complex state
- Access your states from anywhere via a service, template helper, or CP macro
- Ember generator to create Object, Array, Buffered Object, and Buffered Array type states
- State bucketing

## Installation

```
ember install ember-state-manager
```

## Helpful Links

- ### [Changelog](CHANGELOG.md)

## Looking for help?
If it is a bug [please open an issue on GitHub](http://github.com/offirgolan/ember-state-manager/issues).

## Setup

The first thing you will need to do is create your state file(s). All states are expected
to be under `app/states` and must export an Ember (like) Object. This addon ships with
a blueprint to make this pretty easy.

```bash
ember generate state <name> <options...>
    Create a new state
    --type (object, array, buffered-object, buffered-array)
```

```bash
# Create a state named 'foo' that is an Object
ember generate state foo
ember generate state foo --type=object

# Create a state named 'foo' that is an Array
ember generate state foo --type=array

# Create a state named 'foo' that is a Buffered Object Proxy (requires ember-buffered-proxy to be installed)
ember generate state foo --type=buffered-object

# Create a state named 'foo' that is a Buffered Array Proxy (requires ember-buffered-array-proxy to be installed)
ember generate state foo --type=buffered-array
```

Once you run the generate command, you will see a new file has been created:

```js
// app/states/foo.js
import EmberObject from '@ember/object';

const State = EmberObject.extend();

State.reopenClass({
  initialState(/* model */) {
    return {};
  }
});

export default State;
```

## Usage

You can access a state via the provided service, template helper, or computed macro.

### The `stateManager` Service

This service gives you full control on accessing and deleting states.

#### Method - `stateFor`

Returns a state object for the given model with the specified state (file) name.

```ts
function stateFor(model: Object, stateName: String, options: Object);
```

Available Options:

- `bucketName: String`: The bucket name to store the state under (optional)
- `createWithoutModel: Boolean`: Whether to return a valid
state object even if the model is falsy (defaulted to false).

```js
// Example Usage
this.get('stateManager').stateFor(model, '<STATE_NAME>', { bucketName: '<BUCKET_NAME>', createWithoutModel: true });
```

#### Method - `deleteStateFor`

Delete the state object for the given model with the specified state (file) name.
Calling `stateFor` after this method will return a new state object.

```ts
function deleteStateFor(model: Object, stateName: String, options: Object);
```

Available Options:

- `bucketName<String>`: The bucket name to store the state under (optional)

```js
// Example Usage
this.get('stateManager').stateFor(model, '<STATE_NAME>', { bucketName: '<BUCKET_NAME>' }); // old state
this.get('stateManager').deleteStateFor(model, '<STATE_NAME>', { bucketName: '<BUCKET_NAME>' });
this.get('stateManager').stateFor(model, '<STATE_NAME>', { bucketName: '<BUCKET_NAME>' }); // new state
```

### The `{{state-for}}` Template Helper

You can access a state in your templates via the `{{state-for}}` helper which is a
proxy to `stateManager.stateFor`.

```hbs
{{state-for model stateName bucketName=bucketName createWithoutModel=createWithoutModel}}
```

```hbs
{{-- Example --}}

{{#with (state-for model '<STATE_NAME>' bucketName='<BUCKET_NAME>') as |state|}}
  {{#if state.isEditing}}
    Editing...
  {{/if}}
{{/with}}
```

### The `stateFor` Computed Macro

This addon provides a simple computed property macro which is a proxy to
`stateManager.stateFor`.

**Note: This macro requires container/owner access.**

```js
import Component from '@ember/component';
import { stateFor } from 'ember-state-manager';

export default Component.extend({
  model: null,

  /*
  * `stateFor` returns a computed property that provides a given
  * state object based on the 'model' property. Whenever model
  * changes a new state object will be returned.
  */
  state: stateFor('model', '<STATE_NAME>', { bucketName: '<BUCKET_NAME>', createWithoutModel: true })
})
```

## Advanced Usage

### Initial State

In your state file, you can use the `initialState` to setup your state object with
initial values.

```js
// app/states/foo.js
import EmberObject from '@ember/object';

const State = EmberObject.extend();

State.reopenClass({
  initialState(/* model */) {
    return {
      text: '',
      isEditing: false
    };
  }
});

export default State;
```

### State Bucketing

State bucketing can be super handy if you want to create multiple states for the same
model / stateName combo. Lets say we create a default buffered object state:

```js
// app/states/buffered-object.js
import BufferedObjectProxy from 'ember-buffered-proxy/proxy';

const State = BufferedObjectProxy.extend();

State.reopenClass({
  initialState(model) {
    // Our state now becomes a buffer of the model!
    return { content: model };
  }
});

export default State;
```

We can create multiple long lived buffers for the same model.

```js
const bufferA = stateManager.stateFor(model, 'buffered-object', { bucketName: 'A' });
const bufferB = stateManager.stateFor(model, 'buffered-object', { bucketName: 'B' });
```

We can make changes to either buffers, display them to the user, and let them
select which one they like. Once selected, we can apply the changes and save the model.

### Validations & Buffers

We can easily create a validation backed buffered object so we can validate changes
before we apply them.

```js
// app/states/validated-buffered-object.js
import BufferedObjectProxy from 'ember-buffered-proxy/proxy';
import { buildValidations, validator } from 'ember-cp-validations';

const Validations = buildValidations({ /* ... */ });
const State = BufferedObjectProxy.extend(Validations);

State.reopenClass({
  initialState(model) {
    // Our state now becomes a buffer of the model!
    return { content: model };
  }
});

export default State;
```

```js
const buffer = stateManager.stateFor(model, 'validated-buffered-object');
await buffer.validate();

if (buffer.get('validations.isValid')) {
  buffer.applyChanges();
  buffer.get('content').save();
}
```
