/**
 * ABOUT SWIPER
 * Оживление слайдера о компании
 */
(function () {
  function initAboutSlider() {
    let aboutSwiper = new Swiper(`.about__gallery-wrapper`, {
      loop: true,
      slidesPerView: 1,
      spaceBetween: 30,
      allowSlidePrev: false,
      on: {
        sliderMove() {
          if (!this.isMoved) {
            hideSlides(this.el);
            this.isMoved = true;
          }
        },
        slideChangeTransitionEnd() {
          if (!this.counter) {
            this.counter = 0;
          }

          this.counter += 1;

          if (!this.el.classList.contains(`about__gallery-wrapper`) && this.counter > 1 || this.el.classList.contains(`about__gallery-wrapper`) && this.counter === 2) {
            this.allowSlidePrev = true;

            let hiddenSlides = [].map.call(this.el.querySelectorAll(`.is-hidden`), (it) => {
              return it;
            });

            hiddenSlides.forEach((slide) => {
              slide.classList.remove(`is-hidden`);
            });
          }
        }
      },
    });

    hideSlides(document);
  }

  window.initAboutSlider = initAboutSlider;
})();
