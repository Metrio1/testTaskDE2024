import { ModalManager } from "./ModalManager.js";
import { ScrollManager } from "@/js/utils/ScrollManager.js";

export class FormSend {
    #url;
    #method;
    #sendInProgress = false;
    #headers;

    constructor(url, method = "POST", headers = {}) {
        this.#url = url;
        this.#method = method.toUpperCase();
        this.#headers = headers;
    }

    static getConfig(form, attrs) {
        if (!form._config) {
            form._config = JSON.parse(form.getAttribute(attrs.form));
        }
        return form._config;
    }

    async sendData(formData) {
        if (this.#sendInProgress) {
            return;
        }

        this.#sendInProgress = true;

        try {
            const options = {
                method: this.#method,
                headers: {
                    "Accept": "application/json",
                    ...this.#headers,
                },
            };

            if (this.#method !== "GET") {
                options.body = formData;
            }

            const response = await fetch(this.#url, options);

            if (!response.ok) {
                throw new Error(`Ошибка сети: ${response.status} ${response.statusText}`);
            }

            return await response.json();
        } catch (error) {
            throw error;
        } finally {
            this.#sendInProgress = false;
        }
    }

    static handleSuccess(form, showModalAfterSuccess, isResetAfterSuccess) {
        if (isResetAfterSuccess) {
            form.reset();
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
    }

    static handleError(error, showModalAfterError) {
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
    }
}