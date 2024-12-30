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
        document.addEventListener("blur", this.#handleEvent, true);
        document.addEventListener("focus", this.#handleEvent, true);
        document.addEventListener("input", this.#handleEvent, true);
    }

    #handleEvent(event) {
        const input = event.target.closest(
            `[${FormValidator.attrs.inputRequired}]`
        );

        if (!input) {
            return;
        }

        const modeAttribute = input.getAttribute(
            FormValidator.attrs.inputRequiredMode
        );
        const modes = modeAttribute
            ? modeAttribute.trim().replace(" ", "").split(",")
            : [];

        if (event.type === "input" || modes.includes(event.type)) {
            FormValidator.validateInput(input);
        }
    }

    static getValidationForm(form) {
        let isFormValid = true;

        [ ...form.elements ].forEach((input) => {
            if (
                input.matches(`[${FormValidator.attrs.inputRequired}]`) &&
                !FormValidator.validateInput(input)
            ) {
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
            FormValidator.showError(row, errorMsgElement, errorMessage, input);
        } else {
            FormValidator.hideError(row, errorMsgElement, input);
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

    static showError(row, errorMsgElement, message, input) {

        if (row) {
            row.classList.add(FormValidator.stateClasses.isInvalid);
        }
        if (input) {
            input.classList.add("input--invalid");
        }
        if (errorMsgElement) {
            errorMsgElement.textContent = message;
        }
    }

    static hideError(row, errorMsgElement, input) {

        if (row) {
            row.classList.remove(FormValidator.stateClasses.isInvalid);
        }
        if (input) {
            input.classList.remove("input--invalid");
        }
        if (errorMsgElement) {
            errorMsgElement.textContent = "";
        }
    }
}
