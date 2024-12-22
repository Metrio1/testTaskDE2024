export default function isDomLoaded(callback) {
    document.addEventListener("DOMContentLoaded", () => {
        callback();
    });
}