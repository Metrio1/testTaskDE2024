import { ModalManager } from "./ModalManager.js";
import { ScrollManager } from "@/js/utils/ScrollManager.js";

export class FormResponseHandler {
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