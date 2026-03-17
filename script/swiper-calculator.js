"use strict";

document.addEventListener('DOMContentLoaded', function() {
    const prices = {
        '1': 50000, '2': 120000, '3': 200000,
        '4': 30000, '5': 45000, '6': 80000,
        '7': 25000, '8': 35000, '9': 60000,
        '10': 20000, '11': 35000, '12': 50000,
        '13': 15000, '14': 20000, '15': 25000
    };
    
    const descriptions = {
        '1': 'Двигатель: 7 л.с.', '2': 'Двигатель: 25 л.с.', '3': 'Двигатель: 40 л.с.',
        '4': 'Подвеска: жесткая', '5': 'Подвеска: мягкая', '6': 'Подвеска: активная',
        '7': 'Трансмиссия: цепной привод', '8': 'Трансмиссия: ременной привод', '9': 'Трансмиссия: гидротрансформатор',
        '10': 'Диски: литые', '11': 'Диски: кованные', '12': 'Диски: композитные',
        '13': 'Резина: слик-резина', '14': 'Резина: интромедиат-резина', '15': 'Резина: рейсинговые дождевые шины'
    };
    
    const selectedOptions = {
        engine: null,
        suspension: null,
        transmission: null,
        rims: null,
        tyre: null
    };

    const kartSwiper = new Swiper('.custom-kart-calculator', {
        direction: 'horizontal',
        loop: false,
        
        navigation: {
            nextEl: '.swiper-button-next',
            prevEl: '.swiper-button-prev'
        },
        
        effect: 'fade',
        fadeEffect: { 
            crossFade: true
        },
        
        observer: true,
        observeParents: true,
        observeSlideChildren: true,
    });

    const nextButton = document.querySelector('.swiper-button-next');
    toggleNextButton(false);

    document.querySelectorAll('.custom-radio-button').forEach(radio => {
        radio.addEventListener('change', function() {
            if (this.checked) {
                const slideIndex = getSlideIndex(this);
                
                switch(slideIndex) {
                    case 0: selectedOptions.engine = this.value; break;
                    case 1: selectedOptions.suspension = this.value; break;
                    case 2: selectedOptions.transmission = this.value; break;
                    case 3: selectedOptions.rims = this.value; break;
                    case 4: selectedOptions.tyre = this.value; break;
                }
                
                toggleNextButton(true);
                updateFinalInfo();
            }
        });
    });
    
    kartSwiper.on('slideChange', function() {
        if (kartSwiper.activeIndex === 5) {
            updateFinalInfo();
        }
        else {
            const currentSlide = kartSwiper.slides[kartSwiper.activeIndex];
            const hasSelection = currentSlide.querySelector('.custom-radio-button:checked') !== null;
            toggleNextButton(hasSelection);
        }
    });
    
    function toggleNextButton(enable) {
        if (enable) {
            nextButton.style.opacity = '1';
            nextButton.style.pointerEvents = 'auto';
            nextButton.classList.remove('swiper-button-disabled');
        } else {
            nextButton.style.opacity = '0.5';
            nextButton.style.pointerEvents = 'none';
            nextButton.classList.add('swiper-button-disabled');
        }
    }
    
    function getSlideIndex(radioButton) {
        const parentSlide = radioButton.closest('.swiper-slide');
        const slides = document.querySelectorAll('.swiper-slide');
        return Array.from(slides).indexOf(parentSlide);
    }
    
    function updateFinalInfo() {
        const allSelected = Object.values(selectedOptions).every(option => option !== null);
        
        if (allSelected) {
            let totalPrice = 0;
            let descriptionHTML = '';
            
            for (const value of Object.values(selectedOptions)) {
                totalPrice += prices[value];
                descriptionHTML += `<p>${descriptions[value]}</p>`;
            }
            
            const infoElement = document.querySelector('.finished-kart_info');
            const priceElement = document.querySelector('.finished-kart_price');
            
            if (infoElement) infoElement.innerHTML = descriptionHTML;
            if (priceElement) priceElement.textContent = `${totalPrice.toLocaleString()} руб.`;

        }
    }

    document.querySelector('.close-finished-slide')?.addEventListener('click', function() {
        kartSwiper.slideTo(0);
        toggleNextButton(false);
        Object.keys(selectedOptions).forEach(key => selectedOptions[key] = null);
    });
});