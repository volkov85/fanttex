/**
 * SHARE
 * Оживление социальных кнопок
 */
(function () {
  function initShare() {
    let share = document.querySelector(`.share`);

    if (share) {
      // Инициализация панели социальных кнопок
      let shareOpen = share.querySelector(`.share__toggle`);

      dropdownInit(share, true, shareOpen);

      // Открытие/закрытие панели социальных кнопок
      shareOpen.addEventListener(`click`, (evt) => {
        evt.preventDefault();

        if (navigator.share) {
          navigator.share({
            title: `Fanttex`,
            url: window.location.href
          });
        } else {
          share.classList.toggle(`opened`);
        }
      });
    }
  }

  window.initShare = initShare;
})();
