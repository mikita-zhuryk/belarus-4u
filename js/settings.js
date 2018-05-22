var displaySet = false;

function showSettings() {
    $("#setScreen").show(10);
    displaySet = true;
}

function hideSettings() {
    $("#setScreen").hide(10);
    displaySet = false;
}

$(document).ready(function () {
    $("#settings-btn").click(function () {
        if (displaySet) {
            hideSettings();
        }
        else {
            showSettings();
        }
    })
})

function changeLoc(localizationStr) {
    var lines = localizationStr.split('\n');
    var i = 0;
    document.getElementById('setPos').innerHTML = lines[i++];
    var menu_items = document.getElementsByClassName('menu-item');
    for (var j = 0; j < menu_items.length; j++) {
        menu_items[j].innerHTML = lines[i++];
    }
    var sub_menu_items = document.getElementsByClassName('sub-menu-item');
    for (var j = 0; j < sub_menu_items.length; j++) {
        sub_menu_items[j].innerHTML = lines[i++];
    }
}

$(document).ready(function () {
    $('#optLang').on('change', function () {
        var value = document.getElementById('optLang').value;
        switch (value) {
            case "English": {
                loc = "Set position\nFood\nLodging\nShopping\nLeisure\nCafe\nMeal Takeaway\nDelivery\nRestaurant\nBar\nLodging\nCampground\nShopping mall\nClothing\nGallery\nMuseum\nZoo\nCasino\nSpa\n";
                loc += "Search radius:\nPrice level:\nPlace rating:\nOpen now\nHas photos available\nPlace ID\nShow map\nI've been here\nReviews\nSelect language:\nSelect color scheme:";
                break;
            }
            case "Russian": {
                loc = "Отметить себя\nПитание\nЖильё\nПокупки\nДосуг\nКафе\nЕда на вынос\nДоставка\nРесторан\nБар\nСъём жилья\nКемпинг\nТорговый центр\nОдежда\nГалерея\nМузей\nЗоопарк\nКазино\nСпа\n";
                loc += "Радиус поиска:\nУровень цен:\nРейтинг места:\nСейчас открыто\nДоступны фото\nID места\nПоказать карту\nЯ здесь был\nОтзывы\nВыберите язык:\nВыберите цветовую схему:";
                break;
            }
        }
        changeLoc(loc);
    })
})