"use strict";

function lockBodyScroll(shouldLock) {
    const body = document.body;
    const html = document.documentElement;
    
    if (shouldLock) {
        const scrollTop = window.pageYOffset || html.scrollTop;
        body.style.position = 'fixed';
        body.style.top = `-${scrollTop}px`;
        body.style.width = '100%';
        body.classList.add('menu-open');
    } else {
        const scrollTop = Math.abs(parseInt(body.style.top || '0'));
        body.style.position = '';
        body.style.top = '';
        body.style.width = '';
        body.classList.remove('menu-open');
        window.scrollTo(0, scrollTop);
    }
}

// Функция для закрытия подменю
function closeSubmenu() {
    const navigation = document.querySelector('.mobile-menu_navigation');
    const submenu = document.querySelector('.mobile-submenu');
    if (navigation && submenu) {
        navigation.classList.remove('submenu-active');
        submenu.classList.remove('active');
    }
}

document.addEventListener('DOMContentLoaded', function() {
    const mobileMenuButton = document.querySelector('.header-mobile-menu_button');
    const mobileMenuModal = document.querySelector('.mobile-menu-modal');
    const closeButton = document.querySelector('.mobile-menu .button-close-window');
    
    if (mobileMenuButton && mobileMenuModal) {
        mobileMenuButton.addEventListener('click', function() {
            mobileMenuModal.classList.add('modal-window-open');
            lockBodyScroll(true);
            // Закрываем подменю при открытии меню (на случай если оно было открыто ранее)
            closeSubmenu();
        });
        
        closeButton.addEventListener('click', function() {
            mobileMenuModal.classList.remove('modal-window-open');
            lockBodyScroll(false);
            // Закрываем подменю при закрытии меню
            closeSubmenu();
        });
        
        // Закрытие по клику на бэкдроп
        document.querySelector('.modal-backdrop')?.addEventListener('click', function() {
            mobileMenuModal.classList.remove('modal-window-open');
            lockBodyScroll(false);
            // Закрываем подменю при закрытии меню
            closeSubmenu();
        });
        
        // Обработка ссылок в меню
        const mobileMenuLinks = document.querySelectorAll('.mobile-menu_navigation a');
        
        mobileMenuLinks.forEach(link => {
            link.addEventListener('click', function(e) {
                e.preventDefault();
                mobileMenuModal.classList.remove('modal-window-open');
                lockBodyScroll(false);
                // Закрываем подменю при переходе по ссылке
                closeSubmenu();
                
                setTimeout(() => {
                    window.location.href = this.getAttribute('href');
                }, 300);
            });
        });
    }
});