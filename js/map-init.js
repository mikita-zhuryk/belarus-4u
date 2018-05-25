var mapOptions;
var map;
var circle;
var circleDrawn = false;
var pos;
var posMarker;
var autocomplete;

function searchInput() {
    var value = $('#searchBox').val();
    var place = autocomplete.getPlace();
    mapOptions.center = place.geometry.location;
    map.setCenter(mapOptions.center);
    map.setZoom(calcZoom());
    drawCircle(true, false);
    search(value);
}

function drawCircle(redraw = false, marker = true) {
    if (redraw || (circle == undefined) || ((circle.center.lat() !== map.center.lat()) && (circle.center.lng() !== map.center.lng()))) {
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
        if (posMarker !== undefined) {
            posMarker.setMap(null);
            posMarker = 0;
        }
        if (marker) {
            posMarker = new google.maps.Marker({
                position: circle.center,
                map: map,
                animation: google.maps.Animation.DROP,
                draggable: false,
                icon: "images/meMarker.png"
            });
            pos = new google.maps.InfoWindow({
                content: 'You are here'
            });
            pos.open(map, posMarker);
        }
    }
}

$(document).ready(function () {
    $('#setPos').click(function () {
        if (!getGeoLoc()) {
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
        }
    })
})

function calcZoom() {
    return Math.floor(13 / Math.sqrt(Math.sqrt(Math.sqrt(radius / 3500))));
}

function getGeoLoc() {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
            function (position) {
                mapOptions.center = { lat: position.coords.latitude, lng: position.coords.longitude };
                flag = true;
                map.setCenter(mapOptions.center);
                map.setZoom(calcZoom());
                drawCircle();
                return true;
            },
            function () {
                $('#setPos').trigger('click');
                return false;
            })
    }
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
        ], { name: 'Night mode' })
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
    autocomplete = new google.maps.places.Autocomplete(document.getElementById('searchBox'));
    autocomplete.addListener('place_changed', searchInput);
    getGeoLoc();
}