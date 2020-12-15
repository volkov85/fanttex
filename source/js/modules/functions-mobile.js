/**
 * Устанавливает у элемента класс .hovered, если курсор находится над ним
 */
function setElementHoveredState(evt) {
  evt.target.classList.add(`hovered`);
}

/**
 * Снимает у элемента класс .hovered, если курсор покидает его пределы
 */
function unsetElementHoveredState(evt) {
  evt.target.classList.remove(`hovered`);
}

/**
 * Снимает у элемента класс .opened, если курсор покидает его пределы, а сам элемент не находится в фокусе
 */
function unsetElementOpenedState(evt) {
  if (!evt.target.classList.contains(`focused`)) {
    evt.target.classList.remove(`opened`);
  }
}

/**
 * Оживляет выпадающий список
 */
function dropdownInit(dropdownEl, closeOnBlur, ...dropdownFocusedEls) {
  // Определение, находится ли курсор над выпадающим списком
  dropdownEl.addEventListener(`mouseenter`, setElementHoveredState);

  dropdownEl.addEventListener(`mouseleave`, unsetElementHoveredState);

  dropdownEl.addEventListener(`mouseleave`, unsetElementOpenedState);

  // Определение, находится ли выпадающий список в фокусе
  for (let i = 0; i < dropdownFocusedEls.length; i++) {
    dropdownFocusedEls[i].addEventListener(`focus`, () => {
      dropdownEl.classList.add(`focused`);
    });

    // Закрытие выпадающего списка при снятии фокуса
    dropdownFocusedEls[i].addEventListener(`blur`, () => {
      dropdownEl.classList.remove(`focused`);

      if (closeOnBlur && !dropdownEl.classList.contains(`hovered`)) {
        dropdownEl.classList.remove(`opened`);
      }
    });
  }
}

/**
 * Добавляет/удаляет товар в избранное
 */
function toggleProductInFavorites(productEl, addFavBtn, animName, favCountEl, outOfStockBtn = null) {
  let productFavData = productEl.dataset.favorites ? JSON.parse(productEl.dataset.favorites) : null;

  if (productEl.classList.contains(`favorite`)) {
    lottie.goToAndStop(0, true, animName);

    productEl.classList.remove(`favorite`);

    addFavBtn.title = `Добавить в избранное`;
    addFavBtn.firstChild.textContent = `Добавить в избранное`;

    if (outOfStockBtn) {
      outOfStockBtn.textContent = productEl.classList.contains(`product-variant`) ? `В избранное` : `Отследить наличие`;
    }

    if (productFavData) {
      productFavData[+productEl.dataset.variant] = `0`;

      productEl.dataset.favorites = JSON.stringify(productFavData);
    }

    favCountEl.dataset.counter--;
  } else {
    lottie.goToAndStop(35, true, animName);
    lottie.play(animName);

    productEl.classList.add(`favorite`);

    addFavBtn.title = `Удалить из избранного`;
    addFavBtn.firstChild.textContent = `Удалить из избранного`;

    if (outOfStockBtn) {
      outOfStockBtn.textContent = `В избранном`;
    }

    if (productFavData) {
      productFavData[+productEl.dataset.variant] = `1`;

      productEl.dataset.favorites = JSON.stringify(productFavData);
    }

    favCountEl.dataset.counter++;
  }
}

/**
 * Вычисляет цену товара в зависимости от количества
 */
function getProductPrice(priceList, quantity, applyDiscount = true) {
  let currentPrice = 0;

  for (let j = Object.keys(priceList).length - 1; j >= 0; j--) {
    if (quantity >= +Object.keys(priceList)[j]) {
      currentPrice = applyDiscount ? quantity * Object.values(priceList)[j].price : quantity * Object.values(priceList)[0].price;

      return currentPrice;
    }
  }

  currentPrice = +Object.keys(priceList)[0] * Object.values(priceList)[0].price;

  return currentPrice;
}

/**
 * Возвращает цену за единицу товара в зависимости от количества
 */
function getProductPricePerItem(priceList, quantity) {
  for (let j = Object.keys(priceList).length - 1; j >= 0; j--) {
    if (quantity >= +Object.keys(priceList)[j]) {
      return Object.values(priceList)[j].price;
    }
  }

  return Object.values(priceList)[0].price;
}

/**
 * Возвращает значение скидки на товар в зависимости от количества
 */
function getProductDiscount(priceList, quantity) {
  for (let j = Object.keys(priceList).length - 1; j >= 0; j--) {
    if (quantity >= +Object.keys(priceList)[j]) {
      return Object.values(priceList)[j].discount;
    }
  }

  return Object.values(priceList)[0].discount;
}

/**
 * Изменяет значение цены товара
 */
function changeProductPriceValue(priceItem, price) {
  let priceInteger = priceItem.querySelector(`.price-integer`);
  let priceFraction = priceItem.querySelector(`.price-fraction`);

  // Анимирует цифровое значение с эффектом счётчика
  let makeCounterEffect = (startValue, endValue, duration) => {
    let currentValue = startValue;
    let stepValue = Math.floor((endValue - startValue) / 50);
    let stepTime = Math.abs(Math.floor(duration / (endValue - startValue)));

    let timer = setInterval(() => {
      currentValue += stepValue;

      if (stepValue > 0 && currentValue < endValue) {
        priceInteger.textContent = new Intl.NumberFormat(`ru-RU`).format(`${currentValue}`.slice(0, -2));
        priceFraction.textContent = `${currentValue}`.slice(-2);
      } else if (stepValue < 0 && currentValue > endValue) {
        priceInteger.textContent = new Intl.NumberFormat(`ru-RU`).format(`${currentValue}`.slice(0, -2));
        priceFraction.textContent = `${currentValue}`.slice(-2);
      } else {
        priceInteger.textContent = new Intl.NumberFormat(`ru-RU`).format(`${endValue}`.slice(0, -2));
        priceFraction.textContent = `${endValue}`.slice(-2);

        clearInterval(timer);
      }
    }, stepTime);
  };

  makeCounterEffect(+priceItem.textContent.replace(/\s/g, ``), price, 1000);
}

/**
 * Изменяет значение одного блока цены карточки товара
 */
function changeProductPrice(priceItem, priceList, quantity, discount = 0) {
  let productPriceValue = 0;

  productPriceValue = discount ? getProductPrice(priceList, quantity) - Math.floor(getProductPrice(priceList, quantity) / 100) * discount : getProductPrice(priceList, quantity);

  changeProductPriceValue(priceItem, productPriceValue);
}

/**
 * Создаёт объект прайс-листа для товара в зависимости от количества
 */
function PriceList(list) {
  for (let i = 0; i < list.length; i++) {
    let productAmountQuantity = parseInt(list[i].querySelector(`.product-amount__quantity`).textContent, 10);
    let productPricePerItem = parseInt(list[i].querySelector(`.product-amount__price`).textContent, 10);
    let productDiscount = list[i].querySelector(`.product-amount__discount`);

    this[productAmountQuantity] = {
      price: productPricePerItem,
      discount: productDiscount ? parseInt(productDiscount.textContent, 10) : 0
    };
  }
}

/**
 * Изменяет значение количества товара в поле ввода
 */
function changeProductAmount(amountEl, amountInput, amountInputMask, amountDecreaseBtn, amountIncreaseBtn, callback = () => {}) {
  amountDecreaseBtn.addEventListener(`click`, (evt) => {
    evt.preventDefault();

    amountEl.classList.add(`selected`);

    amountInputMask.value = `${+amountInputMask.unmaskedValue - 1}`;

    callback();

    if (+amountInputMask.unmaskedValue <= +amountInput.dataset.min) {
      amountEl.classList.add(`minimum`);
    }

    if (amountIncreaseBtn.disabled) {
      amountIncreaseBtn.removeAttribute(`disabled`);
    }
  });

  amountIncreaseBtn.addEventListener(`click`, (evt) => {
    evt.preventDefault();

    amountEl.classList.add(`selected`);

    amountInputMask.value = `${+amountInputMask.unmaskedValue + 1}`;

    callback();

    if (amountEl.classList.contains(`minimum`)) {
      amountEl.classList.remove(`minimum`);
    }

    if (+amountInputMask.unmaskedValue >= +amountInput.dataset.max) {
      evt.target.disabled = `true`;
    }
  });

  amountInput.addEventListener(`input`, (evt) => {
    if (+amountInputMask.unmaskedValue > +evt.target.dataset.min) {
      amountEl.classList.remove(`minimum`);

      if (+amountInputMask.unmaskedValue >= +evt.target.dataset.max) {
        amountIncreaseBtn.disabled = `true`;
      }
    } else {
      amountEl.classList.add(`minimum`);

      if (amountIncreaseBtn.disabled) {
        amountIncreaseBtn.removeAttribute(`disabled`);
      }
    }

    amountEl.classList.add(`selected`);

    callback();
  });
}

/**
 * Скрывает первый слайд
 */
function hideSlides(el) {
  let hiddenSlides = [].map.call(el.querySelectorAll(`.swiper-slide-prev`), (it) => {
    return it;
  });

  hiddenSlides.forEach((slide) => {
    slide.classList.add(`is-hidden`);

    if (slide.previousElementSibling) {
      slide.previousElementSibling.classList.add(`is-hidden`);
    }
  });
}

/**
 * Открывает всплывающее окно
 */
function showElement(el, overlay, doFixBody = false) {
  el.classList.add(`shown`);

  overlay.classList.add(`shown`);

  if (doFixBody) {
    document.body.style.top = `-${window.scrollY}px`;
    document.body.classList.add(`page--block`);
  }

  return el;
}

/**
 * Закрывает всплывающее окно и оверлей
 */
function hideElement(el, overlay, timer) {
  removeAnimationClassShown(el, `shown`, timer);

  overlay.classList.remove(`shown`);
  overlay.classList.remove(`transparent`);

  if (document.body.classList.contains(`page--block`)) {
    let scrollY = document.body.style.top;

    document.body.style.removeProperty(`top`);
    document.body.classList.remove(`page--block`);

    window.scrollTo(0, parseInt(scrollY || `0`, 10) * -1);
  }

  return null;
}

/**
 * Скрывает элемент (удаляет класс с анимацией, показывающей элемент, например .shown)
 */
function removeAnimationClassShown(el, cls, timer) {
  resetCSSAnimation(el, cls);
  el.style.animationDirection = `reverse`;

  window.setTimeout(() => {
    el.classList.remove(cls);
    el.removeAttribute(`style`);
  }, timer);
}

/**
 * Сбрасывает CSS-анимацию для элемента
 */
function resetCSSAnimation(el, cls) {
  el.classList.remove(cls);
  void el.offsetWidth;
  el.classList.add(cls);
}
