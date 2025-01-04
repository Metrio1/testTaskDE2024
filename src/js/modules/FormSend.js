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
}