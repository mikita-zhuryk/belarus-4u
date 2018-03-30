var service;

$("*").click(function search() {
    var request = {
        location: mapOptions.center,
        radius: '3500',
        types: ['cafe']
    };
    service = new google.maps.places.PlacesService(map);
    service.nearbySearch(request, callback);
})

function callback(results, status) {
    console.log("Everything kinda alright");
    if (status == google.maps.places.PlacesServiceStatus.OK) {
      for (var i = 0; i < results.length; i++) {
        var place = results[i];
        createMarker(results[i]);      
      }
    }
    else {
        console.log("We are fucked");
    }
}

function createMarker(place) {
    var marker = new google.maps.Marker( {
        map: map,
        position: place.geometry.location
    });
}