export class FormConfigReader {
    static getConfig(form, attrs) {
        if (!form._config) {
            form._config = JSON.parse(form.getAttribute(attrs.form));
        }
        return form._config;
    }
}