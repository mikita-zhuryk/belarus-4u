var service;
var flag = false;
var places = [];
var markers = [];
var radius = 3500;
var displayMenu = true;
var text;

$(document).ready(function () {
    $("li").click(function search() {
        console.log($(this).text());
        var request = {
            location: mapOptions.center,
            radius: radius - 300,
            type: $(this).text(),
            keyword: $(this).text()
        };
        if (!flag) service = new google.maps.places.PlacesService(map);
        service.radarSearch(request, callback);
    })
})

$(document).ready(function () {
    $('.sub-menu-item').click(function hideMenu() {
        if (displayMenu == true) {
            text = $(this).text();
            $('.menu').hide(10);
            $('#categories').text(text);
            document.getElementById('categories').style.visibility = "visible";
            displayMenu = false;
        }
    })
})

$(document).ready(function () {
    $('#categories').click(function showMenu() {
        if (displayMenu == false) {
            document.getElementById('categories').style.visibility = "hidden";
            $('.menu').show();
            displayMenu = true;
        }
    })
})

function callback(results, PlacesServiceStatus) {
    if (results.length > 20) {
        results.length = 20;
    }
    errorMsg(function () {
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
        for (var i = 0; i < results.length; i++) {
            var marker;
            marker = new google.maps.Marker({
                map: map,
                position: results[i].geometry.location,
                title: results[i].place_id
            });
            markers.push(marker);
            addHint(marker);
        }
    }, function () { }, PlacesServiceStatus)
}

function addHint(marker) {
    console.log("Adding listener to " + marker.title);
    var infowindow;
    marker.addListener('mouseover', function () {
        var alreadyLoaded = -1;
        for (var j = 0; j < places.length; j++) {
            if (places[j][0] == marker.title) {
                console.log("Already found info for " + places[j][1].formatted_address);
                alreadyLoaded = j;
            }
        }
        if (alreadyLoaded == -1) {
            var promise = new Promise(function (resolve, reject) {
                console.log("Loading info for " + marker.title);
                service.getDetails({ placeId: marker.title }, function (PlaceResult, PlacesServiceStatus) {
                    errorMsg(resolve(PlaceResult), reject(marker), PlacesServiceStatus);
                })
            })
            promise.then(
                result => {
                    places.push([marker.title, result]);
                    infowindow = new google.maps.InfoWindow();
                    infowindow.setContent((result) ? (result.name + " Rating: " + result.rating.toString() + "\n" + result.formatted_address) : "Name not found");
                    infowindow.open(map, marker);
                },
                error => { }
            )
        }
        else {
            infowindow = new google.maps.InfoWindow();
            infowindow.setContent((places[alreadyLoaded][1]) ? (places[alreadyLoaded][1].name + " Rating: " + places[alreadyLoaded][1].rating.toString() + "\n" + places[alreadyLoaded][1].formatted_address) : "Name not found");
            infowindow.open(map, marker);
        }
    });
    marker.addListener('mouseout', function () {
        infowindow.close(marker);
    });
}

function errorMsg(funcSuccess, funcFail, PlacesServiceStatus) {
    if (PlacesServiceStatus == google.maps.places.PlacesServiceStatus.OK) {
        funcSuccess();
    }
    else {
        funcFail();
        if (PlacesServiceStatus == google.maps.places.PlacesServiceStatus.NOT_FOUND) {
            console.log("NOT_FOUND");
        }
        if (PlacesServiceStatus == google.maps.places.PlacesServiceStatus.INVALID_REQUEST) {
            console.log("INVALID_REQUEST");
        }
        if (PlacesServiceStatus == google.maps.places.PlacesServiceStatus.OVER_QUERY_LIMIT) {
            console.log("OVER_QUERY_LIMIT");
        }
        if (PlacesServiceStatus == google.maps.places.PlacesServiceStatus.REQUEST_DENIED) {
            console.log("REQUEST_DENIED");
        }
        if (PlacesServiceStatus == google.maps.places.PlacesServiceStatus.ZERO_RESULTS) {
            console.log("ZERO_RESULTS");
        }
        if (PlacesServiceStatus == google.maps.places.PlacesServiceStatus.UNKNOWN_ERROR) {
            console.log("UNKNOWN_ERROR");
        }
    }
}