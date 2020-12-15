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

    // Создание анимации для иконки гамбургера меню в мобильной навигации
    let mainNavMobileMenuOpen = document.querySelector(`.menu-profile__link--menu`);
    let mainNavMobileMenuClose = document.querySelector(`.main-nav__close`);

    let filtersNavCloseBtn = document.querySelector(`.filters-nav__close`);

    let navMobileMenuBtns = [mainNavMobileMenuOpen, mainNavMobileMenuClose, filtersNavCloseBtn];

    for (let i = 0; i < navMobileMenuBtns.length; i++) {
      if (navMobileMenuBtns[i]) {
        if (navMobileMenuBtns[i].querySelector(`svg`)) {
          navMobileMenuBtns[i].removeChild(navMobileMenuBtns[i].querySelector(`svg`));
        }

        let navMobileMenuOpenAnim = lottie.loadAnimation({
          container: navMobileMenuBtns[i],
          renderer: `svg`,
          loop: false,
          autoplay: false,
          path: `animations/icon_menu.json`,
          name: `mainNavMenuIcon`,
          rendererSettings: {
            progressiveLoad: false
          }
        });

        navMobileMenuOpenAnim.addEventListener(`data_ready`, () => {
          navMobileMenuBtns[i].style.backgroundImage = `none`;
        });
      }
    }

    // Появление главной навигации
    let showMainNav = () => {
      if (headerSearchBar.classList.contains(`shown`)) {
        hideSearchBar();
      }

      if (filtersNav && filtersNav.classList.contains(`shown`)) {
        hideFiltersNav();
      }

      lottie.setDirection(1, `mainNavMenuIcon`);
      lottie.play(`mainNavMenuIcon`);

      mainNav.classList.add(`shown`);
      window.fanttex.shownBlock = mainNav;

      window.fanttex.overlay.classList.add(`transparent`);

      document.body.style.top = `-${window.scrollY}px`;
      document.body.classList.add(`page--block`);

      mainNavSwiper.init();
      mainNavSwiper.update();
    };

    mainNavOpen.addEventListener(`click`, (evt) => {
      evt.preventDefault();

      showMainNav();
    });

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
    let hideMainNav = () => {
      lottie.goToAndStop(20, true, `mainNavMenuIcon`);
      lottie.setDirection(-1, `mainNavMenuIcon`);
      lottie.play(`mainNavMenuIcon`);

      window.fanttex.shownBlock = hideElement(mainNav, window.fanttex.overlay, 500);
    };

    mainNavMobileMenuOpen.addEventListener(`click`, (evt) => {
      evt.preventDefault();

      if (filtersNav && filtersNav.classList.contains(`shown`)) {
        hideFiltersNav();
      } else if (mainNav.classList.contains(`shown`)) {
        hideMainNav();
      } else {
        showMainNav();
      }
    });

    mainNavMobileMenuClose.addEventListener(`click`, (evt) => {
      evt.preventDefault();

      hideMainNav();
    });

    let mainNavLinks = mainNav.querySelectorAll(`.menu-categories__link, .menu-main__link, .menu-profile__link`);

    for (let i = 0; i < mainNavLinks.length; i++) {
      mainNavLinks[i].addEventListener(`click`, () => {
        hideMainNav();
      });
    }

    /**
     * FILTERS NAV
     * Оживление панели фильтров для мобильных
     */
    let filtersNav = document.querySelector(`.filters-nav`);
    let filtersNavOpenBtn = document.querySelector(`.filters__mobile-open`);

    // Появление панели фильтров
    let showFiltersNav = () => {
      if (headerSearchBar.classList.contains(`shown`)) {
        hideSearchBar();
      }

      lottie.setDirection(1, `mainNavMenuIcon`);
      lottie.play(`mainNavMenuIcon`);

      filtersNav.classList.add(`shown`);
      window.fanttex.shownBlock = filtersNav;

      window.fanttex.overlay.classList.add(`transparent`);

      document.body.style.top = `-${window.scrollY}px`;
      document.body.classList.add(`page--block`);
    };

    if (filtersNavOpenBtn) {
      filtersNavOpenBtn.addEventListener(`click`, (evt) => {
        evt.preventDefault();

        showFiltersNav();
      });
    }

    // Закрытие панели фильтров
    let hideFiltersNav = () => {
      lottie.goToAndStop(20, true, `mainNavMenuIcon`);
      lottie.setDirection(-1, `mainNavMenuIcon`);
      lottie.play(`mainNavMenuIcon`);

      window.fanttex.shownBlock = hideElement(filtersNav, window.fanttex.overlay, 500);
    };

    if (filtersNavCloseBtn) {
      filtersNavCloseBtn.addEventListener(`click`, (evt) => {
        evt.preventDefault();

        hideFiltersNav();
      });
    }

    /**
     * SEARCH BAR
     * Оживление панели поиска
     */
    let header = document.querySelector(`.header`);
    let headerSearchBar = header.querySelector(`.header__middle`);

    let searchInput = document.querySelector(`.search__field input`);

    let mobileNavSearchLink = document.querySelector(`.menu-profile__link--search`);

    // Открытие панели поиска
    let showSearchBar = () => {
      if (mainNav.classList.contains(`shown`)) {
        hideMainNav();
      }

      if (filtersNav && filtersNav.classList.contains(`shown`)) {
        hideFiltersNav();
      }

      header.style.zIndex = 16;

      headerSearchBar.classList.add(`shown`);
      window.fanttex.shownBlock = headerSearchBar;

      searchInput.focus();

      window.fanttex.overlay.classList.add(`transparent`);

      document.body.style.top = `-${window.scrollY}px`;
      document.body.classList.add(`page--block`);
    };

    // Закрытие панели поиска
    let hideSearchBar = () => {
      header.style.removeProperty(`z-index`);

      window.fanttex.shownBlock = hideElement(headerSearchBar, window.fanttex.overlay, 500);
    };

    mobileNavSearchLink.addEventListener(`click`, (evt) => {
      evt.preventDefault();

      if (headerSearchBar.classList.contains(`shown`)) {
        hideSearchBar();
      } else {
        showSearchBar();
      }
    });

    // Закрытие всех панелей при переходе на другую страницу
    let mobileNavLinks = document.querySelectorAll(`.mobile-nav .menu-profile__link:not(.menu-profile__link--menu):not(.menu-profile__link--search)`);

    for (let i = 0; i < mobileNavLinks.length; i++) {
      mobileNavLinks[i].addEventListener(`click`, () => {
        if (mainNav.classList.contains(`shown`)) {
          hideMainNav();
        }

        if (headerSearchBar.classList.contains(`shown`)) {
          hideSearchBar();
        }

        if (filtersNav && filtersNav.classList.contains(`shown`)) {
          hideFiltersNav();
        }
      });
    }
  }

  window.initMainNav = initMainNav;
})();
