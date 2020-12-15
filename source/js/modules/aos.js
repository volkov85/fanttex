/**
 * AOS
 * Создание эффекта появления элементов при прокрутке
 */
(function () {
  function initAOS() {
    AOS.init({
      once: true,
      anchorPlacement: `top-top`
    });
  }

  window.initAOS = initAOS;
})();
