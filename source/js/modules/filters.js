/**
 * FILTERS
 * Оживление фильтров каталога
 */
(function () {
  function initFilters() {
    /**
     * SELECTIONS
     * Оживление выпадающей панели фильтра цены
     */
    let selectionPrice = document.querySelector(`.selection--price`);

    if (selectionPrice) {
      // Инициализация фильтра цены
      let selectionPriceOpen = selectionPrice.querySelector(`.selection__toggle`);

      let selectionPriceInputMin = selectionPrice.querySelector(`.selection__range-min`);
      let selectionPriceInputMax = selectionPrice.querySelector(`.selection__range-max`);

      dropdownInit(selectionPrice, selectionPriceInputMin, selectionPriceInputMax);

      // Открытие/закрытие фильтра цены
      let selectionPriceSelectedMin = selectionPriceOpen.querySelector(`.selection__toggle-min-price`);
      let selectionPriceSelectedMax = selectionPriceOpen.querySelector(`.selection__toggle-max-price`);

      selectionPriceOpen.addEventListener(`click`, (evt) => {
        evt.preventDefault();

        selectionPrice.classList.toggle(`opened`);

        if (!selectionPriceInputMin.value) {
          selectionPriceInputMin.value = selectionPriceSelectedMin.textContent ? +selectionPriceSelectedMin.textContent : +selectionPriceInputMin.min;
        }

        if (!selectionPriceInputMax.value) {
          selectionPriceInputMax.value = selectionPriceSelectedMax.textContent ? +selectionPriceSelectedMax.textContent : +selectionPriceInputMax.max;
        }

        selectionPriceInputMin.focus();
      });

      // Очистка значения фильтра цены
      let selectionPriceRemove = selectionPrice.querySelector(`.selection__button-remove`);

      selectionPriceRemove.addEventListener(`click`, (evt) => {
        evt.preventDefault();

        selectionPrice.classList.remove(`selected`);
        selectionPrice.classList.remove(`opened`);

        selectionPriceSelectedMin.textContent = ``;
        selectionPriceSelectedMax.textContent = ``;

        selectionPriceInputMin.value = ``;
        selectionPriceInputMax.value = ``;

        selectionPriceInputMax.min = +selectionPriceInputMin.min;
        selectionPriceInputMin.max = +selectionPriceInputMax.max;
      });

      // Ввод значения фильтра цены
      let selectionPriceSelectBtn = selectionPrice.querySelector(`.selection__button-select`);

      selectionPriceInputMin.addEventListener(`input`, (evt) => {
        selectionPriceInputMax.min = +evt.target.value;
      });

      selectionPriceInputMax.addEventListener(`input`, (evt) => {
        selectionPriceInputMin.max = +evt.target.value;
      });

      selectionPriceSelectBtn.addEventListener(`click`, (evt) => {
        evt.preventDefault();

        if (selectionPriceInputMin.value || selectionPriceInputMax.value) {
          if (selectionPriceInputMax.value && +selectionPriceInputMin.value > +selectionPriceInputMax.value) {
            selectionPriceInputMax.value = +selectionPriceInputMin.value;
          }

          selectionPriceSelectedMin.textContent = selectionPriceInputMin.value ? +selectionPriceInputMin.value : +selectionPriceInputMin.min;
          selectionPriceSelectedMax.textContent = selectionPriceInputMax.value ? +selectionPriceInputMax.value : +selectionPriceInputMax.max;

          selectionPrice.classList.add(`selected`);
        }

        selectionPrice.classList.remove(`opened`);
      });
    }

    /**
     * Оживление выпадающих панелей фильтров
     */
    let selections = document.querySelectorAll(`.filters .selection:not(.selection--price)`);

    for (let i = 0; i < selections.length; i++) {
      // Инициализация фильтра
      let selectionOpen = selections[i].querySelector(`.selection__toggle`);

      let selectionSearchInput = selections[i].querySelector(`.selection__search input`);
      let selectionOptions = selections[i].querySelectorAll(`.selection__item`);

      dropdownInit(selections[i], selectionSearchInput, ...Array.from(selectionOptions).map((option) => {
        return option.firstChild;
      }));

      // Открытие/закрытие фильтра
      selectionOpen.addEventListener(`click`, (evt) => {
        evt.preventDefault();

        shiftDropdownList(selections[i], 270);

        selectionSearchInput.focus();
      });

      // Считывание значения фильтра при загрузке страницы
      let selectionSelectedName = selectionOpen.querySelector(`.selection__toggle-name`);
      let selectionSelectedQuantity = selectionOpen.querySelector(`.selection__toggle-quantity`);

      let applySelectionOptions = () => {
        let selectionOptionsChecked = [];

        for (let j = 0; j < selectionOptions.length; j++) {
          if (selectionOptions[j].firstChild.checked) {
            selectionOptionsChecked.push(selectionOptions[j].querySelector(`.selection__item-name`).textContent);
          }
        }

        if (selectionOptionsChecked.length > 1) {
          selectionSelectedName.textContent = ``;
          selectionSelectedQuantity.textContent = selectionOptionsChecked.length;

          selections[i].classList.add(`selected`);
          selections[i].classList.add(`multiple`);
        } else if (selectionOptionsChecked.length === 1) {
          selectionSelectedName.textContent = selectionOptionsChecked[0];
          selectionSelectedQuantity.textContent = ``;

          selections[i].classList.add(`selected`);
          selections[i].classList.remove(`multiple`);
        }
      };

      applySelectionOptions();

      // Очистка значения фильтра
      let selectionRemove = selections[i].querySelector(`.selection__button-remove`);

      selectionRemove.addEventListener(`click`, (evt) => {
        evt.preventDefault();

        selections[i].classList.remove(`selected`);
        selections[i].classList.remove(`multiple`);
        selections[i].classList.remove(`opened`);
        selections[i].firstChild.lastChild.style.removeProperty(`left`);

        selectionSelectedName.textContent = ``;
        selectionSelectedQuantity.textContent = ``;

        selectionSearchInput.value = ``;

        for (let j = 0; j < selectionOptions.length; j++) {
          selectionOptions[j].firstChild.checked = false;
          selectionOptions[j].style.removeProperty(`display`);
        }
      });

      // Выбор значения фильтра
      let selectionSelectBtn = selections[i].querySelector(`.selection__button-select`);

      selectionSelectBtn.addEventListener(`click`, (evt) => {
        evt.preventDefault();

        applySelectionOptions();

        selections[i].classList.remove(`opened`);
        selections[i].firstChild.lastChild.style.removeProperty(`left`);
      });

      // Поиск по фильтру
      selectionSearchInput.addEventListener(`input`, (evt) => {
        for (let j = 0; j < selectionOptions.length; j++) {
          if (selectionOptions[j].querySelector(`.selection__item-name`).textContent.toLowerCase().includes(evt.target.value.toLowerCase())) {
            selectionOptions[j].style.removeProperty(`display`);
          } else {
            selectionOptions[j].style.display = `none`;
          }
        }
      });
    }
  }

  window.initFilters = initFilters;
})();
