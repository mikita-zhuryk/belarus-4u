// $(document).ready(function () {
//     $.getScript('search.js', function () {
//         console.log("Search.js loaded");
//     })
// })

$(document).ready(function () {
    $('#random-btn').click(function () {
        var category = Math.floor(Math.random() * 14);
        if (!displayMenu) {
            showMenu();
        }
        search(document.getElementsByClassName('sub-menu-item')[category].innerHTML);
    })
})