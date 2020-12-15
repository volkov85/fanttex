/**
 * DASHBOARD
 * Оживление страницы личного кабинета
 */
(function () {
  function initDashboardPage() {
    // Оживление навигации личного кабинета
    let dashboardMenuSwiper = new Swiper(`.dashboard__nav`, {
      slidesPerView: `auto`,
      spaceBetween: 30,
      freeMode: true
    });

    // Оживление слайдеров личного кабинета
    let dashboardSwiper = new Swiper(`.dashboard-panel--slider .dashboard-panel__inner`, {
      loop: true,
      slidesPerView: 3,
      spaceBetween: 30,
      breakpoints: {
        1200: {
          slidesPerView: 5,
          spaceBetween: 20,
        },
        1500: {
          slidesPerView: 6,
          spaceBetween: 30,
        }
      }
    });

    // Оживление фильтра выбора заказов
    if (document.body.classList.contains(`page--dashboard-orders`)) {
      let dashboardOrders = document.querySelectorAll(`.order`);
      let dashboardOrderSelectOptions = document.querySelectorAll(`.select__option`);

      for (let i = 0; i < dashboardOrderSelectOptions.length; i++) {
        dashboardOrderSelectOptions[i].addEventListener(`click`, (evt) => {
          if (evt.target.dataset.value === `all`) {
            for (let j = 0; j < dashboardOrders.length; j++) {
              dashboardOrders[j].classList.add(`shown`);
            }
          } else {
            for (let j = 0; j < dashboardOrders.length; j++) {
              if (dashboardOrders[j].classList.contains(`order--${evt.target.dataset.value}`)) {
                dashboardOrders[j].classList.add(`shown`);
              } else {
                if (dashboardOrders[j].classList.contains(`shown`)) {
                  removeAnimationClassShown(dashboardOrders[j], `shown`, 400);
                }
              }
            }
          }
        });
      }
    }
  }

  window.initDashboardPage = initDashboardPage;
})();
