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