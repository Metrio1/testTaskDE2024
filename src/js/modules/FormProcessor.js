import { FormSend } from "@/js/modules/FormSend.js";

export class FormProcessor {
    #modalManager;
    isSubmittingForms = new Set();

    constructor(modalManager) {
        this.#modalManager = modalManager;
    }

    async process(form, submitter, cfg) {
        if (this.isSubmittingForms.has(form)) {
            return;
        }

        this.#disableForm(form, submitter);

        const formSender = new FormSend(cfg.url, cfg.method, {}, this.#modalManager);

        try {
            await formSender.sendData(form, new FormData(form), {
                showModalAfterSuccess: cfg.showModalAfterSuccess,
                showModalAfterError: cfg.showModalAfterError,
                isResetAfterSuccess: cfg.isResetAfterSuccess,
            });
        } finally {
            this.#enableForm(form, submitter);
        }
    }

    #disableForm(form, submitter) {
        this.isSubmittingForms.add(form);
        submitter.disabled = true;
    }

    #enableForm(form, submitter) {
        this.isSubmittingForms.delete(form);
        submitter.disabled = false;
    }
}