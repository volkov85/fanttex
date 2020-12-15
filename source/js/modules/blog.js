/**
 * BLOG POST
 * Оживление поста блога
 */
(function () {
  function initBlog() {
    // Оживление слайдера поста блога
    let blogPostSwiper = new Swiper(`.blog-post__slider`, {
      loop: true,
      slidesPerView: 3,
      spaceBetween: 30,
      breakpoints: {
        1200: {
          slidesPerView: 5,
          spaceBetween: 20,
        },
        1500: {
          slidesPerView: 6,
          spaceBetween: 30,
        }
      }
    });
  }

  window.initBlog = initBlog;
})();
