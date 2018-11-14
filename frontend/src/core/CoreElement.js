import {PolymerElement} from '@polymer/polymer/polymer-element.js';
import {config} from '../../config/config';

export class CoreElement extends PolymerElement {

  callApi(
      url, queryData = '', type = 'html', method = 'get',
      data) {
    let options = {};
    if (method !== 'get') {
      if (type === 'json') {
        options.headers = {
          'Content-Type': 'application/json; charset=utf-8',
        };
        options.body = JSON.stringify(data);
      } else {
        options.headers = {
          'Content-Type': 'application/x-www-form-urlencoded',
        };
        let formData = new FormData();
        data.forEach((key, value) => {
          formData.append(key, value);
        });
        options.body = formData;
      }
    }

    return fetch(config.api + url, options).then((response) => {
      if (response.ok) {
        return response.json();
      } else {
        throw new Error('Server response wasn\'t OK');
      }
    }).then(result => {
      if (queryData)
        this.set(queryData, result);
      return result;
    }).catch((e) => {
      console.log(e);
    });

  }

  redirectTo(url) {
    window.history.pushState({}, null, url);
    window.dispatchEvent(new CustomEvent('location-changed'));
  }

}
