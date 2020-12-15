/**
 * HEADER
 * Оживление шапки
 */
(function () {
  function initHeader() {
    // Создание слайдера меню категорий в шапке
    let headerMenuCategoriesSwiper = new Swiper(`.menu-categories--header`, {
      slidesPerView: `auto`,
      spaceBetween: 30,
      freeMode: true
    });
  }

  window.initHeader = initHeader;
})();
