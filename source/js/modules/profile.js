/**
 * PROFILE
 * Оживление страницы профиля
 */
(function () {
  function initProfile() {
    // Оживление попапа подтверждения телефона и почты
    let verificationPopup = document.querySelector(`.popup--verification`);

    if (verificationPopup) {
      let verificationLinks = document.querySelectorAll(`.verification .form-field-verify`);

      let verificationField = null;

      for (let i = 0; i < verificationLinks.length; i++) {
        verificationLinks[i].addEventListener(`click`, (evt) => {
          evt.preventDefault();

          verificationField = evt.target.parentElement;

          if (!verificationField.classList.contains(`filled`)) {
            verificationField.classList.add(`invalid`);
            verificationField.firstChild.focus();
          } else {
            window.fanttex.shownBlock = showElement(verificationPopup, window.fanttex.overlay, true);
          }
        });
      }

      let verificationPopupInput = verificationPopup.querySelector(`.form-field input`);

      verificationPopupInput.addEventListener(`input`, (evt) => {
        if (evt.target.value.length === 4) {
          window.fanttex.shownBlock = hideElement(verificationPopup, window.fanttex.overlay, 500);

          evt.target.value = ``;

          verificationField.classList.add(`verified`);
        }
      });
    }

    // Оживление кнопок привязки соцсетей на странице профиля
    let profileSocialBtns = document.querySelectorAll(`.social--bind .social__link`);

    for (let i = 0; i < profileSocialBtns.length; i++) {
      profileSocialBtns[i].addEventListener(`click`, (evt) => {
        evt.preventDefault();

        profileSocialBtns[i].classList.toggle(`linked`);
      });
    }
  }

  window.initProfile = initProfile;
})();
