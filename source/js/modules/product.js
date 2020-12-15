/**
 * PRODUCT
 * Оживление страницы товара
 */
(function () {
  function initProductPage() {
    let product = document.querySelector(`.product`);

    if (product) {
      // Оживление слайдера галереи страницы товара
      window.fanttex.productGallerySwiper = new Swiper(`.product__gallery-inner`, {
        init: document.body.classList.contains(`page--product`) || false,
        slidesPerView: 1,
        pagination: {
          el: `.product__gallery-thumbs`,
          renderBullet(index, className) {
            return `<button class="product__gallery-thumb ${className}" type="button" title="Перейти к ${index + 1}-му изображению"><img src="img/product_01-image-thumb-${String(index + 1).padStart(2, `0`)}.jpg" alt="Бифлекс матовый" width="70" height="70" loading="lazy" decoding="async"></button>`;
          }
        },
        on: {
          init(swiper) {
            // Создание лайтбокса для изображений галереи
            let pswpElement = document.querySelector(`.pswp`);

            if (pswpElement) {
              let productGalleryItems = [];

              for (let i = 0; i < swiper.slides.length; i++) {
                let linkEl = swiper.slides[i].firstChild;
                let size = linkEl.dataset.size.split(`x`);

                productGalleryItems.push({
                  src: linkEl.getAttribute(`href`),
                  w: parseInt(size[0], 10),
                  h: parseInt(size[1], 10)
                });
              }

              let productGalleryLinkClickHandler = (evt) => {
                evt.preventDefault();

                let productGalleryPswp = new PhotoSwipe(pswpElement, PhotoSwipeUI_Default, productGalleryItems, {
                  index: swiper.activeIndex,
                  bgOpacity: 0.3,
                  closeOnScroll: false,
                  history: false
                });

                productGalleryPswp.init();

                let zoomLevel = productGalleryPswp.currItem.fitRatio;

                productGalleryPswp.container.addEventListener(`wheel`, (e) => {
                  let zoomDelta = 0.2;
                  let zoomMaxLevel = 4;

                  if (e.deltaY < 0) {
                    zoomLevel = zoomLevel + zoomDelta <= zoomMaxLevel ? zoomLevel + zoomDelta : zoomMaxLevel;

                    productGalleryPswp.zoomTo(zoomLevel, {
                      x: e.clientX,
                      y: e.clientY
                    }, 500, false);
                  } else {
                    zoomLevel = zoomLevel - zoomDelta >= productGalleryPswp.currItem.fitRatio ? zoomLevel - zoomDelta : productGalleryPswp.currItem.fitRatio;

                    productGalleryPswp.zoomTo(zoomLevel, {
                      x: e.clientX,
                      y: e.clientY
                    }, 500, false);
                  }
                });
              };

              for (let i = 0; i < swiper.slides.length; i++) {
                swiper.slides[i].firstChild.addEventListener(`click`, productGalleryLinkClickHandler);
              }
            }
          },
          paginationRender(swiper) {
            for (let i = 0; i < swiper.pagination.bullets.length; i++) {
              swiper.pagination.bullets[i].addEventListener(`mouseenter`, () => {
                swiper.slideTo(i);
              });
            }
          }
        }
      });

      // Создание анимации для кнопки добавления товара в избранное
      let productAddFavoriteBtn = product.querySelector(`.product__add-favorites`);

      lottie.loadAnimation({
        container: productAddFavoriteBtn,
        renderer: `svg`,
        loop: false,
        autoplay: false,
        path: `animations/icon_heart.json`,
        name: `productFavoriteIcon`,
        rendererSettings: {
          progressiveLoad: false
        }
      });

      // Если товар уже находится в избранном при загрузке страницы
      if (product.classList.contains(`favorite`)) {
        lottie.goToAndStop(300, true, `productFavoriteIcon`);

        productAddFavoriteBtn.title = `Удалить из избранного`;
        productAddFavoriteBtn.firstChild.textContent = `Удалить из избранного`;
      }

      // Добавление/удаление товара в избранное
      let favoriteProductsCounter = document.querySelector(`.menu-profile__link--favorites`);

      productAddFavoriteBtn.addEventListener(`click`, (evt) => {
        evt.preventDefault();

        toggleProductInFavorites(product, productAddFavoriteBtn, `productFavoriteIcon`, favoriteProductsCounter);
      });

      /**
       * Оживление выпадающей панели выбора цвета
       */
      let selectionColor = document.querySelector(`.selection--color.selection--product`);

      if (selectionColor) {
        // Инициализация панели выбора цвета
        let selectionColorOpen = selectionColor.querySelector(`.selection__toggle`);

        let selectionColorSearchInput = selectionColor.querySelector(`.selection__search input`);

        dropdownInit(selectionColor, selectionColorSearchInput);

        // Открытие/закрытие панели выбора цвета
        selectionColorOpen.addEventListener(`click`, (evt) => {
          evt.preventDefault();

          selectionColor.classList.toggle(`opened`);

          selectionColorSearchInput.focus();
        });

        // Выбор варианта цвета
        let selectionColorOptions = selectionColor.querySelectorAll(`.selection__item:not(.selection__toggle)`);

        for (let i = 0; i < selectionColorOptions.length; i++) {
          selectionColorOptions[i].addEventListener(`click`, (evt) => {
            evt.preventDefault();

            let selectionColorOptionCopy = selectionColorOptions[i].firstChild.cloneNode(true);

            selectionColorOpen.removeChild(selectionColorOpen.firstChild);
            selectionColorOpen.appendChild(selectionColorOptionCopy);

            selectionColor.classList.add(`selected`);
            selectionColor.classList.remove(`opened`);
          });
        }

        // Поиск по панели выбора цвета
        selectionColorSearchInput.addEventListener(`input`, (evt) => {
          for (let i = 0; i < selectionColorOptions.length; i++) {
            if (selectionColorOptions[i].querySelector(`.selection__item-name`).textContent.toLowerCase().includes(evt.target.value.toLowerCase())) {
              selectionColorOptions[i].style.removeProperty(`display`);
            } else {
              selectionColorOptions[i].style.display = `none`;
            }
          }
        });
      }

      // Создание объекта прайс-листа для товара
      let productAmount = product.querySelector(`.product-amount`);
      let productAmountInput = productAmount.querySelector(`.product-amount__field > input`);

      let productAmountOptions = productAmount.querySelector(`.product-amount__options`).children;

      let productPriceList = new PriceList(productAmountOptions);

      // Добавление товара в корзину
      let productAddCartBtn = product.querySelector(`.product__add-cart`);

      let cartProductsCounter = document.querySelector(`.menu-profile__link--cart`);

      let productPrice = product.querySelector(`.price-total`);
      let productPricePerItem = product.querySelector(`.price-per-item`);
      let productPriceDiscountPercent = product.querySelector(`.price-discount-percent`);
      let productPriceProfit = product.querySelector(`.product__price-profit`);
      let productPriceNoDiscount = productPriceProfit.querySelector(`.price-no-discount`);
      let productPriceDiscountValue = productPriceProfit.querySelector(`.price-discount-value`);

      productAddCartBtn.addEventListener(`click`, (evt) => {
        evt.preventDefault();

        product.classList.add(`in-cart`);
        cartProductsCounter.dataset.counter++;
      });

      // Добавление образца товара в корзину
      let productAddCartSampleLink = product.querySelector(`.product__link--add-sample`);

      productAddCartSampleLink.addEventListener(`click`, (evt) => {
        evt.preventDefault();

        product.classList.add(`sample-in-cart`);
        cartProductsCounter.dataset.counter++;
      });

      /**
       * Оживление поля ввода количества товара
       */
      // Добавление маски для количества товара
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

      // Увеличение/уменьшение количества товара
      let productAmountDecreaseBtn = productAmount.querySelector(`.product-amount__button-decrease`);
      let productAmountIncreaseBtn = productAmount.querySelector(`.product-amount__button-increase`);

      let changeProductPriceAll = (productQuantity) => {
        changeProductPrice(productPrice, productPriceList, productQuantity);

        changeProductPriceValue(productPricePerItem, getProductPricePerItem(productPriceList, productQuantity));

        let productDiscount = getProductDiscount(productPriceList, productQuantity);

        if (productDiscount) {
          if (productDiscount > 0) {
            productPriceDiscountPercent.textContent = `+${productDiscount}%`;
          } else {
            productPriceDiscountPercent.textContent = `${productDiscount}%`;
          }
        } else {
          productPriceDiscountPercent.textContent = ``;
        }

        changeProductPriceValue(productPriceNoDiscount, getProductPrice(productPriceList, productQuantity, false));

        changeProductPriceValue(productPriceDiscountValue, getProductPrice(productPriceList, productQuantity, false) - getProductPrice(productPriceList, productQuantity));
      };

      changeProductAmount(productAmount, productAmountInput, productAmountInputMask, productAmountDecreaseBtn, productAmountIncreaseBtn, () => {
        changeProductPriceAll(+productAmountInputMask.unmaskedValue);
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

            changeProductPriceAll(+Object.keys(productPriceList)[j]);
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
      let productRemoveCartBtn = product.querySelector(`.product-amount__button-remove`);
      let productRemoveCartLink = product.querySelector(`.product-amount__button-remove-cart`);

      let removeProductFromCart = (evt) => {
        evt.preventDefault();

        product.classList.remove(`in-cart`);
        cartProductsCounter.dataset.counter--;

        productAmount.classList.remove(`opened`);
      };

      productRemoveCartBtn.addEventListener(`click`, removeProductFromCart);

      productRemoveCartLink.addEventListener(`click`, removeProductFromCart);
    }
  }

  window.initProductPage = initProductPage;
})();
