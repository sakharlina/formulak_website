document.addEventListener('DOMContentLoaded', function() {
    const servicesItem = document.querySelector('.elem_uslugi');
    const submenu = document.querySelector('.mobile-submenu');
    const navigation = document.querySelector('.mobile-menu_navigation');

    servicesItem.addEventListener('click', function(e) {
        e.stopPropagation();
        
        // Переключаем классы
        navigation.classList.toggle('submenu-active');
        submenu.classList.toggle('active');
    });

    // Закрываем подменю при клике на другие пункты меню
    document.querySelectorAll('.mobile-menu_elem:not(.elem_uslugi)').forEach(item => {
        item.addEventListener('click', function() {
            navigation.classList.remove('submenu-active');
            submenu.classList.remove('active');
        });
    });
});