import Inflector from 'ember-inflector';

const inflector = Inflector.inflector;

inflector.irregular('canvas', 'canvases');

// Meet Ember Inspector's expectation of an export
export default {};
