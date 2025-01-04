export class FormSend {
    static attrs = {
        form: "data-js-form",
        submitButton: "data-js-submit",
    };

    #form;
    #config;
    #url;
    #method;
    #sendInProgress = false;

    constructor(form, config = {}) {
        this.#form = form;
        this.#config = config;
        this.#url = config.url || form.action || window.location.href;
        this.#method = config.method || form.method || "POST";

        this.#form.addEventListener("submit", (e) => {
            if (this.#sendInProgress) {
                e.preventDefault();
            }
        });
    }

    #getSubmitButton() {
        let submitButton = this.#form.querySelector(`[${FormSend.attrs.submitButton}]`);

        if (!submitButton) {
            submitButton = document.querySelector(`[form="${this.#form.id}"][${FormSend.attrs.submitButton}]`);
        }

        return submitButton;
    }

    #setLoadingState(isLoading) {
        this.#sendInProgress = isLoading;
        const submitButton = this.#getSubmitButton();
        if (submitButton) {
            submitButton.disabled = isLoading;
        }
    }

    async sendData() {
        if (this.#sendInProgress) {
            return;
        }

        this.#setLoadingState(true);

        try {
            const options = {
                method: this.#method,
                headers: {
                    "Accept": "application/json",
                },
            };

            if (this.#method.toLowerCase() !== "get") {
                options.body = new FormData(this.#form);
            }

            const response = await fetch(this.#url, options);

            if (!response.ok) {
                throw new Error(`Ошибка сети: ${response.status} ${response.statusText}`);
            }

            const data = await response.json();
            this.#handleSuccess(data);
            return data;
        } catch (error) {
            this.#handleError(error);
            throw error;
        } finally {
            this.#setLoadingState(false);
        }
    }

    #handleSuccess(response) {
        if (this.#config.onSuccess) {
            this.#config.onSuccess(response);
        }
    }

    #handleError(error) {
        console.error("Ошибка отправки формы:", error);

        if (this.#config.onError) {
            this.#config.onError(error);
        }
    }
}
