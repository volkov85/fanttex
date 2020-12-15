/**
 * HEADER
 * Оживление шапки
 */
(function () {
  function initHeader() {
    let header = document.querySelector(`.header`);
    let headerBar = header.querySelector(`.header__middle`);

    if (!(document.body.classList.contains(`page--cart`) || document.body.classList.contains(`page--dashboard-order-edit`))) {
      let prevScrollPos = window.pageYOffset;

      window.addEventListener(`scroll`, () => {
        let currentScrollPos = window.pageYOffset;

        if (currentScrollPos > prevScrollPos) {
          if (currentScrollPos > header.offsetHeight) {
            header.classList.add(`header--bar`);

            if (headerBar.classList.contains(`shown`) && !headerBar.style.animationDirection) {
              removeAnimationClassShown(headerBar, `shown`, 500);
            }
          }
        } else {
          if (currentScrollPos > header.firstChild.offsetHeight) {
            headerBar.classList.add(`shown`);
          } else {
            header.classList.remove(`header--bar`);
            headerBar.classList.remove(`shown`);
          }
        }

        prevScrollPos = currentScrollPos;
      });
    }

    // Анимация иконки профиля в шапке
    let headerProfileLink = headerBar.querySelector(`.menu-profile__link--profile`);

    if (headerProfileLink.querySelector(`svg`)) {
      headerProfileLink.removeChild(headerProfileLink.querySelector(`svg`));
    }

    let headerProfileLinkAnim = lottie.loadAnimation({
      container: headerProfileLink,
      renderer: `svg`,
      loop: false,
      autoplay: false,
      path: `animations/icon_profile.json`,
      name: `headerProfileIcon`,
      rendererSettings: {
        progressiveLoad: false
      }
    });

    headerProfileLinkAnim.addEventListener(`data_ready`, () => {
      headerProfileLink.style.backgroundImage = `none`;
    });

    headerProfileLink.addEventListener(`click`, () => {
      lottie.goToAndStop(1, true, `headerProfileIcon`);
      lottie.play(`headerProfileIcon`);
    });
  }

  window.initHeader = initHeader;
})();
