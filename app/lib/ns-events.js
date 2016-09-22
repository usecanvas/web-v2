import Ember from 'ember';

export default function nsEvents(object, events) {
  return events.split(' ').map(event => {
    return `${event}.${Ember.guidFor(object)}`;
  }).join(' ');
}
