export class FormValidator {
    static instance = null;

    static attrs = {
        inputRequired: "data-js-input-required",
        inputRequiredMode: "data-js-input-required-mode",
        error: "data-js-error-msg",
        row: "data-js-validate-row",
    };

    static stateClasses = {
        isInvalid: "isInvalid",
        isValid: "isValid",
    };


    constructor() {
        if (FormValidator.instance) {
            return FormValidator.instance;
        }
        this.inputs = document.querySelectorAll(
            `[${FormValidator.attrs.inputRequired}]`
        );
        this.#bindEvents();
        FormValidator.instance = this;
    }

    #bindEvents() {
        this.inputs.forEach(input => {
            const modeAttribute = input.getAttribute(
                FormValidator.attrs.inputRequiredMode
            );
            const modes = modeAttribute
                ? modeAttribute.trim().replace(" ", "").split(",")
                : [];

            modes.forEach(mode => {
                switch (mode) {
                    case "blur":
                        input.addEventListener("blur", () => FormValidator.validateInput(input));
                        break;
                    case "focus":
                        input.addEventListener("focus", () => FormValidator.validateInput(input));
                        break;
                    case "change":
                        input.addEventListener("input", () => FormValidator.validateInput(input));
                        break;
                }
            });
        });
    }

    static getValidationForm(form) {
        const inputs = form.querySelectorAll(`[${FormValidator.attrs.inputRequired}]`);
        let isFormValid = true;

        inputs.forEach(input => {
            const isValidInput = FormValidator.validateInput(input);
            if (!isValidInput) {
                isFormValid = false;
            }
        });

        return isFormValid;
    }

    static validateInput(input) {
        const validationType = input.getAttribute(
            FormValidator.attrs.inputRequired
        );
        const errorMsgElement = input
            .closest(`[${FormValidator.attrs.row}]`)
            .querySelector(`[${FormValidator.attrs.error}]`);

        const row = input.closest(`[${FormValidator.attrs.row}]`);

        let isValid;
        let errorMessage = "";

        switch (validationType) {
            case "name":
                isValid = FormValidator.validateText(input.value);
                errorMessage = "Введите корректное имя";
                break;
            case "email":
                isValid = FormValidator.validateEmail(input.value);
                errorMessage = "Введите корректный адрес электронной почты";
                break;
            case "message":
                isValid = FormValidator.validateText(input.value);
                errorMessage = "Это поле обязательно для заполнения";
                break;
            default:
                isValid = true;
        }

        if (!isValid) {
            FormValidator.showError(row, errorMsgElement, errorMessage);
        } else {
            FormValidator.hideError(row, errorMsgElement);
        }

        return isValid;
    }

    static validateEmail(value) {
        const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
        return emailRegex.test(value.trim());
    }

    static validateText(value) {
        return value.trim() !== "";
    }

    static showError(row, errorMsgElement, message) {
        if (row) {
            row.classList.add(FormValidator.stateClasses.isInvalid);
        }
        if (errorMsgElement) {
            errorMsgElement.textContent = message;
        }
    }

    static hideError(row, errorMsgElement) {
        if (row) {
            row.classList.remove(FormValidator.stateClasses.isInvalid);
        }
        if (errorMsgElement) {
            errorMsgElement.textContent = "";
        }
    }
}
