var mapOptions;
var map;
var circle;
var circleDrawn = false;
var posMarker;

ymaps.ready(initMap);

function drawCircle() {
    if ((circle == undefined) || ((circle.center[1] !== map.getCenter()[1]) && (circle.center[0] !== map.getCenter()[0]))) {
        if (circleDrawn) {
            //circle.setMap(null);
            circle = 0;
            circleDrawn = false;
        }
        circle = ymaps.Circle({
            coordinates: mapOptions.center,
            radius: radius
        });
        circleDrawn = true;
        if (posMarker !== undefined) {
            //posMarker.setMap(null);
            posMarker = 0;
        }
        posMarker = new ymaps.Placemark({
            geometry: mapOptions.center,
            balloonContent: 'You are here'
        });
    }
}

$(document).ready(function () {
    $('#setPos').click(function () {
        map.events.add('click', function setPosition(pos) {
            mapOptions.center = pos.get('coords');
            map.setCenter(mapOptions.center);
            map.setZoom(calcZoom());
            drawCircle();
            if (document.getElementById('list').hasChildNodes()) {
                search(document.getElementById('listHead').innerHTML);
            }
            map.events.remove('click');
        })
    })
})

function calcZoom() {
    return Math.floor(13 / Math.sqrt(Math.sqrt(Math.sqrt(radius / 3500))));
}

function initMap() {
    let flag;
    mapOptions = {
        zoom: 7,
        center: [53.67253, 28.0726279]
    };
    map = new ymaps.Map("map", mapOptions);
    //var autocomplete = new google.maps.places.Autocomplete(document.getElementById('searchBox'));
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
            function (position) {
                mapOptions.center = [position.coords.latitude, position.coords.longitude];
                flag = true;
                map.setCenter(mapOptions.center);
                map.setZoom(calcZoom());
                drawCircle();
            },
            function () {
                $('#setPos').trigger('click');
            })
    }
}