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
var pending = true;
var resultArr;
var list;
var minRating = 1.0;
var maxRating = 5.0;
var locked = false;
var historyStr = "History";
var showBtnStr = "Info";
var imgPhoneSRC = "images/Phone.png";
var imgStarsSRC = "images/Stars.png";

$(window).on('load', function () {
    mapDiv = document.getElementById('mapHandler');
    document.cookie = "Date = " + new Date();
})

function performSearch(text) {
    drawCircle();
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
    var subMenuItems = document.getElementsByClassName('sub-menu-item');
    switch (text) {
        case (subMenuItems[0].innerHTML).toString(): { res = 1; break; }
        case (subMenuItems[1].innerHTML).toString(): { res = 2; break; }
        case (subMenuItems[2].innerHTML).toString(): { res = 3; break; }
        case (subMenuItems[3].innerHTML).toString(): { res = 4; break; }
        case (subMenuItems[4].innerHTML).toString(): { res = 5; break; }
        case (subMenuItems[5].innerHTML).toString(): { res = 6; break; }
        case (subMenuItems[6].innerHTML).toString(): { res = 7; break; }
        case (subMenuItems[7].innerHTML).toString(): { res = 8; break; }
        case (subMenuItems[8].innerHTML).toString(): { res = 9; break; }
        case (subMenuItems[9].innerHTML).toString(): { res = 10; break; }
        case (subMenuItems[10].innerHTML).toString(): { res = 11; break; }
        case (subMenuItems[11].innerHTML).toString(): { res = 12; break; }
        case (subMenuItems[12].innerHTML).toString(): { res = 13; break; }
        case (subMenuItems[13].innerHTML).toString(): { res = 14; break; }
        default: {
            if (text.length === 0) return res;
            for (i = 0; i < text.length; i++) {
                chr = text.charCodeAt(i);
                res = ((res << 5) - res) + chr;
                res |= 0;
            }
        }
    }
    return res;
}

function createNode(place) {
    var listNode = document.createElement('li');
    listNode.className = 'listNode';
    // if ((document.getElementById('list').children.length) % 2 == 1) {
    //     listNode.style.background = "#181818";
    // }
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
    nodeRating.src = imgStarsSRC;
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

    imgPhone.src = imgPhoneSRC;
    nodePhone.appendChild(imgPhone);
    listNode.appendChild(nodePhone);
    var bottomBorder = document.createElement("div");
    bottomBorder.className = "listNodeBorder";
    listNode.appendChild(bottomBorder);
    listNode.addEventListener('click', function () {
        hideInfoWnd();
        if (document.getElementById('infoWindow').style.display != "none") {
            if (document.getElementsByName("identifyWnd").innerHTML == place.place_id) {
                document.getElementById('reviewForm').style.visibility = "hidden";
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
    showMarkers();
    $('#infoWindow').slideUp('speed');
    if (mapDiv.firstChild.id == 'showBtn') {
        mapDiv.removeChild(mapDiv.firstChild);
    }
}

function writeCookie(place) {
    var text = place.place_id;
    var exp = new RegExp("id = " + text);
    var r = document.cookie.match(exp);
    if (!r || (r == undefined) || (r.length == 0)) {
        document.cookie += "id = " + text.toString();
        clearReviewForm();
    }
}

function hideMarkers(place) {
    for (var i = 0; i < markers.length; i++) {
        if (markers[i].title != place.place_id) {
            markers[i].setVisible(false);
        }
    }
}

function showMarkers() {
    for (var i = 0; i < markers.length; i++) {
        markers[i].setVisible(true);
    }
}

function clearReviewForm() {
    var reviewForm = document.getElementById('userReview');
    reviewForm.placeholder = placeHStr;
    reviewForm.value = "";
    $('#leaveReview').show();
}

function alreadyLeftReview() {
    var reviewForm = document.getElementById('userReview');
    reviewForm.placeholder = placeHStr;
    reviewForm.value = thanks;
    $('#leaveReview').hide();
}

function updateInfoWnd(place) {
    hideMarkers(place);
    if (checkBeen(place)) {
        alreadyLeftReview();
        document.getElementById('checkBeen').checked = true;
        document.getElementById('reviews').style.height = "calc(70% - 190px)";
        document.getElementById('reviewForm').style.visibility = "visible";
    }
    else {
        clearReviewForm();
        document.getElementById('checkBeen').checked = false;
        document.getElementById('reviews').style.height = "";
        document.getElementById('reviewForm').style.visibility = "hidden";
    }
    $('#checkBeen').change(function () {
        if (this.checked) {
            document.getElementById('reviews').style.height = "calc(70% - 190px)";
            document.getElementById('reviewForm').style.visibility = "visible";
            writeCookie(place);
        }
        else {
            alreadyLeftReview();
            document.getElementById('reviews').style.height = "";
            document.getElementById('reviewForm').style.visibility = "hidden";
        }
    })
    document.getElementById('identifyWnd').innerHTML = place.place_id;
    var titleWnd = document.getElementsByClassName("titleWnd")[0];
    document.getElementById("websiteWnd").href = undefined;
    document.getElementById("websiteWnd").classList.remove("disabled");
    if (place.name.length) {
        if (place.name.length >= 33) {
            titleWnd.innerHTML = place.name.substring(0, 32) + "...";
        }
        else {
            titleWnd.innerHTML = place.name;
        }
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
        if (place.formatted_address.length > 38) {
            document.getElementById("placeAddressWnd").innerHTML = place.formatted_address.substring(0, 38) + "...";
        }
        else {
            document.getElementById("placeAddressWnd").innerHTML = place.formatted_address;
        }
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
        if (place.website.length > 38) {
            document.getElementById("websiteWnd").innerHTML = place.website.substring(0, 38) + "...";
            document.getElementById("websiteWnd").href = place.website;
        }
        else {
            document.getElementById("websiteWnd").innerHTML = place.website;
            document.getElementById("websiteWnd").href = place.website;
        }
    }
    else {
        document.getElementById("websiteWnd").innerHTML = "No data for website";
        document.getElementById("websiteWnd").classList.add('disabled');
    }
    if (place.photos !== undefined) {
        if (place.photos.length > 2) {
            document.getElementById('placePhoto').src = place.photos[1].getUrl({ maxWidth: 1000, maxHeight: 1000 });
        }
    }
    else {
        document.getElementById('placePhoto').src = 'images/noData.jpg';
    }
    if (place.reviews !== undefined) {
        var reviews = document.getElementsByClassName('reviewText');
        for (var i = 0; i < reviews.length; i++) {
            if (place.reviews[i] !== undefined) {
                reviews[i].innerHTML = "  " + place.reviews[i].text;
            }
        }
    }

    //////////////////////////////////////////////////////
    var infoWindow = document.getElementById("infoWindow")
    $('#infoWindow').slideDown('speed');
    var hideBtn = document.getElementById('hideBtn');
    hideBtn.addEventListener("click", function () {
        $('#infoWindow').fadeOut(100);
        if (mapDiv.firstChild.id !== 'showBtn') {
            var showBtn = document.createElement("button");
            showBtn.className = "showBtn";
            showBtn.id = "showBtn";
            showBtn.innerHTML = showBtnStr;
            showBtn.addEventListener("click", function () {
                $('#infoWindow').fadeIn(100);
            });
            mapDiv.insertBefore(showBtn, mapDiv.firstChild);
        }
    });
}

function checkBeen(place) {
    var text = place.place_id;
    var exp = new RegExp("id = " + text.toString());
    var r = document.cookie.match(exp);
    if (r) {
        return true;
    }
    else {
        return false;
    }
}

function removeMarkers() {
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
    if (locked) return;
    else {
        var lastLoaded = -1;
        var found = false;
        list = document.getElementById('list');
        if ((list.scrollHeight - (list.scrollTop + list.clientHeight)) <= 250) {
            locked = true;
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
            if (lastLoaded !== -1) {
                service.getDetails({ placeId: resultArr[lastLoaded + 1].place_id }, function (PlaceResult, PlacesServiceStatus) {
                    if (PlacesServiceStatus == google.maps.places.PlacesServiceStatus.OK) {
                        places.push([PlaceResult.place_id, PlaceResult, parseID(gText), request.location]);
                        if (((!($('#openNowCheck').checked)) || (PlaceResult.openNow)) && ((!($('#hasPhoto').checked)) || (PlaceResult.photos.length)) && (PlaceResult.rating >= minRating) && (PlaceResult.rating <= maxRating)) {
                            var marker = new google.maps.Marker({
                                map: map,
                                position: PlaceResult.geometry.location,
                                title: PlaceResult.place_id,
                                icon: "images/placeMarker.png"
                            });
                            addHint(marker);
                            markers.push(marker);
                            createNode(PlaceResult);
                            locked = false;
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
                            setTimeout(function () { locked = false; }, 500);
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
            else {
                var list = document.getElementById('list');
                list.removeEventListener("scroll", loadSome, true);
                locked = false;
            }
        }
    }
}

function showMenu() {
    var list = document.getElementById('list');
    list.removeEventListener("scroll", loadSome, true);
    var child;
    while (list.hasChildNodes()) {
        child = list.lastChild;
        child.parentNode.removeChild(child);
    }
    hideInfoWnd();
    document.getElementById('listHead').innerHTML = "";
    document.getElementById('listHead').style.visibility = "hidden";
    hideFilters();
    hideSettings();
    $('.menu').show('speed');
    displayMenu = true;
}

function hideMenu(text) {
    var list = document.getElementById('list');
    list.removeEventListener("scroll", loadSome, true);
    var child;
    while (list.hasChildNodes()) {
        child = list.lastChild;
        child.parentNode.removeChild(child);
    }
    if (text !== historyStr) {
        list.addEventListener("scroll", loadSome, true);
    }
    text += " ";
    hideFilters();
    hideSettings();
    $('.menu').hide('speed');
    var trimmedString = text.substr(0, 20);
    trimmedString = trimmedString.substr(0, Math.min(trimmedString.length, trimmedString.lastIndexOf(" ")))
    $('#listHead').text(trimmedString);
    document.getElementById('listHead').style.visibility = "visible";
    displayMenu = false;
}

function search(text) {
    gText = text;
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

$(document).ready(function () {
    $('#home-btn').click(function () {
        if (displayMenu == false) {
            showMenu();
            displayMenu = true;
        }
    })
})

function createHistory() {
    var history = [];
    var exp = new RegExp('id = [-_A-Za-z0-9]{27}', 'g');
    var r = document.cookie.match(exp);
    if (r !== null) {
        for (var i = 0; i < r.length; i++) {
            id = r[i];
            for (var j = 0; j < places.length; j++) {
                if (places[j][0] == id.split(" ")[2]) {
                    history.push(places[j]);
                    break;
                }
            }
            r = document.cookie.match(exp);
        }
    }
    return history;
}

$(document).ready(function () {
    $('#history-btn').click(function () {
        if (!displayMenu && (document.getElementById('listHead').innerHTML == historyStr)) {
            showMenu();
        }
        else {
            showMenu();
            hideMenu(historyStr);
            var exp = new RegExp('id = [-_A-Za-z0-9]{27}', 'g');
            var r = document.cookie.match(exp);
            for (var i = 0; i < r.length; i++) {
                id = r[i];
                for (var j = 0; j < places.length; j++) {
                    if (places[j][0] == id.split(" ")[2]) {
                        createNode(places[j][1]);
                        break;
                    }
                }
                r = document.cookie.match(exp);
            }
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
            removeMarkers();
            for (var i = 0; i < length; i++) {
                var marker = new google.maps.Marker({
                    map: map,
                    position: Results[i].geometry.location,
                    title: Results[i].place_id,
                    icon: "images/placeMarker.png"
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
                    if (((!($('#openNowCheck').checked)) || (PlaceResult.openNow)) && ((!($('#hasPhoto').checked)) || (PlaceResult.photos.length)) && (PlaceResult.rating >= minRating) && (PlaceResult.rating <= maxRating)) {
                        places.push([PlaceResult.place_id, PlaceResult, parseID(gText), request.location]);
                    }
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

var rateStr = "; Rating: ";
var openNowStr = "; Open now";

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
                        createNode(PlaceResult);
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
                    contentStr += rateStr + result.rating;
                }
                if (result.opening_hours.openNow) {
                    contentStr += openNowStr;
                }
                infoWnd = new google.maps.InfoWindow({});
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
        document.getElementsByName("identifyWnd").innerHTML = placeInfo.place_id;
        updateInfoWnd(placeInfo);
    })
}

function distance(latitude1, longitude1, latitude2, longitude2) {
    return (6371 * Math.acos(Math.sin(latitude1)*Math.sin(latitude2) + Math.cos(latitude1)*Math.cos(latitude2)*Math.cos(longitude1 - longitude2)));
}