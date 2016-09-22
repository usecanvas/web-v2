import Ember from 'ember';

export default function nsEvents(object, events) {
  const guid = Ember.guidFor(object);
  return events.split(' ').map(event => `${event}.${guid}`).join(' ');
}
