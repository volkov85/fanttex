/**
 * SELECT
 * Оживление выпадающих панелей выбора
 */
(function () {
  function initSelects() {
    let selects = document.querySelectorAll(`.select:not(.select--cart)`);

    for (let i = 0; i < selects.length; i++) {
      // Инициализация выпадающей панели
      let selectOpen = selects[i].querySelector(`.select__toggle`);

      dropdownInit(selects[i], true, selectOpen);

      // Открытие/закрытие выпадающей панели
      selectOpen.addEventListener(`click`, (evt) => {
        evt.preventDefault();

        selects[i].classList.toggle(`opened`);
      });

      // Выбор варианта выпадающей панели
      let selectOptions = selects[i].querySelectorAll(`.select__option`);
      let selectOptionsAll = [selectOpen.textContent, ...Array.from(selectOptions).map((option) => {
        return option.textContent;
      })];
      let selectOptionsValuesAll = null;

      if (selectOpen.dataset.value) {
        selectOptionsValuesAll = [selectOpen.dataset.value, ...Array.from(selectOptions).map((option) => {
          return option.dataset.value;
        })];
      }

      for (let j = 0; j < selectOptions.length; j++) {
        selectOptions[j].addEventListener(`click`, (evt) => {
          evt.preventDefault();

          if (!selects[i].classList.contains(`not-selectable`)) {
            let newSelectOptions = selectOptionsAll.filter((option) => {
              return option !== evt.target.textContent;
            });
            let newSelectOptionsValues = null;

            if (selectOptionsValuesAll) {
              newSelectOptionsValues = selectOptionsValuesAll.filter((option) => {
                return option !== evt.target.dataset.value;
              });
            }

            selectOpen.textContent = evt.target.textContent;

            if (selectOptionsValuesAll) {
              selectOpen.dataset.value = evt.target.dataset.value;
            }

            for (let k = 0; k < newSelectOptions.length; k++) {
              selectOptions[k].textContent = newSelectOptions[k];

              if (selectOptionsValuesAll) {
                selectOptions[k].dataset.value = newSelectOptionsValues[k];
              }
            }

            selects[i].classList.add(`selected`);
          }

          selects[i].classList.remove(`opened`);
        });
      }
    }
  }

  window.initSelects = initSelects;
})();
