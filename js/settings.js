var displaySet = false;
var setStr = "Settings"

function showSettings() {
    hideMenu(setStr);
    $("#settingsWnd").show(10);
    displaySet = true;
}

function hideSettings() {
    showMenu();
    $("#settingsWnd").hide(10);
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

$(document).ready(function () {
    $('.lang-btn').click(function (e) {
        var value = $(this).val();
        var loc;
        switch (value) {
            case "Eng": {
                loc = "Set position\nSearch...\nFood\nLodging\nShopping\nLeisure\nCafe\nMeal Takeaway\nDelivery\nRestaurant\nBar\nLodging\nCampground\nShopping mall\nClothing\nGallery\nMuseum\nZoo\nCasino\nSpa\n";
                loc += "Search radius:\nPrice level:\nPlace rating:\nOpen now\nHas photos available\nPlace ID\nShow map\nI've been here\nReviews\nHistory\nRandom places\nFilters\nSettings\nSelect language:\nSelect color scheme:\n";
                break;
            }
            case "Rus": {
                loc = "Отметить себя\nПоиск...\nПитание\nЖильё\nПокупки\nДосуг\nКафе\nЕда на вынос\nДоставка\nРесторан\nБар\nСъём жилья\nКемпинг\nТорговый центр\nОдежда\nГалерея\nМузей\nЗоопарк\nКазино\nСпа\n";
                loc += "Радиус поиска:\nУровень цен:\nРейтинг места:\nСейчас открыто\nДоступны фото\nID места\nПоказать карту\nЯ здесь был\nОтзывы\nИстория\nСлучайные места\nФильтры\nНастройки\nВыберите язык:\nВыберите цветовую схему:";
                break;
            }
        }
        changeLoc(loc);
    })
})