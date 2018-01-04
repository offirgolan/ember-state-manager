/* eslint-env node */
var path = require('path');

module.exports = {
  description: 'Create a new state',

  availableOptions: [
    {
      name: 'type',
      type: ['object', 'array', 'buffered-object', 'buffered-array'],
      default: 'object'
    }
  ],

  install(options) {
    this.options = options;
    return this._super.install.apply(this, arguments);
  },

  uninstall(options) {
    this.options = options;
    return this._super.uninstall.apply(this, arguments);
  },

  filesPath() {
    var dependencies = this.project.dependencies();
    var type = this.options && this.options.type || 'object';

    if (type === 'buffered-object' && !('ember-buffered-proxy' in dependencies)) {
      this.ui.writeLine('Ember-buffered-proxy is not installed. Defaulting back to \'object\'...');
      type = 'object';
    } else if (type === 'buffered-array' && !('ember-buffered-array-proxy' in dependencies)) {
      this.ui.writeLine('Ember-buffered-array-proxy is not installed. Defaulting back to \'array\'...');
      type = 'array';
    }

    return path.join(this.path, type + '-files');
  },

  // TODO: supportsAddon normally calls `files` which means that `filesPath`
  // gets called before options get set. Likely needs to be fixed upstream.
  supportsAddon() {
    return false;
  },
};
