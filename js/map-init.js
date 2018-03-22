"use strict"
var map;
ymaps.ready(function init () {
    map = new ymaps.Map("map-show", {center: [53.90843169, 27.55994617], zoom: 7})
    map.controls.remove('fullscreenControl');
    map.controls.remove('trafficControl');
    map.controls.remove('searchControl');
});