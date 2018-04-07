var service;
var flag = false;
var places = [];
var markers = [];
var radius = 1000;
var displayMenu = true;
var text;

$(document).ready(function () {
    $("li").click(function search() {
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

$(document).ready(function(){
    $('.sub-menu-item').click(function hideMenu(){
        if (displayMenu == true) {
            text = $(this).text();
            $('.menu').hide(10);
            $('#categories').text(text);
            document.getElementById('categories').style.visibility = "visible";
            displayMenu = false;
        }
    })
})

$(document).ready(function (){
    $('#categories').click(function showMenu(){
        if(displayMenu == false){
            document.getElementById('categories').style.visibility = "hidden";
            $('.menu').show();
            displayMenu = true;
        }
    })
})

function callback(results, status) {
    results.length = 50;
    if (status == google.maps.places.PlacesServiceStatus.OK) {
        if (flag) {
            console.log("Deleting markers");
            for (var i = 0; i < markers.length; i++) {
                markers[i].setMap(null);
                markers[i] = null;
            }
            markers.length = 0;
        }
        if (!flag) {
            var circle = new google.maps.Circle({
                map: map,
                center: mapOptions.center,
                radius: radius
            })
            flag = true;
        }
        var i = 0;
        var timerID = setInterval(function() {
            var marker = new google.maps.Marker({
                map: map,
                position: results[i].geometry.location
            });
            markers.push(marker);
            var details = new Promise(function (resolve, reject) {
                service.getDetails({ placeId: results[i].place_id }, function (PlaceResult, PlacesServiceStatus) {
                    if (PlacesServiceStatus == google.maps.places.PlacesServiceStatus.OK) {
                        marker.title = PlaceResult.name;
                        resolve(PlaceResult);
                    }
                    else if (PlacesServiceStatus == google.maps.places.PlacesServiceStatus.NOT_FOUND) {
                        reject([marker, "NOT_FOUND"]);
                    }
                    else if (PlacesServiceStatus == google.maps.places.PlacesServiceStatus.INVALID_REQUEST) {
                        reject([marker, "INVALID_REQUEST"]);
                    }
                    else if (PlacesServiceStatus == google.maps.places.PlacesServiceStatus.OVER_QUERY_LIMIT) {
                        reject([marker, "OVER_QUERY_LIMIT"]);
                    }
                    else if (PlacesServiceStatus == google.maps.places.PlacesServiceStatus.REQUEST_DENIED) {
                        reject([marker, "REQUEST_DENIED"]);
                    }
                    else if (PlacesServiceStatus == google.maps.places.PlacesServiceStatus.ZERO_RESULTS) {
                        reject([marker, "ZERO_RESULTS"]);
                    }
                    else if (PlacesServiceStatus == google.maps.places.PlacesServiceStatus.UNKNOWN_ERROR) {
                        reject([marker, "UNKNOWN_ERROR"]);
                    }
                })
            });
            details.then(
                result => {
                    addHint(marker, result);
                    places.push(result);
                },
                error => {
                    console.log(error[1]);
                    addHint(error[0], 0);
                })
                i++;
        }, 1000);
        if (i == results.length) {
            clearInterval(timerID);
        }
    }
    else {
        console.log("Google Places Service is currently unavailable.\n");
    }
}

function addHint(marker, place) {
    console.log("Adding listener to " + marker.title);
    var infowindow;
    marker.addListener('mouseover', function () {
        infowindow = new google.maps.InfoWindow();
        infowindow.setContent((place) ? (place.name + " Rating: " + place.rating.toString()) : "Name not found");
        infowindow.open(map, marker);
    });
    marker.addListener('mouseout', function () {
        infowindow.close(marker);
    });
}