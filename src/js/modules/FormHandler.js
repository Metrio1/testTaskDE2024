import { FormSend } from "@/js/modules/FormSend.js";
import { FormValidator } from "@/js/modules/FormValidator.js";
import { ModalManager } from "@/js/modules/ModalManager.js";
import { FormProcessor } from "@/js/modules/FormProcessor.js";

export class FormHandler {
  static instance;
  #modalManager;
  #formProcessor;

  attrs = {
    form: "data-js-form",
  };

  constructor() {
    if (FormHandler.instance) {
      return FormHandler.instance;
    }

    this.#modalManager = new ModalManager();
    this.#formProcessor = new FormProcessor(this.#modalManager);
    this.#bindEvents();
    FormHandler.instance = this;
  }

  async #handleSubmit(e) {
    const { target, submitter } = e;

    const cfg = this.#getConfig(target);

    if (this.#isFormValid(target, e, cfg)) {
      await this.#formProcessor.process(target, submitter, cfg);
    }
  }

  #getConfig(form) {
    return FormSend.getConfig(form, this.attrs);
  }

  #isFormValid(form, e, cfg) {
    if (!cfg || !form.hasAttribute(this.attrs.form) || form.tagName.toLowerCase() !== "form") {
      return false;
    }

    const { isNeedPreventDefault = true, isNeedValidateBeforeSubmit = true } = cfg;

    if (isNeedPreventDefault) {
      e.preventDefault();
    }

    return !(isNeedValidateBeforeSubmit && !FormValidator.getValidationForm(form));
  }

  #bindEvents() {
    document.addEventListener("submit", (e) => this.#handleSubmit(e), true);
  }
}