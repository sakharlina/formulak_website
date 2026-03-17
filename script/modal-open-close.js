"use strict";

class Modal
{
    /**
     * в этом "статическом" свойстве будем хранить все созданные модальные окна
     * доступ к этому свойству через сам класс - Modal.allModals, а не через объект конкретной модалки
     */
    static allModals = [];

    /**
     * тут храним ссылку на контейнер (html элемент) конкретного модального окна
     */
    modalContainer;

    /**
     * тут храним состояние модалки (открыта / закрыта)
     */
    opened = false;


    /**
     * Создает объект для управления модальным окном
     * @param modalSelector Первым аргументом принимает css селектор контейнера, в котором хранится контент модалки
     * @param openButtonsSelector Вторым аргументом принимает css селектор для всех кнопок, по которым должно открываться это модальное окно
     */
        constructor(modalSelector = '.modal-window', openButtonsSelector = '.modal-open-button') {
        this.modalContainer = document.querySelector(modalSelector);

        if (!this.modalContainer) {
            throw new Error(`Не удалось найти html элемент под модальное окно с классом "${modalSelector}"`);
        }

        // убираем класс, который делает модалку открытой
        // на случай если для какой-то модалки этот класс был прописан в разметке
        // чтобы все модалки изначально были закрытыми
        this.modalContainer.classList.remove('modal-window-open');

        // ищем все кнопки, по клику на которые должна открываться данная модалка
        const openModalButtons = document.querySelectorAll(openButtonsSelector);

        // на каждую такую кнопку навешиваем обработчик события на клик, чтобы открывать эту модалку
        openModalButtons.forEach(button => {
            button.addEventListener('click', () => this.toggle())
        });

        // ищем все кнопки закрытия этой модалки внутри самого модального онка
        const modalCloseButton = document.querySelectorAll(`${modalSelector} .button-close-window`);

        // навешиваем на них обработчики событий, чтобы закрывать модалку
        modalCloseButton.forEach(button => button.addEventListener('click', () => this.close()));

        // добавляем эту модалку в массив со всеми созданными модалками
        Modal.allModals.push(this);
    }



    /**
     * В это свойство можно будет записать функцию, которая будет вызываться ПЕРЕД открытием модального окна
     * На случай если вам что-то нужно сделать прежде чем моадлка будет открыта
     * По умолчанию равно undefined (ничего не нужно делать)
     */
    beforeOpen = undefined;

    /**
     * В это свойство можно будет записать функцию, которая будет вызываться ПОСЛЕ открытием модального окна
     * На случай если вам что-то нужно сделать после открытия модалки
     * По умолчанию равно undefined (ничего не нужно делать)
     */
    afterOpen = undefined;

    /**
     * Открывает модальное окно
     */
    open() {
        // если есть функция, которую нужно вызвать перед окрытием модельного окна, то вызываем её
        if (typeof this.beforeOpen === 'function') {
            this.beforeOpen();
        }

        // прежде чем открыть эту конкретную модалку - закроем все остальные
        Modal.allModals.filter(modal => modal.opened).forEach(modal => modal.close());

        // открываем эту модалку путем добавления класса
        this.modalContainer.classList.add('modal-window-open');

        // меняем состояние модалки, указываем, что она открыта
        this.opened = true;

        // блокируем прокрутку всей html страницы,
        // чтобы когда мы крутим колесиком мыши - страница не двигалась туда-сюда
        document.body.style.overflow = 'hidden';

        // если есть функция, которую нужно вызвать после окрытия модельного окна, то вызываем её
        if (typeof this.afterOpen === 'function') {
            this.afterOpen();
        }
    }



    /**
     * В это свойство можно записать функцию, которая будет вызываться ПЕРЕД ЗАКРЫТИЕМ модального окна
     * На случай если вам что-то нужно сделать прежде чем моадлка будет закрыта
     * По умолчанию равно undefined (ничего не нужно делать)
     */
    beforeClose = undefined;

    /**
     * В это свойство можно записать функцию, которая будет вызываться ПОСЛЕ ЗАКРЫТИЯ модального окна
     * На случай если вам что-то нужно сделать после закрытия модалки
     * По умолчанию равно undefined (ничего не нужно делать)
     */
    afterClose = undefined;

    close() {
        // если есть функция, которую нужно вызвать перед окрытием модельного окна, то вызываем её
        if (typeof this.beforeClose === 'function') {
            this.beforeClose();
        }

        // удаляем класс, который делал модельное окно открытым
        this.modalContainer.classList.remove('modal-window-open');

        // меняем состояние модалки
        this.opened = false;

        // возвращаем возможность скролить документа
        document.body.style.overflow = '';

        // если есть функция, которую нужно вызвать перед окрытием модельного окна, то вызываем её
        if (typeof this.afterClose === 'function') {
            this.afterClose();
        }
    }


    /**
     * Переключает состояние модального окна. Если модалка была открыта, то вызывается её закрытие, и наоборот
     */
    toggle() {
        if (!this.opened) {
            this.open()
        } else {
            this.close();
        }
    }
}

document.addEventListener('DOMContentLoaded', function() {
    try {
        new Modal('.modal-window', '.modal-open-button');
    } catch (e) {
        console.error('Ошибка инициализации модального окна:', e.message);
    }
});