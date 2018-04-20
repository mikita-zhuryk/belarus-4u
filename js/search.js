var circleDrawn = false;
var displayMenu = true;
var MAXIMUM_NUMBER_OF_MARKERS = 20;
var radius = 3500;
var request;
var text;
var service;
var markers = [];
var places = [];
var lastSearch = [];
var INITIAL_PLACES = 5;

function performSearch(text) {
    request = {
        location: mapOptions.center,
        radius: radius - 300,
        keyword: text,
        type: text
    };
    service.radarSearch(request, callback);
}

$(document).ready(function () {
    $('.sub-menu-item').click(function () {
        text = $(this).text();
        if (!circleDrawn) {
            var circle = new google.maps.Circle({
                map: map,
                center: mapOptions.center,
                radius: radius
            })
            circleDrawn = true;
        }
        if (!service) {
            service = new google.maps.places.PlacesService(map);
        }
        performSearch(text);
        if (displayMenu == true) {
            $('.menu').hide(10);
            $('#listHead').text(text);
            document.getElementById('listHead').style.visibility = "visible";
            displayMenu = false;
            var i = 0;
            var fit = -1;
            while (i < places.length) {
                fit = i;                                                // Loop starts with the same initial places (not fitting current search request)
                // for (var j = fit + 1; j < places.length; j++) {      // This loop tries to find fitting places and show them in the list, but is actually infinite
                //     for (var k = 0; k < places[j][1].types.length; k++) {
                //         if (places[j][1].types[k] == text) {
                //             fit = j;
                //             break;
                //         }
                //     }
                //     if (fit == j) {
                //         break;
                //     }
                // }
                // if (fit !== -1) {
                    var listNode = document.createElement('li');
                    listNode.className = 'listNode';
                    var nodeName = document.createElement('p');
                    nodeName.className = 'nodeName';
                    if (places[fit][1].name) {
                        nodeName.innerHTML = places[fit][1].name;
                    }
                    else {
                        nodeName.innerHTML = "No data for name";
                    }
                    listNode.appendChild(nodeName);
                    var nodeRating = document.createElement('img');
                    nodeRating.className = 'nodeRating';
                    if (places[fit][1].rating) {
                    }
                    listNode.appendChild(nodeRating);
                    var nodePhone = document.createElement('p');
                    nodePhone.className = 'nodePhone';
                    if (places[fit][1].formatted_phone_number) {
                        nodePhone.innerHTML = places[fit][1].formatted_phone_number;
                    }
                    else {
                        nodePhone.innerHTML = "No data for phone number";
                    }
                    listNode.appendChild(nodePhone);
                    var imgPhone = document.createElement('img');
                    imgPhone.className = 'imgPhone';
                    imgPhone.src = "images/Phone.png";
                    nodePhone.appendChild(imgPhone);
                    document.getElementById('list').appendChild(listNode);
                    i++;
                //}
            }
        }
    })
})

$(document).ready(function () {
    $('#listHead').click(function showMenu() {
        if (displayMenu == false) {
            // var mapDiv = document.getElementById('map');
            while (document.getElementById('list').hasChildNodes()) {
                var child = document.getElementById('list').lastChild;
                child.parentNode.removeChild(child);
            }
            // if (mapDiv.style.visibility == "hidden") {
            //     mapDiv.style.visibility = "visible";
            // }
            // if (document.getElementById('infoWindow')) {
            //     document.body.removeChild(document.getElementById('infoWindow'));
            // }
            // if (mapDiv.firstChild.id == 'showInfo') {
            //     mapDiv.removeChild(mapDiv.firstChild);
            // }
            document.getElementById('listHead').style.visibility = "hidden";
            $('.menu').show(10);
            displayMenu = true;
        }
    })
})

$(document).ready(function () {
    $('#home-btn').click(function () {
        if (displayMenu == false) {
            while (document.getElementById('list').hasChildNodes()) {
                var child = document.getElementById('list').lastChild;
                child.parentNode.removeChild(child);
            }
            document.getElementById('listHead').style.visibility = "hidden";
            $('.menu').show(10);
            displayMenu = true;
        }
    })
})

function callback(Results, PlacesServiceStatus) {
    if (PlacesServiceStatus == google.maps.places.PlacesServiceStatus.OK) {
        var length = 0;
        if (Results.length > MAXIMUM_NUMBER_OF_MARKERS) {
            length = MAXIMUM_NUMBER_OF_MARKERS;
        }
        else {
            length = Results.length;
        }
        if ((lastSearch[0] !== request.location) || (lastSearch[1] !== request.radius) || (lastSearch[2] !== request.type)) {
            if (markers.length) {
                for (var i = 0; i < markers.length; i++) {
                    google.maps.event.clearInstanceListeners(markers[i]);
                    markers[i].setMap(null);
                    markers[i] = 0;
                }
                markers.length = 0;
            }
            for (var i = 0; i < length; i++) {
                var marker = new google.maps.Marker({
                    map: map,
                    position: Results[i].geometry.location,
                    title: Results[i].place_id
                });
                addHint(marker);
                markers.push(marker);
            }
            initPlaces(Results);
        }
        lastSearch = [request.location, request.radius, request.type];
    }
    else {
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

function initPlaces(Results) {
    var alreadyFound = -1;
    for (var i = 0; i < INITIAL_PLACES; i++) {
        alreadyFound = -1;
        if (places.length) {
            for (var j = 0; j < places.length; j++) {
                if (places[j][0] == Results[i].place_id) {
                    alreadyFound = j;
                }
            }
        }
        if (alreadyFound == -1) {
            service.getDetails({ placeId: Results[i].place_id }, function (PlaceResult, PlacesServiceStatus) {
                if (PlacesServiceStatus == google.maps.places.PlacesServiceStatus.OK) {
                    places.push([Results[i].title, PlaceResult]);
                }
                else {
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
            })
        }
    }
}

function addHint(marker) {
    var alreadyFound;
    var placeInfo;
    var infoWnd;
    marker.addListener('click', function () {
        
    })
    marker.addListener('mouseover', function () {
        alreadyFound = -1;
        for (var i = 0; i < places.length; i++) {
            if (places[i][0] == marker.title) {
                alreadyFound = i;
            }
        }
        var promise = new Promise(function (resolve, reject) {
            if (alreadyFound !== -1) {
                console.log("Already found data for " + places[alreadyFound][0]);
                placeInfo = places[alreadyFound][1];
                resolve(placeInfo);
            }
            else {
                service.getDetails({ placeId: marker.title }, function (PlaceResult, PlacesServiceStatus) {
                    if (PlacesServiceStatus == google.maps.places.PlacesServiceStatus.OK) {
                        places.push([marker.title, PlaceResult]);
                        placeInfo = places[places.length - 1][1];
                        resolve(placeInfo);
                    }
                    else {
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
                        reject('Something went wrong');
                    }
                })
            }
        })
        promise.then(
            result => {
                infoWnd = new google.maps.InfoWindow({
                    content: result.name
                })
                infoWnd.open(map, marker);
            },
            error => {
                console.log(error);
            })
    })
    marker.addListener('mouseout', function () {
        setTimeout(function () { }, 1000);
        infoWnd.close(marker);
    })
}