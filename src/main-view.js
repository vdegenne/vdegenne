import { PageViewElement } from './page-view-element'
import { html } from 'lit-element'

import { PageStyles } from './page-styles'

class MainView extends PageViewElement {
  render() {
    return html`
    ${PageStyles}
    <style>
      :host {
        /* padding-top: 0; */
      }
    </style>
    <slot></slot>
    `
  }
}

window.customElements.define('main-view', MainView)
