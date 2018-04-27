var displayMenu = true;
var radius = 3500;
var INITIAL_PLACES = 8 * radius / 3500;
var MAXIMUM_NUMBER_OF_MARKERS = INITIAL_PLACES * 3;
var request;
var gText;
var service;
var markers = [];
var places = [];
var lastSearch = [];
var deferred = $.Deferred();
var mapDiv;
var cookie_string = "expires=9/8/2020 00:00:00";
var cache = new Object();
var pending = true;
var resultArr;
var list;
var minRating = 1.0;
var maxRating = 5.0;

$(window).on('load', function () {
    mapDiv = document.getElementById('mapHandler');

})

function performSearch(text) {
    request = {
        location: mapOptions.center,
        radius: radius * 0.7,
        keyword: text,
        type: text,
        //minPriceLevel: 0,
        //maxPriceLevel: 4,
        openNow: document.getElementById('openNowCheck').checked,
        rankBy: google.maps.places.RankBy.DISTANCE
    };
    service.radarSearch(request, callback);
}

function parseID(text) {
    var res = 0;
    var chr = 0;
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
        default: {
            if (text.length === 0) return res;
            for (i = 0; i < text.length; i++) {
                chr = text.charCodeAt(i);
                res = ((res << 5) - res) + chr;
                res |= 0; // Convert to 32bit integer
            }
        }
    }
    return res;
}

function createNode(place) {
    var listNode = document.createElement('li');
    listNode.className = 'listNode';
    if ((document.getElementById('list').children.length) % 2 == 1) {
        listNode.style.background = "#181818";
    }
    var nodeName = document.createElement('p');
    nodeName.className = 'nodeName';
    if (place.name) {
        nodeName.innerHTML = place.name;
    }
    else {
        nodeName.innerHTML = "No data for name";
    }
    listNode.appendChild(nodeName);
    var nodeRatingValue = document.createElement('div');
    nodeRatingValue.className = 'nodeRatingValue';
    if (place.rating !== undefined) {
        nodeRatingValue.style.width = 105 * place.rating / 5 + "px";
    }
    else {
        nodeRatingValue.style.width = 0 + "px";
    }
    listNode.appendChild(nodeRatingValue);
    var nodeRating = document.createElement('img');
    nodeRating.className = 'nodeRating';
    nodeRating.src = 'images/Stars.png';
    nodeRating.title = "Rating " + place.rating;
    nodeRatingValue.appendChild(nodeRating);
    var nodePhone = document.createElement('p');
    nodePhone.className = 'nodePhone';
    if (place.formatted_phone_number) {
        nodePhone.innerHTML = place.formatted_phone_number;
    }
    else {
        nodePhone.innerHTML = "No data for phone number";
    }
    var imgPhone = document.createElement('img');
    imgPhone.className = 'imgPhone';
    imgPhone.src = "images/Phone.png";
    nodePhone.appendChild(imgPhone);
    listNode.appendChild(nodePhone);
    listNode.addEventListener('click', function () {
        //var lastID = -1;
        if (document.getElementById('infoWindow').style.visibility == "visible") {
            if (document.getElementsByName("identifyWnd").innerHTML == place.place_id) {
                hideInfoWnd();
            }
            else {
                updateInfoWnd(place);
                document.getElementsByName("identifyWnd").innerHTML = place.place_id;
            }
        }
        else {
            updateInfoWnd(place);
            document.getElementsByName("identifyWnd").innerHTML = place.place_id;

        }
    });
    document.getElementById('list').appendChild(listNode);
}

function hideInfoWnd() {
    document.getElementById('infoWindow').style.visibility = "hidden";
    if (mapDiv.firstChild.id == 'showBtn') {
        mapDiv.removeChild(mapDiv.firstChild);
    }
    mapDiv.style.visibility = "visible";
}

function updateInfoWnd(place) {
    mapDiv.style.visibility = "hidden";
    var titleWnd = document.getElementsByClassName("titleWnd")[0];
    titleWnd.id = place.place_id;
    document.getElementById("websiteWnd").href = undefined;
    document.getElementById("websiteWnd").classList.remove("disabled");
    if (place.name) {
        titleWnd.innerHTML = place.name;
    }
    else {
        titleWnd.innerHTML = "No data for name";
    }
    var rateWnd = document.getElementById("rateWnd");
    if (place.rating) {
        rateWnd.style.width = 234 * place.rating / 5 + "px";
    }
    else {
        rateWnd.style.width = 0 + "px";
    }
    if (place.formatted_address !== undefined) {
        document.getElementById("placeAddressWnd").innerHTML = place.formatted_address;
    }
    else {
        document.getElementById("placeAddressWnd").innerHTML = "No data for address";
    }
    if (place.international_phone_number !== undefined) {
        document.getElementById("placePhoneWnd").innerHTML = place.international_phone_number;
    }
    else {
        document.getElementById("placePhoneWnd").innerHTML = "No data for phone number";
    }
    if (place.website !== undefined) {
        document.getElementById("websiteWnd").innerHTML = place.website;
        document.getElementById("websiteWnd").href = place.website;
    }
    else {
        document.getElementById("websiteWnd").innerHTML = "No data for website";
        document.getElementById("websiteWnd").classList.add('disabled');
    }
    //document.getElementById("photoWnd").src = place.photos[0].getUrl({'maxWidth': 1000, 'maxHeight': 1000});

    /////////////////////////////////////////////

    var infoWindow = document.getElementById("infoWindow")
    infoWindow.style.visibility = "visible";
    var hideBtn = document.getElementById('hideBtn');
    hideBtn.addEventListener("click", function () {
        mapDiv.style.visibility = "visible";
        infoWindow.style.visibility = "hidden";
        if (mapDiv.firstChild.id !== 'showBtn') {
            var showBtn = document.createElement("button");
            showBtn.className = "showBtn";
            showBtn.id = "showBtn";
            showBtn.innerHTML = "Show info";
            showBtn.addEventListener("click", function () {
                mapDiv.style.visibility = "hidden";
                infoWindow.style.visibility = "visible";
            });
            mapDiv.insertBefore(showBtn, mapDiv.firstChild);
        }
    });
}

function removeMarkers(markers) {
    if (markers.length) {
        for (var i = 0; i < markers.length; i++) {
            google.maps.event.clearInstanceListeners(markers[i]);
            markers[i].setMap(null);
            markers[i] = 0;
        }
        markers.length = 0;
    }
}

function loadSome() {
    var lastLoaded = -1;
    var found = false;
    list = document.getElementById('list');
    if ((list.scrollHeight - (list.scrollTop + list.clientHeight)) <= 250) {
        for (var i = 0; i < resultArr.length; i++) {
            found = false;
            for (var j = 0; j < places.length; j++) {
                if (resultArr[i].place_id == places[j][0]) {
                    found = true;
                    break;
                }
            }
            if (!found) {
                lastLoaded = i - 1;
                break;
            }
        }
        if (i !== resultArr.length - 1) {
            service.getDetails({ placeId: resultArr[lastLoaded + 1].place_id }, function (PlaceResult, PlacesServiceStatus) {
                if (PlacesServiceStatus == google.maps.places.PlacesServiceStatus.OK) {
                    places.push([PlaceResult.place_id, PlaceResult, parseID(gText), request.location]);
                    if (((!($('#openNowCheck').checked)) || (PlaceResult.openNow)) && ((!($('#hasPhoto').checked)) || (PlaceResult.photos.length)) && (PlaceResult.rating >= minRating) && (PlaceResult.rating <= maxRating)) {
                        createNode(PlaceResult);
                    }
                    else {
                        loadSome();
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
            });
        }
    }
}

function showMenu() {
    var list = document.getElementById('list');
    list.removeEventListener("scroll", loadSome, false);
    var child;
    while (list.hasChildNodes()) {
        child = list.lastChild;
        child.parentNode.removeChild(child);
    }
    hideInfoWnd();
    document.getElementById('listHead').style.visibility = "hidden";
    $('.filterWnd').hide(10);
    $('.menu').show(10);
    displayMenu = true;
}

function hideMenu(text) {
    var list = document.getElementById('list');
    list.addEventListener("scroll", loadSome, false);
    $('.filterWnd').hide(10);
    $('.menu').hide(10);
    $('#listHead').text(text);
    document.getElementById('listHead').style.visibility = "visible";
    displayMenu = false;
}

function search(text) {
    gText = text;
    //removeMarkers(markers);
    if (displayMenu == false) {
        showMenu();
    }
    if (!service) {
        service = new google.maps.places.PlacesService(map);
    }
    performSearch(text);
    deferred.done(function () {
        hideMenu(text);
        var i = 0;
        var fit = -1;
        var lastFit = -1;
        var fitted = 0;
        while (i < places.length) {
            fit = -1;
            if ((places[i][2] == parseID(text)) && (places[i][3] == mapOptions.center) && ((!($('#openNowCheck').checked)) || (places[i][1].openNow)) && ((!($('#hasPhoto').checked)) || (places[i][1].photos.length)) && (places[i][1].rating >= minRating) && (places[i][1].rating <= maxRating)) {
                //if ((places[i][2] == parseID(text)) && (places[i][3] == mapOptions.center) && ((!($('#hasPhoto').checked)) || (places[i][1].photos.length)) && (places[i][1].price_level >= request.minPriceLevel) && (places[i][1].price_level <= request.maxPriceLevel)) {
                fit = i;
                fitted++;
            }
            if (fit !== -1) {
                createNode(places[fit][1]);
                lastFit = fit;
            }
            i++;
        }
        if (fitted == 1) {
            updateInfoWnd(places[fit][1]);
        }
        if (fitted < INITIAL_PLACES) {
            for (var i = 0; i < INITIAL_PLACES - fitted; i++) {
                loadSome();
            }
        }
        deferred = $.Deferred();
    })
}

// $(document).ready(function() {
//     document.getElementById('searchBox').addEventListener("input", function(str) {
//         search(str);
//     });
//     $('#searchBox').input(function (str) {
//         search(str);
//     })
// })

$(document).ready(function () {
    $('.sub-menu-item').click(function () {
        var text = $(this).text();
        search(text);
    });
})

$(document).ready(function () {
    $('.listHead').click(function () {
        showMenu();
    });
})

//$(document).ready(function (){
/*$('.listNode').click(function () {
    var text = $(this).text();
    alert(text);
    document.cookie = "seen=text; expires=18/04/2020 00:00:00;";
});*/
//});

$(document).ready(function () {
    $('#home-btn').click(function () {
        if (displayMenu == false) {
            showMenu();
            displayMenu = true;
        }
    })
})

function callback(Results, PlacesServiceStatus) {
    console.log(request.keyword);
    if (PlacesServiceStatus == google.maps.places.PlacesServiceStatus.OK) {
        resultArr = Results;
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
        if ((lastSearch[0] !== request.location) || (lastSearch[1] !== request.radius) || (lastSearch[2] !== request.type) || (lastSearch[3] !== request.openNow) || (lastSearch[4] !== minRating) || (lastSearch[5] !== maxRating)) {
            //if ((lastSearch[0] !== request.location) || (lastSearch[1] !== request.radius) || (lastSearch[2] !== request.type) || (lastSearch[3] !== request.minPriceLevel) || (lastSearch[4] !== request.maxPriceLevel) || (lastSearch[5] !== request.openNow)) {
            removeMarkers(markers);
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
        lastSearch = [request.location, request.radius, request.type, request.openNow, minRating, maxRating];
        //lastSearch = [request.location, request.radius, request.type, request.minPriceLevel, request.maxPriceLevel, request.openNow];
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
    var loadedThis = 0;
    for (var i = 0; (i < number) && (i < resultArr.length); i++) {
        alreadyFound = -1;
        if (places.length) {
            for (var j = 0; j < places.length; j++) {
                if (places[j][0] == Results[i].place_id) {
                    alreadyFound = j;
                    loadedThis++;
                    break;
                }
            }
        }
        if (alreadyFound == -1) {
            service.getDetails({ placeId: Results[i].place_id }, function (PlaceResult, PlacesServiceStatus) {
                if (PlacesServiceStatus == google.maps.places.PlacesServiceStatus.OK) {
                    places.push([PlaceResult.place_id, PlaceResult, parseID(gText), request.location]);
                    loadedThis++;
                    if (loadedThis == number) {
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
            if (loadedThis == number) {
                deferred.resolve();
            }
        }
    }
}

function addHint(marker) {
    var alreadyFound;
    var placeInfo;
    var infoWnd;
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
                        places.push([marker.title, PlaceResult, parseID(gText), request.location]);
                        if (((!($('#openNowCheck').checked)) || (PlaceResult.openNow)) && ((!($('#hasPhoto').checked)) || (PlaceResult.photos.length)) && (PlaceResult.rating >= minRating) && (PlaceResult.rating <= maxRating)) {
                            createNode(PlaceResult);
                        }
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
                var contentStr = "";
                if (result.name !== undefined) {
                    contentStr += result.name;
                }
                if (result.rating !== undefined) {
                    contentStr += "; Rating: " + result.rating;
                }
                if (result.openNow) {
                    contentStr += "; Open now";
                }
                infoWnd = new google.maps.InfoWindow({
                })
                infoWnd.setContent(contentStr);
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
    marker.addListener('click', function () {
        updateInfoWnd(placeInfo);
    })
}

$.ajax()