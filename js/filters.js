var filtersShown = false;
var listHeadStr;

$(document).ready(function () {
    $("#range-slider").slider({
        min: 100,
        max: 50000,
        value: 3500,
        step: 50,
        range: "min",
        slide: function (event, ui) {
            radius = $("#range-slider").slider("value");
            map.setZoom(Math.floor(13 / Math.sqrt(Math.sqrt(Math.sqrt(radius / 3500)))));
            $('#amount').val(radius + " m");
            drawCircle();
        },
        stop: function (event, ui) {
            radius = $("#range-slider").slider("value");
            map.setZoom(calcZoom());
            $('#amount').val(radius + " m");
            drawCircle();
        }
    });
    $('#price-slider').slider({
        min: 0,
        max: 4,
        value: [0, 4],
        step: 1,
        range: true,
        slide: function (event, ui) {
            request.minPriceLevel = $('#price-slider').slider("value[0]");
            request.maxPriceLevel = $('#price-slider').slider("value[value.length - 1]");
        }
    })
    $('#filter-btn').click(function () {
        var filterWnd = document.getElementsByClassName('filterWnd')[0];
        if (!filtersShown) {
            listHeadStr = document.getElementById('listHead').innerHTML;
            filtersShown = true;
            hideMenu("Filters");
            //filterWnd.style.visibility = "visible";
            $('.filterWnd').show(0);
        }
        else {
            filtersShown = false;
            //filterWnd.style.visibility = "hidden";
            $('.filterWnd').hide(0);
            if (listHeadStr == undefined) {
                document.getElementById('listHead').style.visibility = "hidden";
                showMenu();
            }
            else {
                document.getElementById('listHead').innerHTML = listHeadStr;
                search(listHeadStr);
            }
        }
    })
})