import './shared-styles.js';
import {CoreElement} from './core/CoreElement';
import {html} from '@polymer/polymer/polymer-element.js';
import './elements/news-item';
import '@polymer/iron-swipeable-container';

class HomeView extends CoreElement {
  static get template() {
    return html`<style include="shared-styles">
    :host {
        display: flex;
        flex-direction: column;
    }
    .container{
        display: flex;
        flex-direction: column;
        justify-content: stretch;
       flex-grow: 1;
    overflow-x: hidden;

    }
    :host([grid-view]) .container{
        display: grid;
        grid-template-columns: 1fr 1fr;
    }
</style>
    
    <iron-swipeable-container class="container" id="swiper" swipe-style="[[swipeStyle]]">
    <template is="dom-repeat" items="{{_newsList}}">
          <news-item 
                title="[[item.title]]" 
                img="/files/images/?url=[[item.thumb]]" 
                publish="[[item.publish_up]]"
                grid-view$="[[gridView]]">
          </news-item>
    </template>
</iron-swipeable-container>
      <div id="loadMore" class="loadMore"></div>
    
    `;
  }

  static get properties() {
    return {
      skip: {
        type: Number,
        value: 0,
      },
      take: {
        type: Number,
        value: 10,
      },
      _newsList: {
        type: Array,
        notify: true,
        value: [],
      },
      gridView: {
        type: Boolean,
        reflectToAttribute: true,
      },
      swipeStyle: {
        type: String,
        computed: '_swipeStyleComputed(gridView)',
      },
    };
  }

  _swipeStyleComputed(view) {
    if (view) return 'curve';
    return 'horizontal';
  }

  ready() {
    super.ready();
    let options = {
      root: null,
      rootMargin: '60%',
    };
    this._newsDataObserver = new IntersectionObserver(
        this._observerHandler.bind(this),
        options);
    this._newsDataObserver.observe(this.$.loadMore);
  }

  _loadData(append = true) {
    if (this._noMoreData) return;
    this._getData(this.skip, this.take).then((items) => {
      if (!items) return;
      this._noMoreData = (items.length === 0);
      if (append) {
        this.push('_newsList', ...items);
      } else {
        this._newsList = items;
      }
    });
  }

  _observerHandler(entries, observer) {
    if (entries && entries[0].intersectionRatio <= 0) {
      return;
    }

    this._loadData(!(this.skip === 0));
    this.skip += this.take;

  }

  _getData(skip = 0, take = 10) {
    return this.callApi(`?skip=${skip}&take=${take}`);
  }

  _fixSwiper() {
    this.$.swiper._addListeners = (node) => {
      if (node.nodeType === Node.TEXT_NODE || node.nodeType ===
          Node.COMMENT_NODE)
        return;
      // Set up the animation.
      node.style.transitionProperty = this.$.swiper._transitionProperty;
      node.style.transition = this.$.swiper.transition;

      this.$.swiper.listen(node, 'track', '_onTrack');
      this.$.swiper.setScrollDirection('y', node);
      this.$.swiper.listen(node, 'transitionend', '_onTransitionEnd');
    };
  }

}

customElements.define('home-view', HomeView);
