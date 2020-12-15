/**
 * CATALOG NAV
 * Оживление навигации каталога
 */
(function () {
  function initCatalogNav() {
    // Создание слайдера меню каталога
    let headerMenuCatalogSwiper = new Swiper(`.menu-catalog:not(.menu-catalog--relevant)`, {
      slidesPerView: `auto`,
      spaceBetween: 10,
      freeMode: true
    });
  }

  window.initCatalogNav = initCatalogNav;
})();
