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
      window.fanttex.shownBlock = hideElement(window.fanttex.shownBlock, window.fanttex.overlay, 500);
    });

    /**
     * Закрытие всплывающих окон клавишей ESC
     */
    window.addEventListener(`keydown`, (evt) => {
      if (evt.keyCode === 27) {
        evt.preventDefault();

        if (window.fanttex.shownBlock) {
          window.fanttex.shownBlock = hideElement(window.fanttex.shownBlock, window.fanttex.overlay, 500);
        }
      }
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
     * PRODUCT POPUP
     * Скролл к якорю по ссылкам во всплывающем окне предпросмотра продукта
     */
    let productPopupOtherVariantsLink = document.querySelector(`.product--popup .product__link--other-variants`);
    let productPopupAskQuestionLink = document.querySelector(`.product--popup .product__link--ask`);

    if (productPopupOtherVariantsLink) {
      productPopupOtherVariantsLink.addEventListener(`click`, (evt) => {
        evt.preventDefault();

        // Плавная прокрутка к заданной точке
        let smoothScrollTo = (endY, duration) => {
          let startY = overlay.scrollTop;
          let distanceY = endY - startY;
          let startTime = new Date().getTime();

          let easeInOutQuart = (time, from, distance, duration) => {
            if ((time /= duration / 2) < 1) {
              return distance / 2 * Math.pow(time, 4) + from;
            }

            return -distance / 2 * ((time -= 2) * Math.pow(time, 3) - 2) + from;
          };

          let timer = window.setInterval(() => {
            let time = new Date().getTime() - startTime;
            let newY = easeInOutQuart(time, startY, distanceY, duration);

            if (time >= duration) {
              window.clearInterval(timer);
            }

            window.fanttex.overlay.scrollTo(0, newY);
          }, 1000 / 60);
        };

        smoothScrollTo(document.getElementById(evt.target.hash.substring(1)).offsetTop, 500);
      });

      productPopupAskQuestionLink.addEventListener(`click`, () => {
        window.fanttex.shownBlock = hideElement(window.fanttex.shownBlock, window.fanttex.overlay, 500);
      });
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
