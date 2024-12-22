export class ScrollManager {
    static isLocked = false;

    static lock() {
        if (ScrollManager.isLocked) {
            return;
        }

        // Устанавливаем текущую позицию скролла в CSS-переменную
        const scrollY = window.scrollY;
        document.body.style.setProperty('--scrolledTop', `${scrollY}px`);

        // Добавляем класс для блокировки
        document.body.classList.add('lock');
        document.body.classList.remove('unlock');

        ScrollManager.isLocked = true;
    }

    static unlock() {
        if (!ScrollManager.isLocked) {
            return;
        }

        // Убираем класс блокировки
        document.body.classList.remove('lock');
        document.body.classList.add('unlock');

        // Прокручиваем обратно на сохранённую позицию
        const scrollY = parseInt(getComputedStyle(document.body).getPropertyValue('--scrolledTop'), 10);
        window.scrollTo({ top: scrollY, behavior: 'instant' });

        // Убираем переменную после разблокировки
        document.body.style.removeProperty('--scrolledTop');

        ScrollManager.isLocked = false;
    }
}
