import {CoreElement} from '../core/CoreElement';
import {html} from '@polymer/polymer/polymer-element.js';
import {config} from '../../config/config';
import {afterNextRender} from '@polymer/polymer/lib/utils/render-status.js';

class NewsItem extends CoreElement {
  static get template() {
    return html`<style>
    :host {
        display: flex;
        overflow: hidden;
    }

    .wrapper > * {
        scroll-snap-align: center;
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

    :host([grid-view]) .details-container {
        flex-grow: 1;
        z-index: 1;
        color: white;
    }

    :host([grid-view]) .img {
        position: absolute;
        max-width: unset;
        width: 100%;
    }

    :host([grid-view]) paper-ripple {
        background: #2e4e84a3;
    }

    .icon {
        width: 70px;
        height: 20px;
        background-size: contain;
        background-repeat: no-repeat;
        background-position: center;
    }

    .container {
        display: inline-flex;
        flex-grow: 1;
        background: #dcd8d86e;
        margin: 12px;
        border-radius: 12px;
        box-sizing: border-box;
        overflow: hidden;
        box-shadow: 0 2px 5px 0 rgba(0, 0, 0, 0.26);
        position: relative;
        min-width: calc(100vw - 24px);
        max-width: calc(100vw - 24px);
        contain: paint;
    }

    .left, .right {
        min-width: 100vw;
        height: 120px;
    }

    .wrapper {
        height: 100%;
        margin-bottom: -50px; /* maximum width of scrollbar */
        padding-bottom: 50px; /* maximum width of scrollbar */
        overflow-y: hidden;
        overflow-x: scroll;
        /*touch-action: pan-y !important;*/
        scroll-snap-type: mandatory;
        scroll-snap-points-y: repeat(100vw);
        scroll-snap-type: x mandatory;
        display: flex;
        overflow-x: scroll;
        contain: paint;
    }

</style>
<div class="wrapper" id="wrapper">
    <div class="left"></div>
    <div class="container">
        <div class="details-container">
            <span class="title">[[title]]</span>
            <div class="bottom">
                <span class="icon" style="background-image: url('[[_icon]]')"></span>
                <span class="time">[[_getFormatedDate(publish)]]</span>
            </div>
        </div>
        <div class="img"
             style="background-image: url([[img]])"></div>
    </div>
    <div class="right"></div>
</div>

    `;
  }

  _fileUrl() {
    return config.api;
  }

  _getFormatedDate(value) {
    return new Date(value).toDateString();
  }

  static get properties() {
    return {
      itemId: {
        type: String,
      },
      _icon: {
        type: String,
        computed: '_iconComputed(source)',
      },
    };
  }

  ready() {
    super.ready();
    afterNextRender(this, () => {
      this.$.wrapper.scrollLeft = this.offsetWidth;
      this.deviceWidth = this.offsetWidth;
      this.$.wrapper.addEventListener('scroll',
          this.handleScroll.bind(this));
    });
  }

  handleScroll(event) {
    if (event.currentTarget.scrollLeft === 0 ||
        event.currentTarget.scrollLeft >= 2 * this.deviceWidth - 12) {
      event.currentTarget.removeEventListener('scroll',
          this.handleScroll.bind(this));
      this.remove();
    }
  }

  _iconComputed(source) {
    if (source.includes('ambebi')) {
      return 'https://www.ambebi.ge/static/img/ambebimainlogo.svg';
    }
    return 'https://www.interpressnews.ge/static/img/logo.svg';
  }

  showContent() {
    this.redirectTo('/articles/' + this.itemId);
  }

}

customElements.define('news-item', NewsItem);
