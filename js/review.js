//var fs = require("fs");
var thanks = "Thank you! Your review has been saved";

function alreadyLeftReview() {
    var reviewForm = document.getElementById('userReview');
    reviewForm.placeholder = "Type your review here";
    reviewForm.value = thanks;
    $('#leaveReview').hide();
}

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
        alreadyLeftReview();
    })
})


