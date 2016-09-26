import Ember from 'ember';

export default {
  name: 'sharedb-fuzz',

  initialize() {
    window.shareDBFuzz = shareDBFuzz;
    window.shareDBFuzzBurst = shareDBFuzzBurst;
  }
};

function shareDBFuzz() {
  const firstBlock = Ember.$('.canvas-block-paragraph-content').get(0);
  const $firstBlock = Ember.$(firstBlock);
  $firstBlock.text(`${$firstBlock.text()}X `);
  $firstBlock.trigger('input');
}

function shareDBFuzzBurst(interval = 10, duration = 5000) {
  const intervalID = window.setInterval(shareDBFuzz, interval);
  setTimeout(_ => window.clearInterval(intervalID), duration);
}
