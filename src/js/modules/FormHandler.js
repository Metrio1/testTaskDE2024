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

  async #handleSubmit(e) {
    const { target, submitter } = e;

    if (!target.hasAttribute(this.attrs.form) || target.tagName.toLowerCase() !== "form") {
      return;
    }

    if (this.isSubmitting) {
      e.preventDefault();
      return;
    }

    const cfg = JSON.parse(target.getAttribute(this.attrs.form));
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

    try {
      const formSender = new FormSend(url, method);
      await formSender.sendData(new FormData(target));

      if (showModalAfterSuccess) {
        ModalManager.open({
          src: showModalAfterSuccess,
          type: "selector",
          isNeedShowBackdrop: false,
          closeAfterDelay: 2000,
        });
        ScrollManager.unlock();
      }

      if (isResetAfterSuccess) {
        target.reset();
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
    document.addEventListener(
        "submit",
        (e) => this.#handleSubmit(e),
        true
    );
  }
}