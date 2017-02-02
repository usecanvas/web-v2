import Dexie from 'dexie';
import Ember from 'ember';

export default Ember.Service.extend({
  db: Ember.computed(function() {
    const db = new Dexie('canvas_pro');
    db.version(1).stores({
      snapshots: 'id'
    });
    return db.snapshots;
  }),

  persist(id, blocks) {
    const db = this.get('db');
    const maxSize = 50;
    return db.get(id).then(item => {
      const hist = item ? item.hist.slice(-maxSize) : [];
      hist.push(blocks);
      return db.put({ id, hist });
    });
  }
});
