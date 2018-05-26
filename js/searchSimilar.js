var randStr = "Random places";

$(document).ready(function () {
    $('#random-btn').click(function () {
        if (document.getElementById('listHead').innerHTML !== randStr) {
            hideMenu(randStr);
            findSimilar(places, createHistory());
        }
        else {
            showMenu();
        }
    })
})

function placeDist(place1, place2) {
    var distance = 0;
    var found;
    for (var aspect in place1.aspects) {
        found = false;
        for (var i = 0; i < place2.aspects.length; i++) {
            if (place2.aspects[i] == aspect) {
                distance += (minRating - place2.rating) * 3;
                distance += math.abs(place2.aspects[i] - aspect);
                found = true;
                break;
            }
        }
        if (!found) {
            distance += 5;
        }
    }
    distance /= 15;
    return distance;
}

function findSimilar(places, history) {
    removeMarkers(markers);
    for (var i = 0; i < places.length; i++) {
        for (var j = 0; j < history.length; j++) {
            if ((places[i][1] !== history[j][1]) && (placeDist(places[i][1], history[j][1]) < 3)) {
                var marker = new google.maps.Marker({
                    map: map,
                    position: places[i][1].geometry.location,
                    title: places[i][1].place_id
                });
                addHint(marker);
                markers.push(marker);
                createNode(places[i][1]);
                break;
            }
        }
    }
}