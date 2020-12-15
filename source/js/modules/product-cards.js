/**
 * PRODUCT CARD & VARIANT
 * Оживление карточек товаров и вариантов товаров
 */
(function () {
  function initProductCards() {
    let productCardsAll = document.querySelectorAll(`.product-card, .product-variant`);

    let productPopup = document.querySelector(`.popup--product`);

    for (let i = 0; i < productCardsAll.length; i++) {
      // Оживление слайдера карточек товаров
      let productCardPreview = productCardsAll[i].querySelector(`.swiper-container`);

      if (productCardsAll[i].classList.contains(`product-card`)) {
        let productCardSwiper = new Swiper(productCardPreview, {
          slidesPerView: 1,
          simulateTouch: false,
          pagination: {
            el: `.previews-pagination`,
            renderBullet(index, className) {
              return `<span class="${className}"><span class="visually-hidden">${index + 1}-й слайд</span></span>`;
            }
          }
        });

        // Оживление всплывающего окна предпросмотра карточек товаров
        for (let j = 0; j < productCardSwiper.slides.length; j++) {
          productCardSwiper.slides[j].firstChild.addEventListener(`click`, (evt) => {
            evt.preventDefault();

            window.fanttex.shownBlock = showElement(productPopup, window.fanttex.overlay, true);

            window.fanttex.productGallerySwiper.init();
            window.fanttex.productGallerySwiper.update();

            // Оживление слайдера карточек вариантов товара во всплывающем окне
            let productVariantsOnPopup = productPopup.querySelectorAll(`.product-variant`);

            for (let k = 0; k < productVariantsOnPopup.length; k++) {
              let productVariantOnPopupPreview = productVariantsOnPopup[k].querySelector(`.swiper-container`);

              let productVariantOnPopupSwiper = new Swiper(productVariantOnPopupPreview, {
                slidesPerView: 1,
                simulateTouch: false,
                pagination: {
                  el: `.previews-pagination`,
                  renderBullet(index, className) {
                    return `<span class="${className}"><span class="visually-hidden">${index + 1}-й слайд</span></span>`;
                  }
                }
              });

              swipeSlidesOnMouseMove(productVariantOnPopupPreview, productVariantOnPopupSwiper);
            }
          });
        }

        swipeSlidesOnMouseMove(productCardPreview, productCardSwiper);
      }

      // Оживление слайдера карточек вариантов товара
      if (document.body.classList.contains(`page--product`)) {
        let productVariantOnPageSwiper = new Swiper(productCardPreview, {
          slidesPerView: 1,
          simulateTouch: false,
          pagination: {
            el: `.previews-pagination`,
            renderBullet(index, className) {
              return `<span class="${className}"><span class="visually-hidden">${index + 1}-й слайд</span></span>`;
            }
          }
        });

        swipeSlidesOnMouseMove(productCardPreview, productVariantOnPageSwiper);
      }

      // Создание анимации для кнопки добавления товара в избранное
      let productCardAddFavoriteBtn = productCardsAll[i].querySelector(`.add-favorites-btn`);
      let productCardOutOfStockBtn = productCardsAll[i].querySelector(`.out-of-stock-btn`);

      lottie.loadAnimation({
        container: productCardAddFavoriteBtn,
        renderer: `svg`,
        loop: false,
        autoplay: false,
        path: `animations/icon_heart.json`,
        name: `productCardFavoriteIcon${i}`,
        rendererSettings: {
          progressiveLoad: false
        }
      });

      // Если товар уже находится в избранном при загрузке страницы
      if (productCardsAll[i].classList.contains(`favorite`)) {
        lottie.goToAndStop(300, true, `productCardFavoriteIcon${i}`);

        productCardAddFavoriteBtn.title = `Удалить из избранного`;
        productCardAddFavoriteBtn.firstChild.textContent = `Удалить из избранного`;

        productCardOutOfStockBtn.textContent = `В избранном`;
      }

      // Добавление/удаление товара в избранное
      let favoriteProductsCounter = document.querySelector(`.menu-profile__link--favorites`);

      productCardAddFavoriteBtn.addEventListener(`click`, (evt) => {
        evt.preventDefault();

        toggleProductInFavorites(productCardsAll[i], productCardAddFavoriteBtn, `productCardFavoriteIcon${i}`, favoriteProductsCounter, productCardOutOfStockBtn);

        productCardAddFavoriteBtn.blur();
      });

      // Добавление/удаление товара в избранное при отсутствии на складе
      productCardOutOfStockBtn.addEventListener(`click`, (evt) => {
        evt.preventDefault();

        toggleProductInFavorites(productCardsAll[i], productCardAddFavoriteBtn, `productCardFavoriteIcon${i}`, favoriteProductsCounter, productCardOutOfStockBtn);

        productCardOutOfStockBtn.blur();
      });

      if (productCardsAll[i].classList.contains(`product-card`)) {
        productCardOutOfStockBtn.addEventListener(`mouseenter`, (evt) => {
          if (productCardsAll[i].classList.contains(`favorite`)) {
            evt.target.textContent = `Удалить из избранного`;
          }
        });
      }

      // Выбор цвета товара
      if (productCardsAll[i].classList.contains(`product-card`)) {
        let productCardColorList = productCardsAll[i].querySelector(`.product-card__color-list`);

        let productCardColors = productCardColorList.children;
        let productCardColorSelected = productCardColorList.querySelector(`.selected`);

        for (let j = 0; j < productCardColors.length; j++) {
          productCardColors[j].addEventListener(`click`, (evt) => {
            evt.preventDefault();

            if (!productCardColors[j].classList.contains(`selected`)) {
              productCardColors[j].classList.add(`selected`);
              productCardColorSelected.classList.remove(`selected`);
              productCardColorSelected = productCardColors[j];

              // Переключение изображений товара в карточке при выборе цвета
              productCardsAll[i].dataset.variant = j + 1;

              let productCardImages = productCardPreview.querySelectorAll(`img`);

              for (let k = 0; k < productCardImages.length; k++) {
                productCardImages[k].src = productCardImages[k].src.replace(/thumb-\d+/i, `thumb-${String(j + 1).padStart(2, `0`)}`);

                if (productCardImages[k].srcset && !productCardImages[k].srcset.includes(`placeholder`)) {
                  productCardImages[k].srcset = productCardImages[k].srcset.replace(/thumb-\d+/i, `thumb-${String(j + 1).padStart(2, `0`)}`);
                }

                if (productCardImages[k].dataset.srcset) {
                  productCardImages[k].dataset.srcset = productCardImages[k].dataset.srcset.replace(/thumb-\d+/i, `thumb-${String(j + 1).padStart(2, `0`)}`);
                }
              }

              // Переключение статуса товара в избранном при выборе цвета
              let productFavData = JSON.parse(productCardsAll[i].dataset.favorites);

              if (+productFavData[j + 1]) {
                lottie.goToAndStop(300, true, `productCardFavoriteIcon${i}`);

                productCardsAll[i].classList.add(`favorite`);

                productCardAddFavoriteBtn.title = `Удалить из избранного`;
                productCardAddFavoriteBtn.firstChild.textContent = `Удалить из избранного`;

                productCardOutOfStockBtn.textContent = `В избранном`;
              } else {
                lottie.goToAndStop(0, true, `productCardFavoriteIcon${i}`);

                productCardsAll[i].classList.remove(`favorite`);

                productCardAddFavoriteBtn.title = `Добавить в избранное`;
                productCardAddFavoriteBtn.firstChild.textContent = `Добавить в избранное`;

                productCardOutOfStockBtn.textContent = `Отследить наличие`;
              }
            }

            productCardColors[j].blur();
          });
        }
      }

      // Создание объекта прайс-листа для товара
      let productAmount = productCardsAll[i].querySelector(`.product-amount`);
      let productAmountInput = productAmount.querySelector(`.product-amount__field > input`);

      let productAmountOptions = productAmount.querySelector(`.product-amount__options`).children;

      let productPriceList = new PriceList(productAmountOptions);

      // Добавление товара в корзину
      let productCardAddCartBtn = productCardsAll[i].querySelector(`.add-cart-btn`);

      let cartProductsCounter = document.querySelector(`.menu-profile__link--cart`);

      let productCardPrice = productCardsAll[i].querySelector(`.price-total`);
      let productCardPriceInitial = productCardPrice ? productCardPrice.textContent.replace(/\s/g, ``) : null;
      let productCardPriceSale = productCardsAll[i].querySelector(`.price-total-sale`);
      let productCardPriceSaleInitial = productCardPriceSale ? productCardPriceSale.textContent.replace(/\s/g, ``) : null;

      let changeProductPriceAll = (productQuantity) => {
        changeProductPrice(productCardPrice, productPriceList, productQuantity);

        if (productCardPriceSale) {
          changeProductPrice(productCardPriceSale, productPriceList, productQuantity, +productCardsAll[i].dataset.discount);
        }
      };

      productCardAddCartBtn.addEventListener(`click`, (evt) => {
        evt.preventDefault();

        productCardsAll[i].classList.add(`in-cart`);
        cartProductsCounter.dataset.counter++;

        if (productCardPrice) {
          productCardsAll[i].classList.add(`total-price`);

          changeProductPriceAll(+productAmountInput.dataset.min);
        }
      });

      /**
       * Оживление поля ввода количества товара
       */
      // Добавление маски для поля ввода количества товара
      let productAmountInputMask = IMask(productAmountInput, {
        mask: `num ${productAmountInput.dataset.unit}`,
        lazy: false,
        blocks: {
          num: {
            mask: Number,
            min: productAmountInput.dataset.min,
            max: productAmountInput.dataset.max
          }
        }
      });

      productAmountInputMask.value = productAmountInput.dataset.min;

      // Перерасчёт цены, если товар уже в корзине
      if (productCardsAll[i].classList.contains(`total-price`) && productCardPrice) {
        changeProductPriceAll(+productAmountInputMask.unmaskedValue);
      }

      // Увеличение/уменьшение количества товара
      let productAmountDecreaseBtn = productAmount.querySelector(`.product-amount__button-decrease`);
      let productAmountIncreaseBtn = productAmount.querySelector(`.product-amount__button-increase`);

      changeProductAmount(productAmount, productAmountInput, productAmountInputMask, productAmountDecreaseBtn, productAmountIncreaseBtn, () => {
        if (productCardPrice) {
          changeProductPriceAll(+productAmountInputMask.unmaskedValue);
        }
      });

      /**
       * Оживление выпадающего меню выбора количества товара
       */
      dropdownInit(productAmount, productAmountInput);

      // Появление/скрытие выпадающего меню по клику
      productAmountInput.addEventListener(`click`, () => {
        productAmount.classList.toggle(`opened`);
      });

      // Подставление значения из выпадающего меню в поле ввода
      for (let j = 0; j < productAmountOptions.length; j++) {
        productAmountOptions[j].addEventListener(`click`, (evt) => {
          evt.preventDefault();

          productAmount.classList.add(`selected`);

          productAmountInput.focus();
          productAmount.classList.remove(`opened`);

          if (+Object.keys(productPriceList)[j] >= +productAmountInput.dataset.min) {
            productAmountInputMask.value = Object.keys(productPriceList)[j];

            if (productCardPrice) {
              changeProductPriceAll(+Object.keys(productPriceList)[j]);
            }
          }

          if (+Object.keys(productPriceList)[j] > +productAmountInput.dataset.min) {
            productAmount.classList.remove(`minimum`);
          } else {
            productAmount.classList.add(`minimum`);
          }

          if (productAmountIncreaseBtn.disabled) {
            productAmountIncreaseBtn.removeAttribute(`disabled`);
          }
        });
      }

      // Удаление товара из корзины
      let productCardRemoveCartBtn = productCardsAll[i].querySelector(`.product-amount__button-remove`);
      let productCardRemoveCartLink = productCardsAll[i].querySelector(`.product-amount__button-remove-cart`);

      let removeProductFromCart = (evt) => {
        evt.preventDefault();

        productCardsAll[i].classList.remove(`in-cart`);
        cartProductsCounter.dataset.counter--;

        if (productCardPrice) {
          productCardsAll[i].classList.remove(`total-price`);
          changeProductPriceValue(productCardPrice, productCardPriceInitial);

          if (productCardPriceSale) {
            changeProductPriceValue(productCardPriceSale, productCardPriceSaleInitial);
          }
        }

        productAmount.classList.add(`minimum`);
        productAmountInputMask.value = productAmountInput.dataset.min;

        if (productAmountIncreaseBtn.disabled) {
          productAmountIncreaseBtn.removeAttribute(`disabled`);
        }

        productAmount.classList.remove(`selected`);
        productAmount.classList.remove(`opened`);
      };

      productCardRemoveCartBtn.addEventListener(`click`, removeProductFromCart);

      productCardRemoveCartLink.addEventListener(`click`, removeProductFromCart);
    }
  }

  window.initProductCards = initProductCards;
})();
