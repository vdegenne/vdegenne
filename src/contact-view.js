import { html } from 'lit-element'
import { PageViewElement } from './page-view-element'

import { PageStyles } from './page-styles'

class ContactView extends PageViewElement {
  constructor() {
    super()
    this.sending = false
  }

  render() {
    return html`
    ${PageStyles}
    <slot></slot>
    `
  }
  async send() {
    if (this.sending) {
      return
    }
    this.sending = true
    formSubmitButton.setAttribute('disabled', '')

    let body = {}
    if (!formName.value) {
      toast('please enter a name')
      formSubmitButton.removeAttribute('disabled')
      this.sending = false
      return
    }
    body.name = formName.value
    if (!formSubject.value) {
      toast('please enter a subject')
      formSubmitButton.removeAttribute('disabled')
      this.sending = false
      return
    }
    body.subject = formSubject.value
    if (!formContent.value) {
      toast('please insert a content')
      formSubmitButton.removeAttribute('disabled')
      this.sending = false
      return
    }
    body.content = formContent.value

    await fetch('/api/contact', {
      method: 'POST',
      body: JSON.stringify(body),
      headers: { 'Content-Type': 'application/json' }
    }).then(response => {
      if (response.status !== 200) {
        toast('something went wrong, try again later.')
      } else {
        setTimeout(() => toast('Thanks. I will read your message soon !'), 400)
        setTimeout(() => {
          formName.value = ''
          formSubject.value = ''
          formContent.value = ''
          backButton.setAttribute('unelevated', '')
        }, 2000)
      }
      this.sending = false
      formSubmitButton.removeAttribute('disabled')
    })
  }
}

window.customElements.define('contact-view', ContactView)
