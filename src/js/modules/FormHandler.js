import { ModalManager } from "./ModalManager.js";
import { FormValidator } from "./FormValidator.js";

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

  #handleSubmit(e) {
    const { target, submitter } = e;
    if (!target.hasAttribute(`${this.attrs.form}`)) {
      return;
    }
    if (target.tagName.toLowerCase() !== "form") {
      return;
    }

    const cfg = JSON.parse(target.getAttribute(this.attrs.form));
    const {
      url,
      method = "POST",
      showModalAfterSuccess,
      preventDefault = true,
      isNeedValidateBeforeSubmit,
    } = cfg;

    if (preventDefault) {
      e.preventDefault();
    }

    if (isNeedValidateBeforeSubmit) {
      const resValidate = FormValidator.getValidationForm(target);
      if (!resValidate) {
        return;
      }
    }

    const jsonData = {};

    submitter.disabled = true;

    fetch(url, {
      method,
      body: JSON.stringify(jsonData),
      headers: {
        "Accept": "application/json"
      },
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error("Сетевой ответ не успешен");
        }
        return response.json();
      })
      .then((data) => {
        target.reset();

        console.debug("Успешно:", data);
        if (showModalAfterSuccess) {
          ModalManager.open({
            src: showModalAfterSuccess,
            type: "selector",
            isNeedShowBackdrop: false,
            closeAfterDelay: 2000,
          });
          ModalManager.scrollUnlock();
        }
      })
      .catch((error) => {
        console.error("Ошибка при выполнении запроса:", error);
      })
      .finally(() => {
        submitter.disabled = false;
      });
  }

  #bindEvents() {
    document.addEventListener(
      "submit",
      (e) => {
        this.#handleSubmit(e);
      },
      true
    );
  }
}
