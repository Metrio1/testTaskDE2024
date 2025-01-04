import { FormConfigReader } from "../utils/FormConfigReader.js";
import { FormValidator } from "./FormValidator.js";
import { FormSend } from "./FormSend.js";
import { FormResponseHandler } from "./FormResponseHandler.js";

export class FormHandler {
  static instance;

  attrs = {
    form: "data-js-form",
  };

  constructor() {
    if (FormHandler.instance) {
      return FormHandler.instance;
    }
    this.isSubmitting = false;
    this.#bindEvents();
    FormHandler.instance = this;
  }

  async #handleSubmit(e) {
    const { target, submitter } = e;

    if (!target.hasAttribute(this.attrs.form) || target.tagName.toLowerCase() !== "form") {
      return;
    }

    if (this.isSubmitting) {
      e.preventDefault();
      return;
    }

    const cfg = FormConfigReader.getConfig(target, this.attrs);
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

    this.isSubmitting = true;
    submitter.disabled = true;

    const formSender = new FormSend(url, method);

    try {
      await formSender.sendData(new FormData(target));
      FormResponseHandler.handleSuccess(target, showModalAfterSuccess, isResetAfterSuccess);
    } catch (error) {
      FormResponseHandler.handleError(error, showModalAfterError);
    } finally {
      this.isSubmitting = false;
      submitter.disabled = false;
    }
  }

  #bindEvents() {
    document.addEventListener("submit", (e) => this.#handleSubmit(e), true);
  }
}