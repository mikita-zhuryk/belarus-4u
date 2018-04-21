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
var deferred = $.Deferred();
var mapDiv;
var cookie_string = "expires=9/8/2020 00:00:00";
var cache = new Object();

$(document).ready(function () { mapDiv = document.getElementById('map'); })

function performSearch(text) {
    request = {
        location: mapOptions.center,
        radius: radius - 300,
        keyword: text,
        type: text
    };
    service.radarSearch(request, callback);
}

function parseID(text) {
    var res = 0;
    switch (text) {
        case "Cafe": { res = 1; break; }
        case "Meal Takeaway": { res = 2; break; }
        case "Restaurant": { res = 3; break; }
        case "Delivery": { res = 4; break; }
        case "Bar": { res = 5; break; }
        case "Lodging": { res = 6; break; }
        case "Campground": { res = 7; break; }
        case "Shopping mall": { res = 8; break; }
        case "Clothing": { res = 9; break; }
        case "Gallery": { res = 10; break; }
        case "Museum": { res = 11; break; }
        case "Zoo": { res = 12; break; }
        case "Casino": { res = 13; break; }
        case "Spa": { res = 14; break; }
    }
    return res;
}

function createNode(place) {
    var listNode = document.createElement('li');
    listNode.className = 'listNode';
    var nodeName = document.createElement('p');
    nodeName.className = 'nodeName';
    if (place.name) {
        nodeName.innerHTML = place.name;
    }
    else {
        nodeName.innerHTML = "No data for name";
    }
    listNode.appendChild(nodeName);
    var nodeRating = document.createElement('img');
    nodeRating.className = 'nodeRating';
    if (place.rating) {
    }
    listNode.appendChild(nodeRating);
    var nodePhone = document.createElement('p');
    nodePhone.className = 'nodePhone';
    if (place.formatted_phone_number) {
        nodePhone.innerHTML = place.formatted_phone_number;
    }
    else {
        nodePhone.innerHTML = "No data for phone number";
    }
    listNode.appendChild(nodePhone);
    listNode.addEventListener('click', function () {
        if (document.getElementById('infoWindow')) {
            deleteInfoWnd();
        }
        createInfoWnd(place);
            var text = place.place_id;
            cookie_string += "seen=" + text + "; ";
            document.cookie = cookie_string;
            alert(document.cookie);//adding cookies with the place ID
           // var now = new Date(milliseconds);
            //var time = now.getTime();
            //alert(time);
            //var cookie_string = time.toString(time);
          //  cookie_string += "; expires=9/8/2020";
           /* cache.text = place; // adding the viewed object to the cache
            alert(cache.text.name);
            alert(cache.text.formatted_phone_number);*/
    });
    document.getElementById('list').appendChild(listNode);
}

function deleteInfoWnd() {
    if (document.getElementById('infoWindow')) {
        document.body.removeChild(document.getElementById('infoWindow'));
    }
    if (mapDiv.style.visibility == "hidden") {
        mapDiv.style.visibility = "visible";
    }
    if (mapDiv.firstChild.id == 'showBtn') {
        mapDiv.removeChild(mapDiv.firstChild);
    }
}

function createInfoWnd(place) {
    mapDiv.style.visibility = "hidden";
    var infoWnd = document.createElement("div");
    infoWnd.className = "infoWindow";
    infoWnd.id = "infoWindow";
    var title = document.createElement("p");
    title.className = "infoWndTitle";
    title.id = "infoWndTitle";
    title.innerHTML = place.name;
    var hideBtn = document.createElement("button");
    hideBtn.className = "hideBtn";
    hideBtn.id = "hideBtn";
    hideBtn.innerHTML = "Show map";
    hideBtn.addEventListener("click", function () {
        mapDiv.style.visibility = "visible";
        infoWnd.style.visibility = "hidden";
        if (mapDiv.firstChild.id !== 'showBtn') {
            var showBtn = document.createElement("button");
            showBtn.className = "showBtn";
            showBtn.id = "showBtn";
            showBtn.innerHTML = "Show info";
            showBtn.addEventListener("click", function () {
                mapDiv.style.visibility = "hidden";
                infoWnd.style.visibility = "visible";
            });
            mapDiv.insertBefore(showBtn, mapDiv.firstChild);
        }
    });
    infoWnd.appendChild(title);
    infoWnd.appendChild(hideBtn);
    document.body.appendChild(infoWnd);
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
        deferred.done(function () {
            if (displayMenu == true) {
                $('.menu').hide(10);
                $('#listHead').text(text);
                document.getElementById('listHead').style.visibility = "visible";
                displayMenu = false;
                var i = 0;
                var fit = -1;
                while (i < places.length) {
                    fit = -1;
                    if (places[i][2] == parseID(text)) {
                        fit = i;
                    }
                    if (fit !== -1) {
                        createNode(places[fit][1]);
                    }
                    i++;
                }
            }
            deferred = $.Deferred();
        })
    })
})

$(document).ready(function () {
    $('#listHead').click(function showMenu() {
        if (displayMenu == false) {
            var list = document.getElementById('list');
            var child;
            while (list.hasChildNodes()) {
                child = list.lastChild;
                child.parentNode.removeChild(child);
            }
            deleteInfoWnd();
            document.getElementById('listHead').style.visibility = "hidden";
            $('.menu').show(10);
            displayMenu = true;
        }
    })
})

//$(document).ready(function (){
    $('.listNode').click(function (){
        var text = $(this).text();
        alert(text);
        document.cookie = "seen=text; expires=18/04/2020 00:00:00;";
    });
//});

$(document).ready(function () {
    $('#home-btn').click(function () {
        if (displayMenu == false) {
            while (document.getElementById('list').hasChildNodes()) {
                var child = document.getElementById('list').lastChild;
                child.parentNode.removeChild(child);
            }
            deleteInfoWnd();
            document.getElementById('listHead').style.visibility = "hidden";
          //  $('.sub-menu-item').slideUp();
            $('.menu').show(1000);
            displayMenu = true;
        }
    })
})

function callback(Results, PlacesServiceStatus) {
    if (PlacesServiceStatus == google.maps.places.PlacesServiceStatus.OK) {
        var initLength = INITIAL_PLACES;
        var length = 0;
        if (Results.length > MAXIMUM_NUMBER_OF_MARKERS) {
            length = MAXIMUM_NUMBER_OF_MARKERS;
        }
        else {
            length = Results.length;
        }
        if (length < INITIAL_PLACES) {
            initLength = length;
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
        }
        initPlaces(Results, initLength);
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

function initPlaces(Results, number) {
    var alreadyFound = -1;
    var initLength = 0;
    for (var i = 0; i < number; i++) {
        alreadyFound = -1;
        if (places.length) {
            for (var j = 0; j < places.length; j++) {
                if (places[j][0] == Results[i].place_id) {
                    alreadyFound = j;
                    initLength++;
                    break;
                }
            }
        }
        if (alreadyFound == -1) {
            service.getDetails({ placeId: Results[i].place_id }, function (PlaceResult, PlacesServiceStatus) {
                if (PlacesServiceStatus == google.maps.places.PlacesServiceStatus.OK) {
                    places.push([PlaceResult.place_id, PlaceResult, parseID(text)]);
                    initLength++;
                    if (initLength == number) {
                        deferred.resolve();
                    }
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
        else {
            if (initLength == number) {
                deferred.resolve();
            }
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
                        places.push([marker.title, PlaceResult, parseID(text)]);
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