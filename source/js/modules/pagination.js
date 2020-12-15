/**
 * PAGINATION TOP
 * Оживление кнопки "Вверх" пагинации
 */
(function () {
  function initPagination() {
    let header = document.querySelector(`.header`);
    let pagination = document.querySelector(`.pagination`);

    if (pagination) {
      let paginationTopBtn = pagination.querySelector(`.pagination__button--top`);
      let prevScrollPos = window.pageYOffset;

      window.addEventListener(`scroll`, () => {
        let currentScrollPos = window.pageYOffset;
        let paginationRectTop = currentScrollPos + pagination.getBoundingClientRect().top;

        if (currentScrollPos > prevScrollPos) {
          if (currentScrollPos > header.offsetHeight && currentScrollPos + window.innerHeight < paginationRectTop) {
            pagination.classList.add(`pagination--float`);

            if (paginationTopBtn.classList.contains(`shown`)) {
              paginationTopBtn.classList.remove(`shown`);
            }
          } else {
            pagination.classList.remove(`pagination--float`);
            paginationTopBtn.classList.remove(`shown`);
          }
        } else {
          if (currentScrollPos > header.offsetHeight && currentScrollPos + window.innerHeight < paginationRectTop) {
            pagination.classList.add(`pagination--float`);
            paginationTopBtn.classList.add(`shown`);
          } else {
            if (paginationTopBtn.classList.contains(`shown`)) {
              paginationTopBtn.classList.remove(`shown`);
            }
          }
        }

        prevScrollPos = currentScrollPos;
      });
    }
  }

  window.initPagination = initPagination;
})();
