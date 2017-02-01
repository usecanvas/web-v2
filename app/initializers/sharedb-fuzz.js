import Ember from 'ember';
import Base62UUID from 'canvas-editor/lib/base62-uuid';

export default {
  name: 'sharedb-fuzz',

  initialize() {
    window.shareDBFuzz = shareDBFuzz;
    window.shareDBFuzzBurst = shareDBFuzzBurst;
  }
};

function shareDBFuzz(text) {
  const firstBlock  = Ember.$('.canvas-block-paragraph-content').get(0);
  const $firstBlock = Ember.$(firstBlock);

  $firstBlock.text(`${$firstBlock.text()}${text} `);
  $firstBlock.trigger('input');
}

function shareDBFuzzBurst(interval = 10, duration = 5000) {
  const id  = Base62UUID.generate();
  let index = 0;

  const intervalID = window.setInterval(_ => {
    shareDBFuzz(`${id}.${index}`);
    index += 1;
  }, interval);

  setTimeout(_ => window.clearInterval(intervalID), duration);

  console.info(`Fuzzing as: ${id}`); // eslint-disable-line no-console
}
