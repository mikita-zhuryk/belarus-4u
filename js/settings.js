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

$(document).ready(function () {
    $('#optLang').on('change', function () {
        var value = document.getElementById('optLang').value;
        switch (value) {
            case "English": {
                loc = "Set position\nSearch...\nFood\nLodging\nShopping\nLeisure\nCafe\nMeal Takeaway\nDelivery\nRestaurant\nBar\nLodging\nCampground\nShopping mall\nClothing\nGallery\nMuseum\nZoo\nCasino\nSpa\n";
                loc += "Search radius:\nPrice level:\nPlace rating:\nOpen now\nHas photos available\nPlace ID\nShow map\nI've been here\nReviews\nHistory\nRandom places\nFilters\nSettings\nSelect language:\nSelect color scheme:\n";
                break;
            }
            case "Russian": {
                loc = "Отметить себя\nПоиск...\nПитание\nЖильё\nПокупки\nДосуг\nКафе\nЕда на вынос\nДоставка\nРесторан\nБар\nСъём жилья\nКемпинг\nТорговый центр\nОдежда\nГалерея\nМузей\nЗоопарк\nКазино\nСпа\n";
                loc += "Радиус поиска:\nУровень цен:\nРейтинг места:\nСейчас открыто\nДоступны фото\nID места\nПоказать карту\nЯ здесь был\nОтзывы\nИстория\nСлучайные места\nФильтры\nНастройки\nВыберите язык:\nВыберите цветовую схему:";
                break;
            }
        }
        changeLoc(loc);
    })
})