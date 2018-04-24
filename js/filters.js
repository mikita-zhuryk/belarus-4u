var filtersShown = false;

$(document).ready(function () {
    $('#filter-btn').click(function createFilterWnd() {
        var filterWnd = document.getElementsByClassName('filterWnd')[0];
        if (!filtersShown) {
            filtersShown = true;
            //filterWnd.style.visibility = "visible";
            $('.filterWnd').show(0);
            $('.menu').hide(0);
        }
        else {
            filtersShown = false;
            //filterWnd.style.visibility = "hidden";
            document.getElementById('listHead').style.visibility = "hidden";
            $('.filterWnd').hide(0);
            $('.menu').show(0);
        }
    })
})