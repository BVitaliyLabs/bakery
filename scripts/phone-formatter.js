document.addEventListener('DOMContentLoaded', function() {
    var phoneNumberInput = document.querySelector('.phone-input');
    var phoneMask = IMask(phoneNumberInput, {
      mask: '+{380} 00 000 00 00'
    });
  });