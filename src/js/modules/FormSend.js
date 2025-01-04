export class FormSend {
    #url;
    #method;
    #sendInProgress = false;

    constructor(url, method = "POST") {
        this.#url = url;
        this.#method = method;
    }

    async sendData(formData) {
        if (this.#sendInProgress) {
            throw new Error("Отправка уже выполняется.");
        }

        this.#sendInProgress = true;

        try {
            const options = {
                method: this.#method,
                headers: {
                    "Accept": "application/json",
                },
            };

            if (this.#method.toLowerCase() !== "get") {
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