import {html, PolymerElement} from '@polymer/polymer/polymer-element.js';
import '@polymer/iron-ajax/iron-ajax.js';

/**
 * `lancie-ajax-3`
 * 
 *
 * @customElement
 * @polymer
 * @demo demo/index.html
 */
class LancieAjax extends PolymerElement {
  static get template() {
    return html`
      <iron-ajax
          id="ajax"
          headers="[[createHeader(token, contenttype)]]"
          body="[[body]]"
          params="[[params]]"
          method="[[method]]"
          url="[[_getURL(absoluteurl, refurl)]]"
          handle-as="[[handleAs]]"
          last-response="{{lastResponse}}"
          loading="{{loading}}"
          debounce-duration="300"
          on-response="handleResponse"
          on-error="handleResponse"
      ></iron-ajax>
    `;
  }
  static get properties() {
    return {
      contenttype: {
        type: String,
        value: 'application/json',
        notify: true
      },
      refurl: {
        type: String,
        value: '',
        notify: true
      },
      absoluteurl: {
        type: String,
        value: '',
        notify: true
      },
      handleAs: {
        type: String,
        value: 'json',
        notify: true
      },
      autoFire: {
        type: Boolean,
        value: false
      },
      skipToken: {
        type: Boolean,
        value: false
      },
      isuser: {
        type: Boolean,
        value: false
      },
      loading: {
        type: Boolean,
        notify: true,
        value: false
      },
      params: {
        type: Object,
        value: {}
      },
      method: {
        type: String,
        value: 'GET'
      },
      lastResponse: {
        type: Object,
        notify: true
      },
      body: {
        type: Object
      },
      token: {
        type: String,
        value: '',
        notify: true,
      }
    };
  }

  injectToken(newToken) {
    token = newToken;
    for (let i = 0; i < ajax.length; i++) {
      ajax[i](token);
    }
  }

  attached() {
    if (this.skipToken && this.autoFire) {
      this.generateRequest();
      return;
    }
    if (token) {
      this.token = token;
      if (this.autoFire) {
        this.generateRequest();
      }
    } else {
      ajax.push(function(newToken) {
        this.token = newToken;
        if (this.autoFire) {
          this.generateRequest();
        }
      }.bind(this));
    }
  }

  _getURL(absoluteurl, refurl) {
    if (absoluteurl !== '') {
      return absoluteurl;
    }
    return '/api/v1/' + refurl;
  }

  createHeader(token, contenttype) {
    if (this.absoluteurl !== '') {
      return {
        'Content-Type': contenttype,
      };
    }
    return {
      'Content-Type': contenttype,
      'X-Auth-Token': token,
    };
  }

  handleResponse(event) {
    this.fire('lancie-ajax', event.detail);
  }

  generateRequest() {
    this.$.ajax.generateRequest();
  }
}

window.customElements.define('lancie-ajax', LancieAjax);
