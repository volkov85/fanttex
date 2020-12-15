/**
 * BILLING PROFILE
 * Оживление страницы платёжного профиля
 */
(function () {
  function initBillingProfile() {
    // Оживление выпадающей панели выбора платёжного профиля
    let selectBillingProfile = document.querySelector(`.select--cart`);

    if (selectBillingProfile) {
      // Инициализация выпадающей панели
      let selectOpen = selectBillingProfile.querySelector(`.select__toggle`);

      if (!selectBillingProfile.classList.contains(`select--billing-profile`)) {
        dropdownInit(selectBillingProfile, selectOpen);

        // Открытие/закрытие выпадающей панели
        selectOpen.addEventListener(`click`, (evt) => {
          evt.preventDefault();

          selectBillingProfile.classList.toggle(`opened`);
        });
      }

      // Выбор варианта выпадающей панели
      let selectOptions = selectBillingProfile.querySelectorAll(`.select__option`);

      for (let i = 0; i < selectOptions.length; i++) {
        selectOptions[i].addEventListener(`click`, (evt) => {
          evt.preventDefault();

          if (!selectOptions[i].classList.contains(`not-selectable`)) {
            selectOpen.textContent = evt.target.textContent;

            selectBillingProfile.classList.add(`selected`);
          }

          if (!selectBillingProfile.classList.contains(`select--billing-profile`)) {
            selectBillingProfile.classList.remove(`opened`);
          }
        });
      }
    }
  }

  window.initBillingProfile = initBillingProfile;
})();
