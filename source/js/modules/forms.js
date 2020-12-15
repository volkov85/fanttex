/**
 * FORMS
 * Оживление форм
 */
(function () {
  function initForms() {
    let forms = document.querySelectorAll(`.form`);

    if (forms.length) {
      for (let i = 0; i < forms.length; i++) {
        let formFields = forms[i].querySelectorAll(`.form-field, .form-check`);

        // Проверка, есть ли значение в полях форм
        for (let j = 0; j < formFields.length; j++) {
          if (formFields[j].firstChild.required) {
            formFields[j].firstChild.dataset.required = true;
            formFields[j].firstChild.required = false;
          }

          if (formFields[j].firstChild.type === `email`) {
            formFields[j].firstChild.type = `text`;
          }

          if (formFields[j].classList.contains(`form-field`)) {
            formFields[j].addEventListener(`input`, () => {
              if (formFields[j].firstChild.value) {
                formFields[j].classList.add(`filled`);
                formFields[j].classList.remove(`invalid`);
                formFields[j].classList.remove(`invalid-email`);
              } else {
                formFields[j].classList.remove(`filled`);
              }
            });
          } else {
            formFields[j].addEventListener(`change`, () => {
              if (formFields[j].firstChild.checked) {
                formFields[j].classList.add(`filled`);
                formFields[j].classList.remove(`invalid`);
                formFields[j].classList.remove(`invalid-email`);
              } else {
                formFields[j].classList.remove(`filled`);
              }
            });
          }
        }

        // Добавление маски для поля ввода телефона
        let formTelInput = forms[i].querySelector(`.form-field [type=tel]`);

        if (formTelInput) {
          let formTelInputMask = IMask(formTelInput, {
            mask: `+{7} (000) 000 - 00 - 00`,
            lazy: true,
            placeholderChar: ` `
          });

          formTelInput.addEventListener(`focus`, () => {
            formTelInputMask.updateOptions({
              lazy: false
            });
          });

          formTelInput.addEventListener(`blur`, () => {
            formTelInputMask.updateOptions({
              lazy: true
            });

            if (!formTelInputMask.masked.rawInputValue || formTelInputMask.masked.rawInputValue === `7`) {
              formTelInputMask.value = ``;
              formTelInput.parentElement.classList.remove(`filled`);
            }
          });
        }

        // Проверка на обязательность заполнения поля ввода
        forms[i].addEventListener(`submit`, (evt) => {
          for (let j = formFields.length - 1; j >= 0; j--) {
            if (!formFields[j].classList.contains(`filled`) && formFields[j].firstChild.dataset.required === `true`) {
              evt.preventDefault();

              formFields[j].classList.add(`invalid`);
              formFields[j].firstChild.focus();
              continue;
            }

            // Проверка на корректность заполнения поля ввода email
            if (formFields[j].firstChild.name === `email` && !formFields[j].firstChild.value.match(/^(([^<>()\[\]\.,;:\s@\"]+(\.[^<>()\[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\.,;:\s@\"]+\.)+[^<>()[\]\.,;:\s@\"]{2,})$/i)) {
              evt.preventDefault();

              formFields[j].classList.add(`invalid`);
              formFields[j].classList.add(`invalid-email`);
              formFields[j].firstChild.focus();
            }
          }
        });
      }
    }
  }

  window.initForms = initForms;
})();
