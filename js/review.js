<<<<<<< HEAD
//var fs = require("fs");

$(document).ready(function () {
    $('#leaveReview').click(function () {
        var id = document.getElementById("identifyWnd").innerHTML;
        var review = document.getElementById("userReview").value;
        var data = {
            id: id,
            text: review
        }
        console.log(data)
        $.ajax({
            url: "/review",
            type: "POST",
            data : data,
            success: function(res) {
                alert(res);
            }
        })
        document.getElementById("userReview").value = null;
=======
var thanks = "Thank you! Your review has been saved";

$(document).ready(function () {
    $('#leaveReview').click(function () {
        var reviewForm = document.getElementById('userReview');
        var review = reviewForm.value;
        alreadyLeftReview();
        console.log(review);
>>>>>>> 27c0443e64cc7ab93a4410290b422bc9a855f470
    })
})


