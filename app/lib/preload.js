import Ember from 'ember';
import RSVP from 'rsvp';

const { get, isArray, typeOf } = Ember;

export default function preload(object, toPreload) {
  return RSVP.resolve(object).then(result => {
    if (isArray(result)) {
      return preloadAll(result, toPreload);
    }

    return preloadRecord(result, toPreload);
  });
}

function preloadAll(records, toPreload) {
  return RSVP.all(records.map(record => preload(record, toPreload)));
}

function preloadRecord(record, toPreload) {
  if (!record) return RSVP.resolve(record);

  const type = typeOf(toPreload);

  switch (type) {
    case 'string':
      return getPromise(record, toPreload).then(_ => record);
    case 'array':
      return RSVP.all(toPreload.map(preloadItem => {
        return preloadRecord(record, preloadItem);
      })).then(_ => record);
    case 'object':
      return RSVP.all(Object.keys(toPreload).map(preloadKey => {
        return getPromise(record, preloadKey).then(data => {
          return preload(data, toPreload[preloadKey]);
        });
      })).then(_ => record);
    default:
      throw new Error(`Inrecognized preload type: "${type}"`);
  }
}

function getPromise(object, property) {
  return RSVP.resolve(get(object, property));
}
