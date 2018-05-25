var setStr = "Settings"
var displaySet = false;

function showSettings() {
    hideMenu(setStr);
    $("#settingsWnd").show('speed');
    displaySet = true;
}

function hideSettings() {
    $('#settingsWnd').hide('speed');
    displaySet = false;
}

$(document).ready(function () {
    $("#settings-btn").click(function () {
        if (displaySet) {
            showMenu();
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
        document.getElementsByClassName('sub-menu-item')[1].style = "font-size: 35px";
        switch (value) {
            case "Eng": {
                loc = "Set position\nSearch...\nFood\nLodging\nShopping\nLeisure\nCafe\nMeal Takeaway\nDelivery\nRestaurant\nBar\nLodging\nCampground\nShopping mall\nClothing\nGallery\nMuseum\nZoo\nCasino\nSpa\n";
                loc += "Search radius:\nPrice level:\nPlace rating:\nOpen now\nHas photos available\nPlace ID\nShow map\nShow info\nI've been here\nReviews\nHistory\nInteresting places\nFilters\nSettings";
                break;
            }
            case "Rus": {
                loc = "Отметить себя\nПоиск...\nПитание\nЖильё\nПокупки\nДосуг\nКафе\nЕда на вынос\nДоставка\nРесторан\nБар\nСъём жилья\nКемпинг\nТорговый центр\nОдежда\nГалерея\nМузей\nЗоопарк\nКазино\nСпа\n";
                loc += "Радиус поиска:\nУровень цен:\nРейтинг места:\nСейчас открыто\nДоступны фото\nID места\nПоказать карту\nПоказать инфо\nЯ здесь был\nОтзывы\nИстория\nИнтересные места\nФильтры\nНастройки";
                break;
            }
            case "Ger": {
                document.getElementsByClassName('sub-menu-item')[1].style = "font-size: 24px";
                loc = "Position setzen\nSuche...\nEssen\nUnterkunft\nEinkaufen\nFreizeit\nCafe\nEssen zum Mitnehmen\nLieferung\nRestaurant\nBar\nUnterkunft\nCamping Platz\nEinkaufszentrum\nKleidung\nGalerie\nMuseum\nZoo\nKasino\nSpa\n";
                loc += "Suchradius:\nPreisniveau:\nPlatzbewertung:\nJetzt geöffnet\nHat Fotos verfügbar\nOrtskennung\nKarte anzeigen\nZeige info\nIch war hier\nBewertungen\nGeschichte\nInteressante Orte\nFilter\ndie Einstellungen";
                break;
            }
        }
        changeLoc(loc);
    })
})

$(document).ready(function () {
    $('.theme-btn').click(function (e) {
        var value = $(this).val();
        var root = document.querySelector(':root');
        switch (value) {
            case "Black": {
                root.style.setProperty('--color0', '#181818');
                root.style.setProperty('--color1', '#212222');
                root.style.setProperty('--color2', 'rgb(130, 57, 255)');
                root.style.setProperty('--color3', 'rgb(78, 28, 167)');
                root.style.setProperty('--color4', 'rgb(61, 26, 128)');
                root.style.setProperty('--color5', 'rgb(48, 20, 100)'); 
                root.style.setProperty('--textColor', '#eceae4');
                root.style.setProperty('--fontFamily', 'Poppins');
                break;
            }
            case "White": {
                root.style.setProperty('--color0', '#DFDFDF');
                root.style.setProperty('--color1', '#F5F5F5');
                root.style.setProperty('--color2', '#FF785B');
                root.style.setProperty('--color3', '#FF5950');
                root.style.setProperty('--color4', '#FFA292');
                root.style.setProperty('--color5', '#ff473d');  
                root.style.setProperty('--textColor', '#282828');
                root.style.setProperty('--fontFamily', 'Poppins');                                              
                break;
            }
        }
        changeTheme([palette]);
    })
})