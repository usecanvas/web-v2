import Ember from 'ember';
export default Ember.Helper.helper(([arr1 = [], arr2 = []]) =>
  arr1.filter(val => !arr2.includes(val))
  .concat(arr2.filter(val => !arr1.includes(val))));
