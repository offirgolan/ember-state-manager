/* eslint-env node */
module.exports = {
  description: 'Create a new state definition',

  filesPath(options) {
    var allowedTypes = ['object', 'array', 'buffered-object', 'buffered-array'];
    var type = options.entity.options.type;

    if (allowedTypes.indexOf(type) > -1) {
      return type + '-files';
    }

    return 'object-files';
  }
};
