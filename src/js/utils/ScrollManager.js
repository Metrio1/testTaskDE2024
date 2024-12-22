export class ScrollManager {
    static isLocked = false;

    static lock() {
        if (ScrollManager.isLocked) {
            return;
        }

        const scrollY = window.scrollY;
        document.body.style.setProperty("--scrolledTop", `-${scrollY}px`);

        document.body.classList.add("lock");
        document.body.classList.remove("unlock");

        ScrollManager.isLocked = true;
    }

    static unlock() {
        if (!ScrollManager.isLocked) {
            return;
        }

        document.body.classList.remove("lock");
        document.body.classList.add("unlock");

        const scrollY = parseInt(getComputedStyle(document.body).getPropertyValue("--scrolledTop"), 10);
        window.scrollTo({ top: -scrollY, behavior: "instant" });

        document.body.style.removeProperty("--scrolledTop");

        ScrollManager.isLocked = false;
    }
}
