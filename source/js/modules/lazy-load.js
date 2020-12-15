/**
 * LAZY LOAD
 * Инициализация ленивой загрузки изображений
 */
(function () {
  function initLozad() {
    let observer = lozad();
    observer.observe();
  }

  window.initLozad = initLozad;
})();
