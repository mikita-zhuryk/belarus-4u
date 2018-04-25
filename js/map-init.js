var mapOptions;
var map;
var circle;
var circleDrawn = false;

$(document).ready(function () {
    $('#setPos').click(function () {
        map.addListener('click', function(pos) {
            mapOptions.center = pos.latLng;
            map.setCenter(mapOptions.center);
            map.setZoom(13);
            if (circleDrawn) {
                circle.setMap(null);
                circle = 0;
                circleDrawn = false;
            }
            circle = new google.maps.Circle({
                map: map,
                center: mapOptions.center,
                radius: radius
            });
            circleDrawn = true;
            google.maps.event.clearListeners(map, 'click');
        })
    })
})

function initMap() {
    let flag;
    mapOptions = {
        zoom: 7,
        center: { lat: 53.67253, lng: 28.0726279 },
        streetViewControl: false,
        rotateControl: false,
        fullscreenControl: false
    };
    map = new google.maps.Map(document.getElementById("map"), mapOptions);
    var autocomplete = new google.maps.places.Autocomplete(document.getElementById('searchBox'));
    var promise = new Promise(function (resolve, reject) {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
                function (position) {
                    mapOptions.center = { lat: position.coords.latitude, lng: position.coords.longitude };
                    console.log(mapOptions.center);
                    flag = true;
                    resolve("Location acquired");
                },
                function () {
                    reject("Problem geolocating");
                })
        }
    });
    promise.then(
        result => {
            map.setCenter(mapOptions.center);
            map.setZoom(13);
            var marker = new google.maps.Marker({
                position: mapOptions.center,
                icon: {
                    path: google.maps.SymbolPath.BACKWARD_CLOSED_ARROW,
                    fillColor: "#00AA00"
                }
            });
            if (circleDrawn) {
                circle.setMap(null);
                circle = 0;
                circleDrawn = false;
            }
            circle = new google.maps.Circle({
                map: map,
                center: mapOptions.center,
                radius: radius
            });
            circleDrawn = true;
            console.log(result);
        },
        error => {
            $('#setPos').trigger('click');
        }
    );
}