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
    this.#bindEvents();
    FormHandler.instance = this;
  }

  async #handleSubmit(e) {
    const { target, submitter } = e;

    if (!target.hasAttribute(this.attrs.form) || target.tagName.toLowerCase() !== "form") {
      return;
    }

    const cfg = JSON.parse(target.getAttribute(this.attrs.form));
    const {
      url,
      method = "POST",
      showModalAfterSuccess,
      isNeedPreventDefault = true,
      isNeedValidateBeforeSubmit,
    } = cfg;

    if (isNeedPreventDefault) {
      e.preventDefault();
    }

    if (isNeedValidateBeforeSubmit && !FormValidator.getValidationForm(target)) {
      return;
    }

    submitter.disabled = true;
    const formData = new FormData(target);
    const formSender = new FormSend(url, method);

    try {
      const data = await formSender.send(formData);
      target.reset();

      console.debug("Успешно:", data);
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
      console.error("Ошибка при выполнении запроса:", error);
    } finally {
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
