import { ModalManager } from "./ModalManager.js";
import { FormValidator } from "./FormValidator.js";
import { ScrollManager } from "@/js/utils/ScrollManager.js";
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
    this.isSubmitting = false;
    this.#bindEvents();
    FormHandler.instance = this;
  }

  #cacheFormConfig(form) {
    if (!form._config) {
      form._config = JSON.parse(form.getAttribute(this.attrs.form));
    }
    return form._config;
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

    const cfg = this.#cacheFormConfig(target);
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
      if (isResetAfterSuccess) {
        target.reset();
      }

      if (showModalAfterSuccess) {
        ModalManager.open({
          src: showModalAfterSuccess,
          type: "selector",
          isNeedShowBackdrop: false,
          closeAfterDelay: 2000,
        });
        ScrollManager.unlock();
      }
    } catch (error) {
      console.error("Ошибка при отправке данных:", error);

      if (showModalAfterError) {
        ModalManager.open({
          src: showModalAfterError,
          type: "selector",
          isNeedShowBackdrop: true,
          closeAfterDelay: 3000,
        });
      }
      ScrollManager.unlock();
    } finally {
      this.isSubmitting = false;
      submitter.disabled = false;
    }
  }

  #bindEvents() {
    document.addEventListener("submit", (e) => this.#handleSubmit(e), true);
  }
}