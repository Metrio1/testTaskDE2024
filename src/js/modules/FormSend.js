export class FormSend {
    constructor(url, method = "POST") {
        this.url = url;
        this.method = method;
    }

    async send(formData) {
        return fetch(this.url, {
            method: this.method,
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
            });
    }
}