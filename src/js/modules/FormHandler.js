import { FormValidator } from "@/js/modules/FormValidator.js";
import { FormSend } from "@/js/modules/FormSend.js";
import { ModalManager } from "@/js/modules/ModalManager.js";

export class FormHandler {
  static instance;
  #modalManager;
  #isSubmittingForms = new Set();

  attrs = {
    form: "data-js-form",
  };

  constructor() {
    if (FormHandler.instance) {
      return FormHandler.instance;
    }

    this.#modalManager = new ModalManager();
    this.#bindEvents();
    FormHandler.instance = this;
  }

  async #handleSubmit(event) {
    const { target, submitter } = event;
    const formConfig = this.#prepareConfig(target);

    const { isNeedPreventDefault = true, isNeedValidateBeforeSubmit = true,  } = formConfig;

    if (isNeedPreventDefault) {
      event.preventDefault();
    }

    if (!this.#isValidForm(target, isNeedValidateBeforeSubmit)) {
      return;
    }

    await this.#processForm(target, submitter, formConfig);
  }

  #prepareConfig(form) {
    return FormSend.getConfig(form, this.attrs);
  }

  #isValidForm(form, isNeedValidateBeforeSubmit = true) {
    if (!form.hasAttribute(this.attrs.form) || !(form instanceof HTMLFormElement)) {
      return false;
    }

    return !(
        isNeedValidateBeforeSubmit && !FormValidator.getValidationForm(form)
    );
  }

  async #processForm(form, submitter, formConfig) {
    if (this.#isSubmittingForms.has(form)) {
      return;
    }

    this.#disableForm(form, submitter);

    const formSender = new FormSend(formConfig.url, formConfig.method, {}, this.#modalManager);

    try {
      await formSender.sendData(form, new FormData(form), {
        showModalAfterSuccess: formConfig.showModalAfterSuccess,
        showModalAfterError: formConfig.showModalAfterError,
        isResetAfterSuccess: formConfig.isResetAfterSuccess,
      });
    } finally {
      this.#enableForm(form, submitter);
    }
  }

  #disableForm(form, submitter) {
    this.#isSubmittingForms.add(form);
    submitter.disabled = true;
  }

  #enableForm(form, submitter) {
    this.#isSubmittingForms.delete(form);
    submitter.disabled = false;
  }

  #bindEvents() {
    document.addEventListener("submit", (e) => this.#handleSubmit(e), true);
  }
}