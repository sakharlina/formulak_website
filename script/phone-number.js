"use strict;"

function setCursorPosition(pos, e) {
  e.focus();
  if (e.setSelectionRange) e.setSelectionRange(pos, pos);
  else if (e.createTextRange) {
    var range = e.createTextRange();
    range.collapse(true);
    range.moveEnd("character", pos);
    range.moveStart("character", pos);
    range.select();
  }
}

function mask(e) {
  var matrix = '+7 (___) ___-__-__';
  var val = this.value.replace(/\D/g, "");
  
  // делаем так, чтобы номер всегда начинался с 7
  if (!val.startsWith('7')) {
    val = '7' + val.replace(/7/g, '');
  }
  
  // ограничиваем ввод до 10 цифр после первой 7
  val = val.substring(0, 11);
  
  // формируется новое значение
  var i = 0;
  var newValue = matrix.replace(/[_\d]/g, function(a) {
    return i < val.length ? val.charAt(i++) : "_";
  });
  
  this.value = newValue;
  
  // позиционируем курсор
  var cursorPos = this.selectionStart;
  setCursorPosition(cursorPos, this);
}

function initPhoneMask(input) {
  input.value = '+7 (___) ___-__-__';
  
  input.addEventListener("input", mask, false);
  
  input.addEventListener("click", function(e) {
    var cursorPos = Math.max(4, this.selectionStart);
    setCursorPosition(cursorPos, this);
  });
  
  input.addEventListener("keydown", function(e) {
    var cursorPos = this.selectionStart;
    var value = this.value;
    
    // корректная обработка Backspace
    if (e.key === 'Backspace' && cursorPos > 4) {
      e.preventDefault();
      
      // находим предыдущую цифру
      var prevDigitPos = -1;
      for (var i = cursorPos - 1; i >= 4; i--) {
        if (/\d/.test(value[i])) {
          prevDigitPos = i;
          break;
        }
      }
      
      if (prevDigitPos !== -1) {
        // замена цифры на подчеркивание
        this.value = value.substring(0, prevDigitPos) + '_' + value.substring(prevDigitPos + 1);
        setCursorPosition(prevDigitPos, this);
      }
    }
    
    // корректная обработка Delete
    else if (e.key === 'Delete' && cursorPos < 18) {
      e.preventDefault();
      
      // находим следующую цифру
      var nextDigitPos = -1;
      for (var i = cursorPos; i < value.length; i++) {
        if (/\d/.test(value[i])) {
          nextDigitPos = i;
          break;
        }
      }
      
      if (nextDigitPos !== -1) {
        // заменяем цифру на подчеркивание
        this.value = value.substring(0, nextDigitPos) + '_' + value.substring(nextDigitPos + 1);
        setCursorPosition(cursorPos, this);
      }
    }
    
    // блокируем ввод перед 4 позицией
    else if (cursorPos < 4 && e.key.length === 1 && !e.ctrlKey) {
      e.preventDefault();
      setCursorPosition(4, this);
    }
  });
  
  input.addEventListener("paste", function(e) {
    e.preventDefault();
  });
  
  input.addEventListener("select", function(e) {
    if (this.selectionStart < 4) {
      this.setSelectionRange(4, this.selectionEnd);
    }
  });
}

window.addEventListener("DOMContentLoaded", function() {
  var phoneInputs = document.querySelectorAll('.phone-number');
  
  // применяем маску ко всем найденным элементам
  phoneInputs.forEach(function(input) {
    initPhoneMask(input);
  });
});