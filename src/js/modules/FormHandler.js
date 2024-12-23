import { ModalManager } from "./ModalManager.js";
import { FormValidator } from "./FormValidator.js";
import { ScrollManager } from "@/js/utils/ScrollManager.js";

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
      isNeedPreventDefault = true,
      isNeedValidateBeforeSubmit,
    } = cfg;

    if (isNeedPreventDefault) {
      e.preventDefault();
    }

    if (isNeedValidateBeforeSubmit) {
      const resValidate = FormValidator.getValidationForm(target);
      if (!resValidate) {
        return;
      }
    }

    const formData = new FormData(target);

    submitter.disabled = true;

    // TODO: Можно реализовать конфигурацию формата отправки через data-js-form и обработку перед fetch
    fetch(url, {
      method,
      body: formData,
      headers: {
        "Accept": "application/json",
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
            ScrollManager.unlock();
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
