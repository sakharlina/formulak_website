"use strict";

document.querySelectorAll('.input-form').forEach(form => {
    form.addEventListener('submit', handlerequestInputFormSubmit);
    
    const modalWindow = form.closest('.modal-window-request');
    const closeButton = modalWindow?.querySelector('.button-close-window');
    
    if (closeButton) {
        closeButton.addEventListener('click', () => {
            form.style.display = 'flex';
            form.reset();
            
            const successContainer = form.closest('.container')?.querySelector('.modal-window__success-message');
            if (successContainer) {
                successContainer.style.display = 'none';
                successContainer.classList.remove('modal-window__success-message-show');
            }
            
            const errorContainer = form.closest('.container')?.querySelector('.modal-window__errors');
            if (errorContainer) {
                errorContainer.textContent = '';
            }
            
            blockrequestInputForm(false, form);
        });
    }
});

function handlerequestInputFormSubmit(event) {
    event.preventDefault();
    const form = event.currentTarget;
    
    const container = form.closest('.container');
    const requestErrorContainer = container?.querySelector('.modal-window__errors');
    const requestSuccessContainer = container?.querySelector('.modal-window__success-message');
    
    blockrequestInputForm(true, form);
    if (requestErrorContainer) requestErrorContainer.innerHTML = '';

    sendrequestInputForm(form)
        .then(responseToJSON)
        .then(data => {
            handleRequestResult(data, form, requestSuccessContainer);
        })
        .catch(error => processRequestError(error, requestErrorContainer))
        .finally(() => blockrequestInputForm(false, form));
}

function blockrequestInputForm(isDisabled, form) {
    const inputs = form.querySelectorAll('.input-form-elem');
    inputs?.forEach(input => input.readOnly = isDisabled);

    const buttons = form.querySelectorAll('.request-button');
    buttons?.forEach(item => item.disabled = isDisabled);
}

function sendrequestInputForm(form) {
    const formData = new FormData(form);

    return fetch('http://formulakarting.ru/verification.php', {
        method: 'POST',
        body: formData,
    });
}

function responseToJSON(response) {
    return response.json();
}

function handleRequestResult(data, form, successContainer) {   
    if (!data || typeof data !== 'object') {
        throw new Error('Некорректный ответ от сервера');
    }

    if (data.success === false) {
        throw new Error(data.message || 'Произошла неожиданная ошибка. Попробуйте еще раз');
    }
    
    form.style.display = 'none';
    showThanksBlock(successContainer);
}

function showThanksBlock(successContainer) {
    successContainer.style.display = 'block';
    successContainer.classList.add('modal-window__success-message-show');
}

function hideThanksBlock(successContainer) {
    successContainer?.classList.remove('modal-window__success-message-show');
    successContainer.style.display = 'none';
}

function processRequestError(error, errorContainer) {
    if (errorContainer) {
        errorContainer.innerHTML = error.message || 'Неизвестная ошибка';
    }
}

function resetModalWindow(form, errorContainer, successContainer) {
    if (errorContainer) errorContainer.innerHTML = '';
    form.reset();
    form.style.display = 'block';
    blockrequestInputForm(false, form);
    hideThanksBlock(successContainer);
}