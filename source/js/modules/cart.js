/**
 * CART
 * Оживление страницы корзины
 */
(function () {
  function initCartPage() {
    let cart = document.querySelector(`.cart`);

    if (cart) {
      /**
       * CART PRICE
       * Оживление блока итоговой цены корзины
       */
      let cartPriceDelivery = cart.querySelector(`.cart__sidebar .price-delivery`);
      let cartPrice = cart.querySelector(`.cart__sidebar .price-current`);
      let cartPriceTotal = cart.querySelector(`.cart__sidebar .price-total`);
      let cartPriceNoDiscount = cart.querySelector(`.cart__sidebar .price-no-discount`);
      let cartPriceDiscount = cart.querySelector(`.cart__sidebar .price-discount-value`);

      let changeCartPriceAll = () => {
        let cartPriceDeliveryValue = cartPriceDelivery ? +cartPriceDelivery.textContent.replace(/\s/g, ``) : 0;
        let cartPriceValue = 0;
        let cartPriceNoDiscountValue = 0;

        let productCards = document.querySelectorAll(`.product-cart:not(.hidden)`);

        for (let i = 0; i < productCards.length; i++) {
          let productCardPrice = productCards[i].querySelector(`.price-current`);

          // Создание объекта прайс-листа для товара
          let productAmount = productCards[i].querySelector(`.product-amount`);

          if (productAmount) {
            let productAmountInput = productAmount.querySelector(`.product-amount__field > input`);

            let productAmountOptions = productAmount.querySelector(`.product-amount__options`).children;

            let productPriceList = new PriceList(productAmountOptions);

            let productAmountQuantity = parseInt(productAmountInput.value, 10);

            cartPriceValue += getProductPrice(productPriceList, productAmountQuantity);
            cartPriceNoDiscountValue += getProductPrice(productPriceList, productAmountQuantity, false);
          } else {
            cartPriceValue += +productCardPrice.textContent.replace(/\s/g, ``);
            cartPriceNoDiscountValue += +productCardPrice.textContent.replace(/\s/g, ``);
          }
        }

        let cartPriceTotalValue = cartPriceValue + cartPriceDeliveryValue;

        cartPriceNoDiscountValue += cartPriceDeliveryValue;

        let cartPriceDiscountValue = cartPriceNoDiscountValue - cartPriceTotalValue;

        changeProductPriceValue(cartPrice, cartPriceValue);

        changeProductPriceValue(cartPriceTotal, cartPriceTotalValue);

        changeProductPriceValue(cartPriceNoDiscount, cartPriceNoDiscountValue);

        changeProductPriceValue(cartPriceDiscount, cartPriceDiscountValue);
      };

      /**
       * PRODUCT CART
       * Оживление карточек товаров в корзине
       */
      let productCartCards = document.querySelectorAll(`.product-cart`);

      for (let i = 0; i < productCartCards.length; i++) {
        // Создание лайтбокса для изображения товара
        let pswpElement = document.querySelector(`.pswp`);

        if (pswpElement) {
          let productGalleryItems = [];

          let productCartLink = productCartCards[i].querySelector(`.product-cart__info > a`);
          let size = productCartLink.dataset.size.split(`x`);

          productGalleryItems.push({
            src: productCartLink.getAttribute(`href`),
            w: parseInt(size[0], 10),
            h: parseInt(size[1], 10)
          });

          let productCartLinkClickHandler = (evt) => {
            evt.preventDefault();

            let productGalleryPswp = new PhotoSwipe(pswpElement, PhotoSwipeUI_Default, productGalleryItems, {
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

          productCartLink.addEventListener(`click`, productCartLinkClickHandler);
        }

        // Создание объекта прайс-листа для товара
        let productAmount = productCartCards[i].querySelector(`.product-amount`);

        let cartProductsCounter = document.querySelector(`.menu-profile__link--cart`);

        let removeProductFromCart = (evt) => {
          evt.preventDefault();

          cartProductsCounter.dataset.counter--;

          productCartCards[i].classList.add(`hidden`);

          window.setTimeout(() => {
            productCartCards[i].parentNode.removeChild(productCartCards[i]);
          }, 400);

          changeCartPriceAll();
        };

        if (productAmount) {
          let productAmountInput = productAmount.querySelector(`.product-amount__field > input`);

          let productAmountOptions = productAmount.querySelector(`.product-amount__options`).children;

          let productPriceList = new PriceList(productAmountOptions);

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

          if (!productAmountInputMask.value) {
            productAmountInputMask.value = productAmountInput.dataset.min;
          }

          // Увеличение/уменьшение количества товара
          let productPrice = productCartCards[i].querySelector(`.price-current`);
          let productPriceNoDiscount = productCartCards[i].querySelector(`.price-no-discount`) || productPrice;
          let productPriceDiscountValue = productCartCards[i].querySelector(`.price-discount-value`) || null;

          let productAmountDecreaseBtn = productAmount.querySelector(`.product-amount__button-decrease`);
          let productAmountIncreaseBtn = productAmount.querySelector(`.product-amount__button-increase`);

          let changeProductPriceAll = (productQuantity) => {
            changeProductPrice(productPrice, productPriceList, productQuantity);

            changeProductPriceValue(productPriceNoDiscount, getProductPrice(productPriceList, productQuantity, false));

            changeProductPriceValue(productPriceDiscountValue, getProductPrice(productPriceList, productQuantity, false) - getProductPrice(productPriceList, productQuantity));

            changeCartPriceAll();
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
          let productCardRemoveCartBtn = productCartCards[i].querySelector(`.product-amount__button-remove`);
          let productCardRemoveCartLink = productCartCards[i].querySelector(`.product-amount__button-remove-cart`);

          productCardRemoveCartBtn.addEventListener(`click`, removeProductFromCart);

          productCardRemoveCartLink.addEventListener(`click`, removeProductFromCart);
        }

        // Удаление образца товара из корзины
        let productSample = productCartCards[i].querySelector(`.product-cart__sample`);

        if (productSample) {
          let productSampleBtn = productSample.querySelector(`.product-cart__sample-toggle`);
          let productSampleRemoveCartBtn = productSample.querySelector(`.product-cart__sample-remove-cart`);

          dropdownInit(productSample, productSampleBtn);

          productSampleBtn.addEventListener(`click`, () => {
            productSample.classList.toggle(`opened`);
          });

          productSampleRemoveCartBtn.addEventListener(`click`, removeProductFromCart);
        }
      }

      /**
       * CART FORM
       * Переход на страницу успешного завершения заказа
       */
      // let cartForm = document.getElementById(`cartForm`);

      // if (cartForm) {
      //   cartForm.addEventListener(`submit`, (evt) => {
      //     evt.preventDefault();

      //     swup.loadPage({
      //       url: `cart-success.html`
      //     });
      //   });
      // }
    }
  }

  window.initCartPage = initCartPage;
})();
