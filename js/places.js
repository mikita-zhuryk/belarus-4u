var service;
var flag = false;
var places;

$(document).ready(function () {
    $("a").click(function search() {
        console.log($(this).text());
        var request = {
            location: mapOptions.center,
            radius: '3500',
            type: [$(this).text()]
        };
        if (!flag) service = new google.maps.places.PlacesService(map);
        service.nearbySearch(request, callback);
    })
})

function callback(results, status) {
    console.log("Everything kinda alright");
    if (status == google.maps.places.PlacesServiceStatus.OK) {
        if (flag) {
            console.log("deleting markers");
           for (var i = 0; i < places.length; i++) {
               places[i].setMap(null);
               places[i] = null;
           }
           places.length = 0;
        }
        if (!flag) {
            var circle = new google.maps.Circle({
                map: map,
                center: mapOptions.center,
                radius: 3500
            })
            flag = true;
        }
        places = results;
        console.log(places[0].name);
        for (var i = 0; i < places.length; i++) {
            var place = places[i];
            places[i] = new google.maps.Marker({
                map: map,
                position: place.geometry.location
            });
        }
    }
    else {
        console.log("We are fucked");
    }
}