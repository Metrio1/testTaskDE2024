import { FormValidator } from "./FormValidator.js";
import { FormSend } from "./FormSend.js";

export class FormHandler {
  static instance;

  attrs = {
    form: "data-js-form",
  };

  constructor() {
    if (FormHandler.instance) {
      return FormHandler.instance;
    }

    this.isSubmittingForms = new Set();
    this.#bindEvents();
    FormHandler.instance = this;
  }

  async #handleSubmit(e) {
    const { target, submitter } = e;

    if (!target.hasAttribute(this.attrs.form) || target.tagName.toLowerCase() !== "form") {
      return;
    }

    if (this.isSubmittingForms.has(target)) {
      e.preventDefault();
      return;
    }

    const cfg = FormSend.getConfig(target, this.attrs);
    const {
      url,
      method = "POST",
      showModalAfterSuccess,
      showModalAfterError,
      isNeedPreventDefault = true,
      isNeedValidateBeforeSubmit,
      isResetAfterSuccess = true,
    } = cfg;

    if (isNeedPreventDefault) {
      e.preventDefault();
    }

    if (isNeedValidateBeforeSubmit && !FormValidator.getValidationForm(target)) {
      return;
    }

    this.isSubmittingForms.add(target);
    submitter.disabled = true;

    const formSender = new FormSend(url, method);

    try {
      await formSender.sendData(new FormData(target));
      FormSend.handleSuccess(target, showModalAfterSuccess, isResetAfterSuccess);
    } catch (error) {
      FormSend.handleError(error, showModalAfterError);
    } finally {
      this.isSubmittingForms.delete(target);
      submitter.disabled = false;
    }
  }

  #bindEvents() {
    document.addEventListener("submit", (e) => this.#handleSubmit(e), true);
  }
}