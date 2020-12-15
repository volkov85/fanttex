/**
 * SEARCH
 * Оживление панели поиска
 */
(function () {
  function initSearch() {
    let search = document.querySelector(`.search`);
    let searchInput = search.querySelector(`.search__field input`);
    let searchInputClear = search.querySelector(`.search__button-remove`);

    // Определение, находится ли курсор над поиском
    search.addEventListener(`mouseenter`, setElementHoveredState);

    search.addEventListener(`mouseleave`, unsetElementHoveredState);

    // Появление/скрытие панели поиска при фокусе/снятии фокуса
    searchInput.addEventListener(`focus`, () => {
      search.classList.add(`opened`);
    });

    searchInput.addEventListener(`blur`, () => {
      if (!search.classList.contains(`hovered`)) {
        search.classList.remove(`opened`);
      }
    });

    search.addEventListener(`click`, () => {
      searchInput.focus();
    });

    // Изменение панели поиска при вводе значения
    searchInput.addEventListener(`input`, (evt) => {
      if (evt.target.value) {
        search.classList.add(`filled`);
      } else {
        search.classList.remove(`filled`);
      }
    });

    searchInputClear.addEventListener(`click`, (evt) => {
      evt.preventDefault();

      searchInput.value = ``;
      searchInput.focus();
      search.classList.remove(`filled`);
    });

    // Вставка значения из предложенного списка
    let searchOptionsList = search.querySelectorAll(`.search__options--history .search__item-text, .search__options--popular .search__item-text`);

    for (let i = 0; i < searchOptionsList.length; i++) {
      searchOptionsList[i].addEventListener(`click`, (evt) => {
        evt.preventDefault();

        searchInput.value = evt.target.textContent;
        search.classList.add(`filled`);
      });
    }

    // Удаление значения из истории поиска
    let searchOptionsHistory = search.querySelector(`.search__options--history`);
    let searchOptionsHistoryRemoveBtns = searchOptionsHistory.querySelectorAll(`.search__item-remove`);
    let searchOptionsHistoryCounter = searchOptionsHistoryRemoveBtns.length;

    for (let i = 0; i < searchOptionsHistoryRemoveBtns.length; i++) {
      searchOptionsHistoryRemoveBtns[i].addEventListener(`click`, (evt) => {
        evt.preventDefault();

        evt.target.parentElement.remove();
        searchOptionsHistoryCounter--;

        if (!searchOptionsHistoryCounter) {
          searchOptionsHistory.style.display = `none`;
        }
      });
    }
  }

  window.initSearch = initSearch;
})();
