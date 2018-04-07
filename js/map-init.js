var mapOptions;
var map;

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
            map.setZoom(11);
            var marker = new google.maps.Marker({
                position: mapOptions.center,
                icon: {
                    path: google.maps.SymbolPath.BACKWARD_CLOSED_ARROW,
                    fillColor: "#00AA00"
                }
            })
            console.log(result);
        },
        error => {
            console.log(error);
        }
    );
}