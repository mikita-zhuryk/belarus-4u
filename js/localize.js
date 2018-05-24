function changeLoc(localizationStr) {
    var lines = localizationStr.split('\n');
    var i = 0;
    document.getElementById('setPos').innerHTML = lines[i++];
    document.getElementById('searchBox').placeholder = lines[i++];
    var menu_items = document.getElementsByClassName('menu-item');
    for (var j = 0; j < menu_items.length; j++) {
        menu_items[j].innerHTML = lines[i++];
    }
    var sub_menu_items = document.getElementsByClassName('sub-menu-item');
    for (var j = 0; j < sub_menu_items.length; j++) {
        sub_menu_items[j].innerHTML = lines[i++];
    }
    var labels = document.getElementsByClassName("filter-label");
    for (var j = 0; j < labels.length; j++) {
        labels[j].innerHTML = lines[i++];
    }
    var afterCheck = document.getElementsByClassName('afterCheckboxFilter');
    afterCheck[0].innerHTML = lines[i++];
    afterCheck[1].innerHTML = lines[i++];
    document.getElementById('identifyWnd').innerHTML = lines[i++];
    document.getElementById('hideBtn').innerHTML = lines[i++];
    document.getElementsByClassName('afterCheckbox')[0].innerHTML = lines[i++];
    document.getElementById('miniHeadWnd').innerHTML = lines[i++];
    historyStr = lines[i++];
    randStr = lines[i++];
    filtStr = lines[i++];
    document.getElementById('setName').innerHTML = lines[i++];
    document.getElementById('langDescr').innerHTML = lines[i++];
    document.getElementById('colorDescr').innerHTML = lines[i++];
}