$(document).ready(function () {
  $('.menu-item').click(f_acc);
});

function f_acc() {
  $('.menu-item').not($(this)).removeClass("click");
  $(this).toggleClass("click");
  $('.sub-menu').not($(this).next()).slideUp(900);
  $(this).next().slideToggle(900);
}
