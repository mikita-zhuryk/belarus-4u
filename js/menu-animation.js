$(document).ready(function () {
  //прикрепляем клик по заголовкам acc-head
  $('.menu-item').on('click', f_acc);
});

function f_acc() {
  //скрываем все кроме того, что должны открыть
  $('.sub-menu').not($(this).next()).slideUp(900);
  // открываем или скрываем блок под заголовком, по которому кликнули
  $(this).next().slideToggle(900);
}

$(document).ready(function (){
  $('#history-btn').click(function (){
    var x = document.cookie;
    alert(x);
  });
});
