(function () {
  function initPopup() {
    /**
     * OVERLAY
     * Закрытие всплывающих окон по клику на оверлей
     */
    let overlay = document.querySelector(`.overlay`);

    window.fanttex = {};
    window.fanttex.overlay = overlay;
    window.fanttex.shownBlock = null;

    window.fanttex.overlay.lastChild.addEventListener(`click`, () => {
      if (window.fanttex.shownBlock.classList.contains(`main-nav`) || window.fanttex.shownBlock.classList.contains(`filters-nav`)) {
        lottie.goToAndStop(20, true, `mainNavMenuIcon`);
        lottie.setDirection(-1, `mainNavMenuIcon`);
        lottie.play(`mainNavMenuIcon`);
      }

      window.fanttex.shownBlock = hideElement(window.fanttex.shownBlock, window.fanttex.overlay, 500);
    });

    /**
     * Закрытие всплывающих окон кнопкой "Закрыть"
     */
    let popupClose = document.querySelectorAll(`.popup__close`);

    if (popupClose.length) {
      for (let i = 0; i < popupClose.length; i++) {
        popupClose[i].addEventListener(`click`, (evt) => {
          evt.preventDefault();

          window.fanttex.shownBlock = hideElement(window.fanttex.shownBlock, window.fanttex.overlay, 500);
        });
      }
    }

    /**
     * SUBSCRIPTION/AUTHORIZATION POPUP
     * Оживление попапа подписки/авторизации
     */
    let subscriptionAuthorizationPopup = document.querySelector(`.popup--subscription-authorization`);

    if (subscriptionAuthorizationPopup) {
      let subscriptionAuthorizationPopupSwiper = new Swiper(`.popup--subscription-authorization .swiper-container`, {
        init: false,
        autoHeight: true,
        spaceBetween: 30,
        effect: `fade`,
        fadeEffect: {
          crossFade: true
        },
        simulateTouch: false,
        allowTouchMove: false
      });

      // Появление попапа подписки/авторизации
      let showSubscriptionAuthorizationPopup = () => {
        window.fanttex.shownBlock = showElement(subscriptionAuthorizationPopup, window.fanttex.overlay, true);

        subscriptionAuthorizationPopupSwiper.init();
        subscriptionAuthorizationPopupSwiper.update();
      };

      window.setTimeout(() => {
        showSubscriptionAuthorizationPopup();
      }, 1000);

      // Переключение между подпиской и авторизацией
      let popupAuthorizationLink = subscriptionAuthorizationPopup.querySelector(`.popup-form__authorization`);

      popupAuthorizationLink.addEventListener(`click`, (evt) => {
        evt.preventDefault();

        subscriptionAuthorizationPopupSwiper.slideNext();
      });

      let popupSubscriptionLink = subscriptionAuthorizationPopup.querySelector(`.popup-form__subscription`);

      popupSubscriptionLink.addEventListener(`click`, (evt) => {
        evt.preventDefault();

        subscriptionAuthorizationPopupSwiper.slidePrev();
      });
    }
  }

  window.initPopup = initPopup;
})();
