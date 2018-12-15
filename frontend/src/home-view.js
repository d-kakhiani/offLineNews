import './shared-styles.js';
import {CoreElement} from './core/CoreElement';
import {html} from '@polymer/polymer/polymer-element.js';
import './elements/news-item';
import {config} from '../config/config';

class HomeView extends CoreElement {
  static get template() {
    return html`<style include="shared-styles">
    :host {
        display: flex;
        flex-direction: column;
    }

    .container {
        display: flex;
        flex-direction: column;
        justify-content: stretch;
        flex-grow: 1;
        overflow-x: hidden;

    }

    :host([grid-view]) .container {
        display: grid;
        grid-template-columns: 1fr 1fr;
    }
</style>
<div class="container">
    <template is="dom-repeat" items="{{_newsList}}">
        <news-item
                item-id="[[item._id]]"
                title="[[item.title]]"
                on-click="_getFullText"
                img="[[filesEndPoint]]/files/images/?url=[[item.thumb]]"
                publish="[[item.publish_up]]"
                source="[[item.source]]"
                on-delete="_deleteThisItem"
                grid-view$="[[gridView]]">
        </news-item>
    </template>
</div>
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
      filesEndPoint: {
        type: String,
        value: config.filesEndPoint,
      },
    };
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
      // items= [
      //   {
      //     title: 'Hello',
      //     _id: 'dkusa',
      //     thumb: 'https://www.google.com/images/branding/googlelogo/2x/googlelogo_color_272x92dp.png',
      //     publish_up: '2018-12-13T14:56:01.860Z',
      //     source: 'ambebi',
      //   }, {
      //     title: 'Hello',
      //     _id: 'dkusa',
      //     thumb: 'https://www.google.com/images/branding/googlelogo/2x/googlelogo_color_272x92dp.png',
      //     publish_up: '2018-12-13T14:56:01.860Z',
      //     source: 'ambebi',
      //   }, {
      //     title: 'Hello',
      //     _id: 'dkusa',
      //     thumb: 'https://www.google.com/images/branding/googlelogo/2x/googlelogo_color_272x92dp.png',
      //     publish_up: '2018-12-13T14:56:01.860Z',
      //     source: 'ambebi',
      //   }, {
      //     title: 'Hello',
      //     _id: 'dkusa',
      //     thumb: 'https://www.google.com/images/branding/googlelogo/2x/googlelogo_color_272x92dp.png',
      //     publish_up: '2018-12-13T14:56:01.860Z',
      //     source: 'ambebi',
      //   },
      //   {
      //     title: 'Hello',
      //     _id: 'dkusa',
      //     thumb: 'https://www.google.com/images/branding/googlelogo/2x/googlelogo_color_272x92dp.png',
      //     publish_up: '2018-12-13T14:56:01.860Z',
      //     source: 'ambebi',
      //   },{
      //     title: 'Hello',
      //     _id: 'dkusa',
      //     thumb: 'https://www.google.com/images/branding/googlelogo/2x/googlelogo_color_272x92dp.png',
      //     publish_up: '2018-12-13T14:56:01.860Z',
      //     source: 'ambebi',
      //   },{
      //     title: 'Hello',
      //     _id: 'dkusa',
      //     thumb: 'https://www.google.com/images/branding/googlelogo/2x/googlelogo_color_272x92dp.png',
      //     publish_up: '2018-12-13T14:56:01.860Z',
      //     source: 'ambebi',
      //   },{
      //     title: 'Hello',
      //     _id: 'dkusa',
      //     thumb: 'https://www.google.com/images/branding/googlelogo/2x/googlelogo_color_272x92dp.png',
      //     publish_up: '2018-12-13T14:56:01.860Z',
      //     source: 'ambebi',
      //   },{
      //     title: 'Hello',
      //     _id: 'dkusa',
      //     thumb: 'https://www.google.com/images/branding/googlelogo/2x/googlelogo_color_272x92dp.png',
      //     publish_up: '2018-12-13T14:56:01.860Z',
      //     source: 'ambebi',
      //   },{
      //     title: 'Hello',
      //     _id: 'dkusa',
      //     thumb: 'https://www.google.com/images/branding/googlelogo/2x/googlelogo_color_272x92dp.png',
      //     publish_up: '2018-12-13T14:56:01.860Z',
      //     source: 'ambebi',
      //   },
      // ];
      if (!items) return;
      this._noMoreData = (items.length === 0);
      if (append) {
        this.push('_newsList', ...items);
      } else {
        this._newsList = items;
      }
    });
  }

  _getFullText(event) {
    let item = event.model.item;
    localStorage.setItem(item._id, JSON.stringify(item));
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

  _deleteThisItem(e) {
    let index = e.model.index;
    this.splice('_newsList', index, 1);
  }

}

customElements.define('home-view', HomeView);
