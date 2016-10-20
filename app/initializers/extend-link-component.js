import Ember from 'ember';

const { computed, get } = Ember;

/*
 * Overriding href property to accomodate fragments.
 * https://github.com/emberjs/ember.js/blob/8c0eb283dae5dbdd0af4db585def294f9a289996/packages/ember-htmlbars/lib/components/link-to.js#L705-L716
 */
export default {
  name: 'extend-link-component',

  initialize() {
    Ember.LinkComponent.reopen({
      href: computed('models', 'qualifiedRouteName', function computeLinkToComponentHref() {
        if (get(this, 'tagName') !== 'a') { return; }

        let qualifiedRouteName = get(this, 'qualifiedRouteName');
        let models = get(this, 'models');

        if (get(this, 'loading')) { return get(this, 'loadingHref'); }

        let routing = get(this, '_routing');
        let queryParams = get(this, 'queryParams.values');
        const url = routing.generateURL(qualifiedRouteName, models, queryParams);
        const fragment = get(this, 'fragment');

        if (fragment) return `${url}#${fragment}`;
        return url;
      })
    });
  }
}
