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

      dropdownInit(share, shareOpen);

      // Открытие/закрытие панели социальных кнопок
      shareOpen.addEventListener(`click`, (evt) => {
        evt.preventDefault();

        if (navigator.share) {
          navigator.share({
            title: `Fanttex`,
            url: window.location.href
          });
        } else {
          shiftDropdownList(share, 190);
        }
      });

      // Копирование ссылки страницы в буфер обмена
      let shareLinkCopy = share.querySelector(`.social__link--link`);

      shareLinkCopy.addEventListener(`click`, (evt) => {
        evt.preventDefault();

        let shareLinkCopyContent = shareLinkCopy.dataset.clipboard;

        navigator.clipboard.writeText(shareLinkCopyContent).then(() => {
          shareLinkCopy.firstChild.textContent = `Ссылка скопирована`;
        }, () => {
          shareLinkCopy.firstChild.textContent = `Ошибка копирования`;
        });
      });

      shareLinkCopy.addEventListener(`mouseleave`, () => {
        shareLinkCopy.firstChild.textContent = `Скопировать ссылку`;
      });
    }
  }

  window.initShare = initShare;
})();
