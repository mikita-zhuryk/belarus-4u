$.getScript('search.js', function () {
    console.log("Search.js loaded");
})
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
            $('#radius').val(radius + " m");
            drawCircle();
        },
        stop: function (event, ui) {
            radius = $("#range-slider").slider("value");
            map.setZoom(calcZoom());
            $('#radius').val(radius + " m");
            drawCircle();
        }
    });
    $('#price-slider').slider({
        min: 0,
        max: 4,
        values: [0, 3],
        step: 1,
        range: true,
        slide: function (event, ui) {
            $('#price').val("[" + ui.values[0] + ", " + ui.values[1] + "]");
            request.minPriceLevel = ui.values[0];
            request.maxPriceLevel = ui.values[1];
        },
        stop: function (event, ui) {
            $('#price').val("[" + ui.values[0] + ", " + ui.values[1] + "]");
            request.minPriceLevel = ui.values[0];
            request.maxPriceLevel = ui.values[1];
        }
    })
    $("#rating-slider").slider({
        min: 1.0,
        max: 5.0,
        values: [3.5, 5.0],
        step: 0.1,
        range: true,
        slide: function (event, ui) {
            $('#rating').val("[" + ui.values[0] + ", " + ui.values[1] + "]");
            minRating = ui.values[0];
            maxRating = ui.values[1];
        },
        stop: function (event, ui) {
            $('#rating').val("[" + ui.values[0] + ", " + ui.values[1] + "]");
            minRating = ui.values[0];
            maxRating = ui.values[1];
        }
    });
    $('#filter-btn').click(function () {
        var filterWnd = document.getElementsByClassName('filterWnd')[0];
        if (!filtersShown) {
            if (document.getElementById('list').hasChildNodes()) {
                listHeadStr = document.getElementById('listHead').innerHTML;
            }
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