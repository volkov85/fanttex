/**
 * BLOG POST
 * Оживление поста блога
 */
(function () {
  function initBlog() {
    // Оживление слайдера поста блога
    let blogPostSwiper = new Swiper(`.blog-post__slider`, {
      loop: true,
      slidesPerView: 1,
      spaceBetween: 20
    });
  }

  window.initBlog = initBlog;
})();
