import {html} from '@polymer/polymer/polymer-element.js';
import './shared-styles.js';
import '@polymer/app-route/app-route.js';
import {CoreElement} from './core/CoreElement';
import 'idb/lib/idb';

class ArticlePage extends CoreElement {
  static get template() {
    return html`
      <style include="shared-styles">
        :host {
          display: block;

          padding: 10px;
        }
      </style>
       <app-route route="{{route}}" pattern="[[basePath]]:articleId" data="{{routeData}}" tail="{{subroute}}">
      </app-route>
      [[articleId]]
      <h4 class="title">[[title]]</h4>
      <div id="fullText"></div>
    `;
  }

  static get properties() {
    return {
      articleId: {
        type: String,
        reflectToAttribute: true,
        observer: '_articleIdChanged',
      },
      routeData: Object,
      subroute: Object,
      basePath: {
        type: String,
        reflectToAttribute: true,
      },
    };
  }

  static get observers() {
    return [
      '_routePageChanged(routeData.articleId)',
    ];
  }

  _routePageChanged(articleId) {
    this.articleId = articleId;
  }

  _articleIdChanged(articleId) {
    if (!articleId) return;
    let articleObj = localStorage.getItem(articleId);
    if (articleObj) {
      articleObj = JSON.parse(articleObj);
      this.title = articleObj.title;
      this.$.fullText.innerHTML = articleObj.fullText;
      localStorage.removeItem(articleId);
    }
  }

  ready() {
    super.ready();
    return;
    this.dbPromise = idb.open('couches-n-things', 4, function(upgradeDb) {
      switch (upgradeDb.oldVersion) {
        case 0:
          // a placeholder case so that the switch block will
          // execute when the database is first created
          // (oldVersion is 0)
        case 1:
          console.log('Creating the products object store');
          upgradeDb.createObjectStore('products', {keyPath: 'id'});
          break;
          // TODO 4.1 - create 'name' index
        case 2:
          console.log('Creating a name index');
          var store = upgradeDb.transaction.objectStore('products');
          store.createIndex('name', 'name', {unique: true});

          // TODO 4.2 - create 'price' and 'description' indexes
        case 3:
          console.log('Creating a name index');
          var store = upgradeDb.transaction.objectStore('products');
          store.createIndex('price', 'price', {});
          store.createIndex('description', 'description', {});
          // TODO 5.1 - create an 'orders' object store

      }
    });

  }

  addProducts() {
    this.dbPromise.then((db) => {
      let tx = db.transaction('products', 'readwrite').catch(() => {
      });
      let store = tx.objectStore('products');
      let items = [
        {
          name: 'Couch',
          id: 'cch-blk-ma',
          price: 499.99,
          color: 'black',
          material: 'mahogany',
          description: 'A very comfy couch',
          quantity: 3,
        },
        {
          name: 'Armchair',
          id: 'ac-gr-pin',
          price: 299.99,
          color: 'grey',
          material: 'pine',
          description: 'A plush recliner armchair',
          quantity: 7,
        },
        {
          name: 'Stool',
          id: 'st-re-pin',
          price: 59.99,
          color: 'red',
          material: 'pine',
          description: 'A light, high-stool',
          quantity: 3,
        },
        {
          name: 'Chair',
          id: 'ch-blu-pin',
          price: 49.99,
          color: 'blue',
          material: 'pine',
          description: 'A plain chair for the kitchen table',
          quantity: 1,
        },
        {
          name: 'Dresser',
          id: 'dr-wht-ply',
          price: 399.99,
          color: 'white',
          material: 'plywood',
          description: 'A plain dresser with five drawers',
          quantity: 4,
        },
        {
          name: 'Cabinet',
          id: 'ca-brn-ma',
          price: 799.99,
          color: 'brown',
          material: 'mahogany',
          description: 'An intricately-designed, antique cabinet',
          quantity: 11,
        },
      ];
      return Promise.all(items.map((item) => {
            console.log('Adding item: ', item);
            return store.add(item);
          }),
      ).catch(function(e) {
        tx.abort();
        console.log(e);
      }).then(function() {
        console.log('All items added successfully!');
      });
    }).catch(() => {

    });
  }

  getByName(name) {
    return this.dbPromise.then(function(db) {
      let tx = db.transaction('products', 'readonly');
      let store = tx.objectStore('products');
      let index = store.index('name');
      return index.get(name);
    });
  }

  getItemsWithinPriceRange(low, high) {
    let lower = low;
    let upper = high;
    let lowerNum = Number(low);
    let upperNum = Number(high);

    if (lower === '' && upper === '') {
      return;
    }
    let range;
    if (lower !== '' && upper !== '') {
      range = IDBKeyRange.bound(lowerNum, upperNum);
    } else if (lower === '') {
      range = IDBKeyRange.upperBound(upperNum);
    } else {
      range = IDBKeyRange.lowerBound(lowerNum);
    }
    let s = '';
    this.dbPromise.then((db) => {
      let tx = db.transaction('products', 'readonly');
      let store = tx.objectStore('products');
      let index = store.index('price');
      return index.openCursor(range);
    }).then(function showRange(cursor) {
      if (!cursor) {
        return;
      }
      console.log('Cursored at:', cursor.value.name);
      s += '<h2>Price - ' + cursor.value.price + '</h2><p>';
      for (let field in cursor.value) {
        s += field + '=' + cursor.value[field] + '<br/>';
      }
      s += '</p>';
      return cursor.continue().then(showRange);
    }).then(function() {
      if (s === '') {
        s = '<p>No results.</p>';
      }
      console.log(s);
    });
  }

  static get is() {
    return 'article-page';
  }
}

window.customElements.define(ArticlePage.is, ArticlePage);
