/**
 * BANNER
 * Оживление слайдера баннеров
 */
(function () {
  function initBanner() {
    let bannersSwiper = new Swiper(`.banners__wrapper`, {
      loop: true,
      spaceBetween: 30,
      autoplay: {
        delay: 5000
      }
    });
  }

  window.initBanner = initBanner;
})();
