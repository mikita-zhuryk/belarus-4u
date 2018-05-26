var filtStr = "Filters";

// $(document).ready(function () {
//     $.getScript('search.js', function () {
//         console.log("Search.js loaded");
//     })
// })
var filtersShown = false;
var listHeadStr;

function hideFilters() {
    filtersShown = false;
    //filterWnd.style.visibility = "hidden";
    $('#filterWnd').hide('speed');
}

function searchAgain() {
    if (listHeadStr == undefined) {
        document.getElementById('listHead').style.visibility = "hidden";
        showMenu();
    }
    else {
        document.getElementById('listHead').innerHTML = listHeadStr;
        search(listHeadStr);
    }
}

function memoriseHead() {
    if (document.getElementById('list').hasChildNodes()) {
        listHeadStr = document.getElementById('listHead').innerHTML;
    }
}

function showFilters() {
    filtersShown = true;
    hideMenu(filtStr);
    $('#filterWnd').show('speed');
}

$(document).ready(function () {
    $("#range-slider").slider({
        min: 100,
        max: 10000,
        value: 3500,
        step: 100,
        range: "min",
        slide: function (event, ui) {
            radius = ui.value;
            $('#radius').val(radius + " m");
            map.setZoom(calcZoom());
            drawCircle(true);
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
    $("#radius").on('input', function () {
        radius = document.getElementById('radius').value;
        $("#range-slider").slider.value = radius;
    })
    //TODO: Make textboxes inputable (with string splitting)
    $('#filter-btn').click(function () {
        var filterWnd = document.getElementById('filterWnd');
        if (!filtersShown) {
            memoriseHead();
            showFilters();
        }
        else {
            showMenu();
            searchAgain();
        }
    })
})