var service;
var flag = false;
var places;
var radius = 3500;

$(document).ready(function () {
    $("a").click(function search() {
        console.log($(this).text());
        var request = {
            location: mapOptions.center,
            radius: radius,
            type: $(this).text(),
            keyword: $(this).text()
        };
        if (!flag) service = new google.maps.places.PlacesService(map);
        service.radarSearch(request, callback);
    })
})

function callback(results, status) {
    console.log("Everything kinda alright");
    if (status == google.maps.places.PlacesServiceStatus.OK) {
        if (flag) {
            console.log("Deleting markers");
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
                radius: radius
            })
            flag = true;
        }
        places = results;
        for (var i = 0; i < places.length; i++) {
            place = new google.maps.Marker({
                map: map,
                position: places[i].geometry.location,
                place_id: places[i].place_id
            });
            var details = new Promise(function (resolve, reject) {
                service.getDetails({ placeId: places[i].place_id }, function (PlaceResult, PlacesServiceStatus) {
                    if (PlacesServiceStatus == google.maps.places.PlacesServiceStatus.OK) {
                        place.title = PlaceResult.name;
                        resolve("Found title");
                    }
                    else {
                        reject("Not found " + place.place_id);
                    }
                })
            });
            details.then(
                result => {
                    places[i] = place;
                    places[i].addListener('click', function () {
                        let infowindow = new google.maps.InfoWindow();
                        infowindow.setContent(places[i].title);
                        infowindow.open(map, places[i]);
                    });
                    //addHint(places[i]);
                },
                error => {
                    console.log(error);
                })
        }
    }
    else {
        console.log("We are fucked");
    }
}

function addHint(place) {
    console.log("Adding listener to " + place.title);
    place.addListener('click', function () {
        infowindow = new google.maps.InfoWindow();
        infowindow.setContent(place.title);
        infowindow.open(map, place);
    });
}