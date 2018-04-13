var service;
var flag = false;
var places = [];
var markers = [];
var radius = 3500;
var displayMenu = true;
var text;
var INITIAL_PLACES = 3;

$(document).ready(function () {
    $(".sub-menu-item").click(function search() {
        console.log($(this).text());
        var request = {
            location: mapOptions.center,
            radius: radius - 300,
            type: $(this).text(),
            keyword: $(this).text()
        };
        if (!flag) service = new google.maps.places.PlacesService(map);
        service.radarSearch(request, callback);
        if (displayMenu == true) {
            text = $(this).text();
            $('.menu').hide(10);
            $('#listHead').text(text);
            document.getElementById('listHead').style.visibility = "visible";
            var fit = false;
            for (var i = 0; i < places.length; i++) {
                fit = false;
                for (var j = 0; j < places[i][1].types.length; j++) {
                    if (places[i][1].types[j].toLowerCase() == text.toLowerCase()) {
                        fit = true;
                    }
                }
                if (fit) {
                    var listNode = document.createElement('li');
                    listNode.className = 'listNode';
                    listNode.id = 'listNode';
                    listNode.appendChild(document.createTextNode(places[i][1].name));
                    document.getElementById('listHead').appendChild(listNode);
                    var mapDiv = document.getElementById('map');
                    listNode.addEventListener("click", function createInfoWnd() {
                        if (document.getElementById('infoWindow')) {
                            document.body.removeChild(document.getElementById('infoWindow'));
                            mapDiv.style.visibility = "visible";
                            mapDiv.removeChild(document.getElementById('showInfo'));
                        }
                        if (mapDiv.style.visibility == "visible") {
                            mapDiv.style.visibility = "hidden";
                            var PlaceInfo = document.createElement('div');
                            PlaceInfo.id = "infoWindow";
                            var title = document.createElement('p');
                            title.id = 'title';
                            title.innerHTML = listNode.innerHTML;
                            var btn = document.createElement('button');
                            btn.id = 'hideInfo';
                            btn.innerHTML = 'Hide info';
                            btn.addEventListener('click', function () {
                                mapDiv.style.visibility = "visible";
                                document.getElementById('infoWindow').style.visibility = "hidden";
                                if (mapDiv.firstChild.id !== 'showInfo') {
                                    var btn2 = document.createElement('button');
                                    btn2.id = 'showInfo';
                                    btn2.innerHTML = 'Show info';
                                    btn2.addEventListener('click', function () {
                                        mapDiv.style.visibility = "hidden";
                                        document.getElementById('infoWindow').style.visibility = "visible";
                                    })
                                    mapDiv.insertBefore(btn2, mapDiv.firstChild);
                                }
                            })
                            PlaceInfo.appendChild(title);
                            PlaceInfo.appendChild(btn);
                            document.body.appendChild(PlaceInfo);
                        }
                        else {
                            mapDiv.style.visibility = "visible";
                            document.body.removeChild(document.body.lastChild);
                        }
                    })
                }
            }
            displayMenu = false;
        }
    })
})

$(document).ready(function () {
    $('#listHead').dblclick(function showMenu() {
        if (displayMenu == false) {
            var mapDiv = document.getElementById('map');
            while (document.getElementById('listHead').hasChildNodes()) {
                var child = document.getElementById('listHead').lastChild;
                child.parentNode.removeChild(child);
            }
            if (mapDiv.style.visibility == "hidden") {
                mapDiv.style.visibility = "visible";
            }
            if (document.getElementById('infoWindow')) {
                document.body.removeChild(document.getElementById('infoWindow'));
            }
            if (mapDiv.firstChild.id == 'showInfo') {
                mapDiv.removeChild(mapDiv.firstChild);
            }
            document.getElementById('listHead').style.visibility = "hidden";
            $('.menu').show();
            displayMenu = true;
        }
    })
})

function callback(results, PlacesServiceStatus) {
    if (results.length > 20) {
        results.length = 20;
    }
    errorMsg(function (e) {
        initPlaces(results);
        console.log(e);
        if (flag) {
            console.log("Deleting markers");
            for (var i = 0; i < markers.length; i++) {
                google.maps.event.clearInstanceListeners(markers[i]);
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
    }, "Everything is OK", function (s) { console.log(s); }, "Something went wrong", PlacesServiceStatus)
}

function initPlaces(results) {
    var found = -1;
    for (var i = 0; i < INITIAL_PLACES; i++) {
        found = -1;
        if (places.length) {
            for (var j = 0; j < places.length; j++) {
                if (places[j][0] == results[i].place_id) {
                    found = j;
                }
            }
        }
        if (found == -1) {
            service.getDetails({ placeId: results[i].place_id }, function (PlaceResult, PlacesServiceStatus) {
                var succArg = [results[i].place_id, PlaceResult];
                var failArg = "Failed to push " + results[i].place_id;
                //errorMsg(function(a) { places.push(a); }, succArg, function (s) { console.log(s); }, failArg, PlacesServiceStatus);
                places.push(succArg);
            })
        }
    }
}

function addHint(marker) {
    //console.log("Adding listener to " + marker.title);
    var infowindow;
    marker.addListener('mouseout', function () {
        infowindow.close(marker);
    });
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
                    errorMsg(resolve, PlaceResult, reject, marker, PlacesServiceStatus);
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
}

function errorMsg(funcSuccess, succArg, funcFail, failArg, PlacesServiceStatus) {
    if (PlacesServiceStatus == google.maps.places.PlacesServiceStatus.OK) {
        funcSuccess(succArg);
    }
    else {
        funcFail(failArg);
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