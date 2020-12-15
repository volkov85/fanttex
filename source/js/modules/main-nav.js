/**
 * MAIN NAV
 * Оживление главной навигации
 */
(function () {
  function initMainNav() {
    let mainNav = document.querySelector(`.main-nav`);
    let mainNavOpen = document.querySelector(`.menu-categories__link--menu`);

    let mainNavGroupLinks = mainNav.querySelectorAll(`.main-nav__group-link`);
    let mainNavToStart = mainNav.querySelector(`.main-nav__button-back`);

    let mainNavSwiper = new Swiper(`.main-nav__wrapper`, {
      init: false,
      autoHeight: true,
      spaceBetween: 40,
      simulateTouch: false,
      allowTouchMove: false,
      on: {
        init(swiper) {
          if (swiper.activeIndex) {
            mainNavToStart.classList.add(`shown`);
          } else {
            mainNavToStart.classList.remove(`shown`);
          }
        },
        slideChange(swiper) {
          if (swiper.activeIndex) {
            mainNavToStart.classList.add(`shown`);
          } else {
            mainNavToStart.classList.remove(`shown`);
          }
        }
      }
    });

    // Появление главной навигации
    let showMainNav = (isOverlay) => {
      if (isOverlay) {
        mainNav.classList.add(`shown`);
        window.fanttex.shownBlock = mainNav;

        window.fanttex.overlay.classList.add(`transparent`);
      }

      mainNavSwiper.init();
      mainNavSwiper.update();
    };

    let showMainNavOnLargeScreen = () => {
      if (window.matchMedia(`(min-width: 2070px)`).matches) {
        showMainNav(false);
      }
    };

    mainNavOpen.addEventListener(`click`, (evt) => {
      evt.preventDefault();

      if (!window.matchMedia(`(min-width: 2070px)`).matches) {
        showMainNav(true);
      }
    });

    showMainNavOnLargeScreen();

    window.addEventListener(`resize`, showMainNavOnLargeScreen);

    // Определение, находится ли курсор над навигацией
    mainNav.addEventListener(`mouseenter`, setElementHoveredState);

    mainNav.addEventListener(`mouseleave`, unsetElementHoveredState);

    // Переключение разделов внутри главной навигации
    for (let i = 0; i < mainNavGroupLinks.length; i++) {
      mainNavGroupLinks[i].addEventListener(`click`, (evt) => {
        evt.preventDefault();

        mainNavSwiper.slideTo(i + 1);
      });
    }

    mainNavToStart.addEventListener(`click`, (evt) => {
      evt.preventDefault();

      mainNavSwiper.slideTo(0);
    });

    // Закрытие главной навигации
    window.addEventListener(`scroll`, () => {
      if (!window.matchMedia(`(min-width: 2070px)`).matches && mainNav.classList.contains(`shown`) && !mainNav.style.animationDirection && !mainNav.classList.contains(`hovered`)) {
        window.fanttex.shownBlock = hideElement(mainNav, window.fanttex.overlay, 500);
      }
    });

    let mainNavLinks = mainNav.querySelectorAll(`.menu-categories__link, .menu-main__link, .menu-profile__link`);

    for (let i = 0; i < mainNavLinks.length; i++) {
      mainNavLinks[i].addEventListener(`click`, () => {
        if (!window.matchMedia(`(min-width: 2070px)`).matches) {
          window.fanttex.shownBlock = hideElement(mainNav, window.fanttex.overlay, 500);
        }
      });
    }
  }

  window.initMainNav = initMainNav;
})();
