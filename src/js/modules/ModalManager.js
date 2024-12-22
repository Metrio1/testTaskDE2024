//Класс реализует функционал для управления модальными окнами. Пока может открывать и закрывать только 1 модальное окно
import { ScrollManager } from "../utils/ScrollManager.js";

export class ModalManager {
    static instance = null;

    static stateClasses = {
        isOpen: "isOpen",
        baseClass: "modal",
    };

    static attrs = {
        triggerOpen: "data-js-modal-open",
        modalType: "data-js-modal-type",
        modalClose: "data-js-modal-close",
    };

    static instances = new Map();
    static backdrop = null;

    constructor() {
        if (ModalManager.instance) {
            return ModalManager.instance;
        }
        ModalManager.backdrop = document.querySelector("[data-js-modal-backdrop]");
        this.#bindEvents();
        ModalManager.instance = this;
    }

    #bindEvents() {
        document.addEventListener("click", (e) => this.handleClick(e));
        document.addEventListener("keydown", (e) => this.handleKeyDown(e));
    }

    handleClick(event) {
        const modalCloseElement = event.target.closest(`[${ModalManager.attrs.modalClose}]`);
        const target = event.target.closest(`[${ModalManager.attrs.triggerOpen}]`);
        if (target) {
            const src = target.getAttribute(ModalManager.attrs.triggerOpen);
            const type = target.getAttribute(ModalManager.attrs.modalType);
            if (src && type) {
                ModalManager.open({ src, type });
            } else {
                console.error(
                    "Modal open attributes are missing or invalid:",
                    src,
                    type
                );
            }
        } else if (modalCloseElement) {
            ModalManager.closeOpenInstance();
        } else {
            const [ openInstance ] = ModalManager.getOpenInstance();
            if (openInstance && !openInstance.contains(event.target)) {
                ModalManager.closeOpenInstance();
            }
        }
    }

    handleKeyDown(event) {
        if (event.key === "Escape") {
            const [ openInstance ] = ModalManager.getOpenInstance();
            if (openInstance) {
                ModalManager.closeOpenInstance();
            }
        }
    }

    static getOpenInstance() {
        for (const [ element, state ] of ModalManager.instances.entries()) {
            if (state.isOpen) {
                return [ element, state ];
            }
        }
        return [ null, null ];
    }

    static open({ src, type, isNeedShowBackdrop = true, closeAfterDelay } = {}) {
        ModalManager.closeOpenInstance();

        let modalElement;
        if (type === "selector") {
            modalElement = document.querySelector(src);
        } else if (type === "html" && typeof src === "string") {
            modalElement = ModalManager.createModal(src);
        } else {
            console.error("Invalid modal source or type provided:", src, type);
            return;
        }
        if (!modalElement) {
            console.error("Modal element not found:", src);
            return;
        }

        if (ModalManager.backdrop && isNeedShowBackdrop) {
            ModalManager.backdrop.classList.add(ModalManager.stateClasses.isOpen);
        } else if (ModalManager.backdrop) {
            ModalManager.backdrop.classList.remove((ModalManager.stateClasses.isOpen))
        }
        modalElement.classList.add(ModalManager.stateClasses.isOpen);

        ModalManager.instances.set(modalElement, { isOpen: true, type });
        ModalManager.scrollLock();

        if (closeAfterDelay) {
            setTimeout(() => {
                ModalManager.closeOpenInstance();
            }, closeAfterDelay);
        }
    }

    static createModal(html) {
        const modalElement = document.createElement("div");
        modalElement.classList.add(ModalManager.stateClasses.baseClass);
        modalElement.innerHTML = html;
        document.body.appendChild(modalElement);
        return modalElement;
    }

    static closeOpenInstance({ isNeedCloseBackdrop = true } = {}) {
        const [ openInstance, state ] = ModalManager.getOpenInstance();
        console.debug("Open instance:", [ openInstance, state ]);
        if (!openInstance) {
            return;
        }
        if (isNeedCloseBackdrop && ModalManager.backdrop) {
            ModalManager.backdrop.classList.remove(ModalManager.stateClasses.isOpen);
        }
        openInstance.classList.remove(ModalManager.stateClasses.isOpen);
        if (state.type === "html") {
            document.body.removeChild(openInstance);
        }
        ModalManager.instances.delete(openInstance);
        ModalManager.scrollUnlock();
    }

    static scrollLock() {
        ScrollManager.lock();
    }

    static scrollUnlock() {
        ScrollManager.unlock();
    }
}
