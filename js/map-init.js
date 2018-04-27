var mapOptions;
var map;
var circle;
var circleDrawn = false;

function drawCircle() {
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
    var marker = new google.maps.Marker({
        position: circle.center,
        map: map,
        animation: google.maps.Animation.DROP,
        draggable: false
    });
    var pos = new google.maps.InfoWindow({
        content: 'You are here'
    });
    pos.open(map, marker);
}

$(document).ready(function () {
    $('#setPos').click(function () {
        map.addListener('click', function (pos) {
            mapOptions.center = pos.latLng;
            map.setCenter(mapOptions.center);
            map.setZoom(calcZoom());
            drawCircle();
            if (document.getElementById('list').hasChildNodes()) {
                search(document.getElementById('listHead').innerHTML);
            }
            google.maps.event.clearListeners(map, 'click');
        })
    })
})

function calcZoom() {
    return Math.floor(13 / Math.sqrt(Math.sqrt(Math.sqrt(radius / 3500))));
}

function initMap() {
    let flag;
    var StyledMap = new google.maps.StyledMapType(
        [
            { elementType: 'geometry', stylers: [{ color: '#242f3e' }] },
            { elementType: 'labels.text.stroke', stylers: [{ color: '#242f3e' }] },
            { elementType: 'labels.text.fill', stylers: [{ color: '#746855' }] },
            {
                featureType: 'administrative.locality',
                elementType: 'labels.text.fill',
                stylers: [{ color: '#d59563' }]
            },
            {
                featureType: 'poi',
                elementType: 'labels.text.fill',
                stylers: [{ color: '#d59563' }]
            },
            {
                featureType: 'poi.park',
                elementType: 'geometry',
                stylers: [{ color: '#263c3f' }]
            },
            {
                featureType: 'poi.park',
                elementType: 'labels.text.fill',
                stylers: [{ color: '#6b9a76' }]
            },
            {
                featureType: 'road',
                elementType: 'geometry',
                stylers: [{ color: '#38414e' }]
            },
            {
                featureType: 'road',
                elementType: 'geometry.stroke',
                stylers: [{ color: '#212a37' }]
            },
            {
                featureType: 'road',
                elementType: 'labels.text.fill',
                stylers: [{ color: '#9ca5b3' }]
            },
            {
                featureType: 'road.highway',
                elementType: 'geometry',
                stylers: [{ color: '#746855' }]
            },
            {
                featureType: 'road.highway',
                elementType: 'geometry.stroke',
                stylers: [{ color: '#1f2835' }]
            },
            {
                featureType: 'road.highway',
                elementType: 'labels.text.fill',
                stylers: [{ color: '#f3d19c' }]
            },
            {
                featureType: 'transit',
                elementType: 'geometry',
                stylers: [{ color: '#2f3948' }]
            },
            {
                featureType: 'transit.station',
                elementType: 'labels.text.fill',
                stylers: [{ color: '#d59563' }]
            },
            {
                featureType: 'water',
                elementType: 'geometry',
                stylers: [{ color: '#17263c' }]
            },
            {
                featureType: 'water',
                elementType: 'labels.text.fill',
                stylers: [{ color: '#515c6d' }]
            },
            {
                featureType: 'water',
                elementType: 'labels.text.stroke',
                stylers: [{ color: '#17263c' }]
            }
        ], {name: 'Night mode'})
    mapOptions = {
        zoom: 7,
        center: { lat: 53.67253, lng: 28.0726279 },
        streetViewControl: false,
        rotateControl: false,
        fullscreenControl: false,
        mapTypeControlOptions: {
            mapTypeIds: ['roadmap', 'styled_map']
        }
    };
    map = new google.maps.Map(document.getElementById("map"), mapOptions);
    map.mapTypes.set('styled_map', StyledMap);
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
            map.setZoom(calcZoom());
            drawCircle();
            console.log(result);
        },
        error => {
            $('#setPos').trigger('click');
        }
    );
}