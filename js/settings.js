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
        switch (value) {
            case "Eng": {
                loc = "Set position\nSearch...\nFood\nLodging\nShopping\nLeisure\nCafe\nMeal Takeaway\nDelivery\nRestaurant\nBar\nLodging\nCampground\nShopping mall\nClothing\nGallery\nMuseum\nZoo\nCasino\nSpa\n";
                loc += "Search radius:\nPrice level:\nPlace rating:\nOpen now\nHas photos available\nPlace ID\nShow map\nShow info\nI've been here\nReviews\nHistory\nInteresting places\nFilters\nSettings\nRating:\nOpen now\nSend review\nType your review here\nThank you! Your review has been saved\n";
                loc += "Language\nStyle";
                break;
            }
            case "Rus": {
                loc = "Отметить себя\nПоиск...\nПитание\nЖильё\nПокупки\nДосуг\nКафе\nЕда на вынос\nДоставка\nРесторан\nБар\nСъём жилья\nКемпинг\nТорговый центр\nОдежда\nГалерея\nМузей\nЗоопарк\nКазино\nСпа\n";
                loc += "Радиус поиска:\nУровень цен:\nРейтинг места:\nСейчас открыто\nДоступны фото\nID места\nПоказать карту\nПоказать инфо\nЯ здесь был\nОтзывы\nИстория\nИнтересные места\nФильтры\nНастройки\nРейтинг:\nСейчас открыто\nОтправить отзыв\nНапишите отзыв здесь\nСпасибо! Ваш отзыв сохранён\n";
                loc += "Язык\nСтиль";
                break;
            }
            case "Ger": {
                loc = "Position setzen\nSuche...\nEssen\nUnterkunft\nEinkaufen\nFreizeit\nCafe\nZum Mitnehmen\nLieferung\nRestaurant\nBar\nUnterkunft\nCamping Platz\nEinkaufszentrum\nKleidung\nGalerie\nMuseum\nZoo\nKasino\nSpa\n";
                loc += "Suchradius:\nPreisniveau:\nPlatzbewertung:\nJetzt geöffnet\nHat Fotos verfügbar\nOrtskennung\nKarte anzeigen\nZeige info\nIch war hier\nBewertungen\nGeschichte\nInteressante Orte\nFilter\ndie Einstellungen\nBewertung:\nJetzt geöffnet\n";
                loc += "Sprache\nStil"
                break;
            }
            case "Fra": {
                loc = "Célébrer\nRecherche...\nAlimentation\nHébergement\nAchat\nLoisir\nCafé\nPlats à emporter\nLivraison\nRestaurant\nBar\nLogement\nCamping\nCentrale d'achats\nVêtements\nGalerie\nMusée\nZoo\nCasino\nSpa\n";
                loc += "Rayon de recherche:\nNiveau de prix:\nClassement du lieu:\nMaintenant ouvert\nPhotos disponibles\nID de l'espace\nCarte\nInfos\nJ'étais ici\nCritiques\nHistoire\nEndroits intéressants\nFiltres\nParamètres\n";
                loc += "La langue\nStyle";
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
                root.style.setProperty('--textColorLite', '#eceae4');
                root.style.setProperty('--textColorDark', '#f1f1f1');                
                root.style.setProperty('--fontFamily', 'Rubik');
                $('#History').attr('src','images/History.png');
                $('#Dice').attr('src','images/Dice.png');                             
                $('#Home').attr('src','images/Home.png');                             
                $('#Sorting').attr('src','images/Sorting.png');
                $('#Service').attr('src','images/Service.png');
                $('#Address').attr('src','images/Address.png');
                $('#Phone').attr('src','images/Phone.png'); 
                imgPhoneSRC = "images/Phone.png";
                imgStarsSRC = "images/Stars.png";           
                $('#Website').attr('src','images/Website.png');
                $('#User1').attr('src','images/User.png');
                $('#User2').attr('src','images/User.png');
                $('#User3').attr('src','images/User.png'); 
                $('#starsWnd').attr('src','images/Stars.png');  
                break;
            }
            case "White": {
                root.style.setProperty('--color0', '#D4D8E8');
                root.style.setProperty('--color1', '#F7F7F7');
                root.style.setProperty('--color2', '#D4D8E8');
                root.style.setProperty('--color3', '#3C5898');
                root.style.setProperty('--color4', '#3C5898');
                root.style.setProperty('--color5', '#29487D');  
                root.style.setProperty('--textColorLite', '#333333');
                root.style.setProperty('--textColorDark', '#f1f1f1');
                root.style.setProperty('--fontFamily', 'Rubik'); 
                $('#History').attr('src','images/Theme2/History.png');
                $('#Dice').attr('src','images/Theme2/Dice.png');                             
                $('#Home').attr('src','images/Theme2/Home.png');                             
                $('#Sorting').attr('src','images/Theme2/Sorting.png');
                $('#Service').attr('src','images/Theme2/Service.png');
                $('#Address').attr('src','images/Theme2/Address.png');
                $('#Phone').attr('src','images/Theme2/Phone.png'); 
                imgPhoneSRC = "images/Theme2/Phone.png";
                imgStarsSRC = "images/Theme2/Stars.png";           
                $('#Website').attr('src','images/Theme2/Website.png');
                $('#User1').attr('src','images/Theme2/User.png');
                $('#User2').attr('src','images/Theme2/User.png');
                $('#User3').attr('src','images/Theme2/User.png'); 
                $('#starsWnd').attr('src','images/Theme2/Stars.png');                                         
                break;
            }
        }
        changeTheme([palette]);
    })
})