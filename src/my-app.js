import { LitElement, html, css } from 'lit-element'
import { updateMetadata, installRouter } from 'pwa-helpers'

import './main-view.js'
import './contact-view.js'

import '@polymer/paper-styles/paper-styles.js'
import '@polymer/paper-toast/paper-toast.js'
import '@material/mwc-button'
import '@material/mwc-icon'

import { LayoutStyles } from './layout-styles.js'

class MyApp extends LitElement {
  static get properties() {
    return {
      appTitle: { type: String },
      path: { type: String }
    }
  }

  render() {
    return html`
    <style>
      :host {
        display: block;
        display: flex;
        flex-direction: column;
        min-height: 100vh;

        --mdc-theme-primary: black;
      }

      ::slotted(header) {
        text-align: center;
        padding: 30px 0;
        font-size:130%;
      }

      .main-content {
        flex: 1;
      }

      .page {
        display: none;
        flex: 1;
      }
      .page[active] {
        display: block;
      }

      footer {
        text-align: center;
        font-size: 80%;
        padding:5px;
        font-size: 90%;
        color: grey;
        padding-top: 40px;
      }
    </style>
    ${LayoutStyles}

    <slot name="header"></slot>
    
    <main role="main" class="main-content hflex">
      <main-view class="page" ?active="${this.path === '/'}">
        <slot name="main"></slot>
      </main-view>
      <contact-view class="page" ?active="${this.path === '/contact'}">
        <slot name="contact"></slot>
      </contact-view>
    </main>

    <paper-toast id="toast"></paper-toast>

    <footer>&copy; All Rights Reserved</footer>
    `
  }

  firstUpdated() {
    window.updateLocation = location => {
      if (typeof location === 'string') {
        window.history.pushState({}, '', location)
        location = window.location
      }
      this.path = location.pathname
    }
    installRouter(updateLocation)

    window.toast = (text => {
      const toaster = this.shadowRoot.querySelector('#toast')
      toaster.innerHTML = text + '<span style="margin:0 10px"></span>'
      toaster.open()
    }).bind(this)

    window.contactview = this.shadowRoot.querySelector('contact-view')

    /* remove slot transparency */
    setTimeout(() => document.body.classList.remove('trans'), 400)
  }

  updated(changedProps) {
    if (changedProps.has('path')) {
      let page = this.path.slice(1).replace(/\//g, ' ')
      if (page) {
        page = page[0].toUpperCase() + page.slice(1).toLowerCase()
        page = ` - ${page}`
      }
      const pageTitle = this.appTitle + page
      updateMetadata({
        title: pageTitle,
        description: pageTitle
      })
    }
  }
}

window.customElements.define('my-app', MyApp)
