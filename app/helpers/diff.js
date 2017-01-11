import Ember from 'ember';
export default Ember.Helper.helper(([arr1 = [], arr2 = []]) =>
  arr2.filter(val => !arr1.includes(val)));
