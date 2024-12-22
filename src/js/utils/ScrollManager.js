export class ScrollManager {
    static scrollY = 0;
    static isLocked = false;

    static lock() {
        if (ScrollManager.isLocked) {
            return;
        }

        ScrollManager.scrollY = window.scrollY;

        document.body.style.position = "fixed";
        document.body.style.top = `-${ScrollManager.scrollY}px`;
        document.body.style.width = "100%";

        ScrollManager.isLocked = true;
    }

    static unlock() {
        if (!ScrollManager.isLocked) {
            return;
        }

        document.body.style.position = "";
        document.body.style.top = "";
        document.body.style.width = "";

        window.scrollTo({
            top: ScrollManager.scrollY, behavior: "instant"
        });

        ScrollManager.isLocked = false;
    }
}


