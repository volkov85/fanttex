/**
 * MOBILE NAV
 * Оживление мобильного меню
 */
(function () {
  function initMobileNav() {
    let mobileNav = document.querySelector(`.mobile-nav`);

    // Создание анимации для иконки профиля в мобильной навигации
    let mobileNavProfileLink = mobileNav.querySelector(`.menu-profile__link--profile`);

    if (mobileNavProfileLink.querySelector(`svg`)) {
      mobileNavProfileLink.removeChild(mobileNavProfileLink.querySelector(`svg`));
    }

    let mobileNavProfileLinkAnim = lottie.loadAnimation({
      container: mobileNavProfileLink,
      renderer: `svg`,
      loop: false,
      autoplay: false,
      path: `animations/icon_profile.json`,
      name: `mobileNavProfileIcon`,
      rendererSettings: {
        progressiveLoad: false
      }
    });

    mobileNavProfileLinkAnim.addEventListener(`data_ready`, () => {
      mobileNavProfileLink.style.backgroundImage = `none`;
    });

    mobileNavProfileLink.addEventListener(`click`, () => {
      lottie.goToAndStop(1, true, `mobileNavProfileIcon`);
      lottie.play(`mobileNavProfileIcon`);
    });

    // Отслеживание появления экранной клавиатуры на мобильных
    updateWindowSize();
    window.topBarHeight = screen.height - window.innerHeight;
    window.addEventListener(`resize`, resizeThrottler, false);

    let resizeTimeout = null;

    function resizeThrottler() {
      if (!resizeTimeout) {
        resizeTimeout = setTimeout(() => {
          resizeTimeout = null;
          actualResizeHandler();
        }, 66);
      }
    }

    function actualResizeHandler() {
      let keyboardHeight = detectKeyboard();

      if (keyboardHeight > 0) {
        keyboardShift(keyboardHeight);
      } else if (keyboardHeight === -1) {
        removeKeyboardShift();
      }
    }

    function updateWindowSize() {
      window.lastInnerWidth = window.innerWidth;
      window.lastInnerHeight = window.innerHeight;
      window.lastOrientation = window.orientation;
      window.lastBodyHeight = document.body.clientHeight;
    }

    function detectKeyboard() {
      function orientationChange() {
        if (((window.lastOrientation === 0 || window.lastOrientation === 180) && (window.orientation === 0 || window.orientation === 180)) || ((window.lastOrientation === 90 || window.lastOrientation === -90) && (window.orientation === 90 || window.orientation === -90))) {
          return false;
        } else {
          return true;
        }
      }

      if ((window.lastInnerHeight - window.innerHeight > 150) && window.innerWidth === window.lastInnerWidth) {
        let keyboardHeight = window.lastInnerHeight - window.innerHeight;

        updateWindowSize();

        return keyboardHeight;
      }

      if (orientationChange() && document.body.classList.contains(`keyboard-open`)) {
        let keyboardHeight = screen.height - window.topBarHeight - window.innerHeight;

        updateWindowSize();

        return keyboardHeight;
      }

      if ((window.innerHeight - window.lastInnerHeight > 150) && window.innerWidth === window.lastInnerWidth) {
        let keyboardHeight = -1;

        updateWindowSize();

        return keyboardHeight;
      }

      let keyboardHeight = 0;

      updateWindowSize();

      return keyboardHeight;
    }

    function keyboardShift(keyboardHeight) {
      if (!document.body.classList.contains(`keyboard-open`)) {
        document.body.classList.add(`keyboard-open`);
      }

      document.body.style.height = `calc(100% + ${keyboardHeight}px)`;
    }

    function removeKeyboardShift() {
      document.body.classList.remove(`keyboard-open`);
      document.body.style.removeProperty(`height`);
    }
  }

  window.initMobileNav = initMobileNav;
})();
