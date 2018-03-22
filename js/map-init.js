function initMap() {
    let flag;
    let mapOptions = {
        zoom: 7,
        center: { lat: 53.67253, lng: 28.0726279 },
        streetViewControl: false,
        rotateControl: false,
        fullscreenControl: false
    };
    let map = new google.maps.Map(document.getElementById("map"), mapOptions);
    var promise = new Promise(function (resolve, reject) {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
                function (position) {
                    mapOptions.center = { lat: position.coords.latitude, lng: position.coords.longitude };
                    console.log(mapOptions.center);
                    flag = true;
                    resolve("Promise fullfilled!");
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
            console.log(map.center.lat() + ' ' + map.center.lng());
            let point = new google.maps.InfoWindow({ map: map });
            point.setPosition(mapOptions.center);
            point.setContent("Centered on you");
            console.log(result);
        },
        error => {
            console.log("Geolocation error " + error);
        }
    );
}