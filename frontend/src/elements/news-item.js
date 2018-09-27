import {CoreElement} from '../core/CoreElement';
import {html} from '@polymer/polymer/polymer-element.js';
import {config} from '../../config/config';
import '@polymer/paper-ripple';
import {LegacyElementMixin} from '@polymer/polymer/lib/legacy/legacy-element-mixin';

class NewsItem extends LegacyElementMixin(CoreElement) {
  static get template() {
    return html`<style>
    :host {
        display: inline-flex;
        flex-grow: 1;
        background: #dcd8d86e;
        margin: 12px;
        border-radius: 12px;
        box-sizing: border-box;
        overflow: hidden;
        box-shadow: 0 2px 5px 0 rgba(0, 0, 0, 0.26);
        position: relative;
        touch-action: pan-y !important;
    }

    .img {
        display: inline-flex;
        min-width: 120px;
        max-width: 120px;
        height: 120px;
        background-repeat: no-repeat;
        background-position: center;
        background-size: cover;
    }

    .title {
        font-size: 14px;
        padding: 12px;
        font-family: "medium_caps";
        font-weight: 600;
        display: -webkit-box;
        -webkit-line-clamp: 3;
        -webkit-box-orient: vertical;
        overflow: hidden;
        max-height: 28px;
        line-height: 1;
    }

    paper-ripple {
        border-radius: 2px;
        overflow: hidden;
        color: white;
    }

    .details-container {
        display: flex;
        flex-direction: column;
        justify-content: space-between;
        flex-grow: 1;
    }

    .bottom {
        display: flex;
        padding: 12px;
        font-family: "BPG Nino Mtavruli";
        justify-content: space-between;
        align-items: center;
    }

    .bottom .time {
        font-size: 12px;
    }
    :host([grid-view]) .details-container{
        flex-grow: 1;
        z-index: 1;
        color: white;
    }
    :host([grid-view]) .img{
        position: absolute;
        max-width: unset;
        width: 100%;
    }
    :host([grid-view]) paper-ripple{
    background: #2e4e84a3;
    }
    
</style>
<div class="details-container">
    <span class="title">[[title]]</span>
    <div class="bottom">
        <span class="icon">icon</span>
        <span class="time">[[_getFormatedDate(publish)]]</span>
    </div>
</div>
<div class="img"
     style="background-image: url([[img]])"></div>
<paper-ripple></paper-ripple>

    `;
  }

  _fileUrl() {
    return config.api;
  }

  _getFormatedDate(value) {
    return new Date(value).toDateString();
  }
}

customElements.define('news-item', NewsItem);
